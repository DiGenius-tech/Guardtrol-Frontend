import React, { useState, useEffect } from "react";
import { Button, Datepicker, Spinner, Table, TextInput } from "flowbite-react";
import "tailwindcss/tailwind.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
} from "../../../../../redux/selectors/auth";
import Pagination from "../../../../../shared/Pagination/Pagination";
import { get } from "../../../../../lib/methods";
import { API_BASE_URL } from "../../../../../constants/api";
import { format } from "date-fns";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";

const PatrolHistory = () => {
  const organization = useSelector(selectOrganization);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [patrolInstances, setPatrolInstances] = useState([]);
  const [filteredPatrolInstances, setFilteredPatrolInstances] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useSelector(selectToken);
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const formattedTime = (date) => format(new Date(date), "hh:mm a");
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");
  const { data: beats } = useGetBeatsQuery(organization, {
    skip: organization ? false : true,
  });

  useEffect(() => {
    getPatrolInstances();
  }, [organization]);

  useEffect(() => {
    filterPatrolInstances();
  }, [startDate, endDate, searchQuery, patrolInstances, selectedBeat]);

  const getPatrolInstances = async () => {
    try {
      if (!organization) return;
      setLoading(true);
      const res = await get(
        API_BASE_URL + `patrols/get-instances/${organization}`,
        token
      );
      setPatrolInstances(res);
      setFilteredPatrolInstances(res);
    } catch (error) {
      console.error("Failed to fetch patrol instances", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatrolInstances = () => {
    let filtered = [...patrolInstances];
    if (startDate && endDate) {
      filtered = filtered.filter((instance) => {
        const instanceDate = new Date(instance.createdAt);
        return (
          instanceDate >= new Date(startDate) &&
          instanceDate <= new Date(endDate)
        );
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((instance) =>
        instance.guard?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBeat) {
      filtered = filtered.filter(
        (instance) => instance.beat?._id === selectedBeat
      );
    }

    setFilteredPatrolInstances(filtered);
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredPatrolInstances?.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const exportToExcel = () => {
    const exclFormat = filteredPatrolInstances?.map((instance) => {
      return {
        Patrol: instance?.patrol?.name || "N/A",
        StartTime: instance?.starttime,
        EndTime: instance?.endtime,
        Status: instance?.status,
        Beat: instance?.beat?.name || "N/A",
        Guard: instance?.guard?.name || "N/A",
        AbandonedBy: instance?.abandonedby?.name || "N/A",
      };
    });

    // Create header information
    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? `${startDate} - ${endDate}` : "All"
        }`,
      ],
      [`Selected Beat: ${selectedBeat || "All Beats"}`],
      [],
      [
        "Patrol",
        "Start Time",
        "End Time",
        "Status",
        "Beat",
        "Guard",
        "Abandoned By",
      ], // Column headers
    ];

    // Combine header and data
    const combinedData = [...headerData, ...exclFormat.map(Object.values)];

    // Create the worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

    // Create a new workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patrol History");

    // Write the workbook to file
    XLSX.writeFile(workbook, "patrol_history.xlsx");
  };

  // const exportToPdf = () => {
  //   const doc = new jsPDF();
  //   const fontSize = 12;
  //   const pageHeight = doc.internal.pageSize.height;
  //   let yPosition = 20;

  //   doc.setFontSize(fontSize);
  //   doc.text("Patrol History Report", 14, yPosition);
  //   yPosition += fontSize + 10;

  //   const headers = [
  //     [
  //       "Key",
  //       "User",
  //       "Status",
  //       "StartTime",
  //       "EndTime",
  //       "Patrol",
  //       "Beat",
  //       "Guard",
  //       "AbandonedBy",
  //     ],
  //   ];

  //   const data = filteredPatrolInstances?.map((instance, index) => [
  //     index + 1,
  //     instance?.key || "N/A",
  //     instance?.user?.name || "N/A",
  //     instance?.status || "N/A",
  //     instance?.starttime || "N/A",
  //     instance?.endtime || "N/A",
  //     instance?.patrol?.name || "N/A",
  //     instance?.beat?.name || "N/A",
  //     instance?.guard?.name || "N/A",
  //     instance?.abandonedby?.name || "N/A",
  //   ]);

  //   doc.autoTable({
  //     startY: yPosition,
  //     head: headers,
  //     body: data,
  //     theme: "striped",
  //     styles: { fontSize: fontSize - 2 },
  //     headStyles: { fillColor: [22, 160, 133] },
  //     margin: { top: 10 },
  //     didDrawPage: (data) => {
  //       const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  //       const totalPages = doc.internal.getNumberOfPages();
  //       const footerText = `Page ${currentPage} of ${totalPages}`;
  //       doc.setFontSize(fontSize - 4);
  //       doc.text(footerText, data.settings.margin.left, pageHeight - 10);
  //     },
  //   });

  //   doc.save("patrol_history.pdf");
  // };

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Patrol History</h2>
        <div className="flex gap-2 mt-1 flex-wrap overflow-y-scroll remove-scrollbar py-1">
          <input
            className="border-gray-300 rounded-md min-w-40 h-10"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="border-gray-300 rounded-md min-w-40 h-10"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            defaultValue={selectedBeat}
            onChange={(e) => {
              setSelectedBeat(e.target.value);
            }}
            className="border px-2 min-w-40 h-10 border-gray-300 rounded-md m-0 w-full sm:w-[48%] md:w-auto"
          >
            <option value="">Select Beat</option>
            {beats?.map((beat) => (
              <option key={beat?._id} value={beat?._id}>
                {beat?.name}
              </option>
            ))}
          </select>
          <TextInput
            type="text"
            className="min-w-40 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guard Name"
          />
          <Button
            color={"blue"}
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 rounded min-w-40 h-10"
          >
            Export to Excel
          </Button>
          {/* <Button
            color={"red"}
            onClick={exportToPdf}
            className="bg-red-500 min-w-40 h-10 text-white px-4 rounded"
          >
            Export to PDF
          </Button> */}
          <Button
            color={"green"}
            onClick={getPatrolInstances}
            className="bg-green-500 text-white px-4 rounded min-w-40 h-10"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                aria-label="Loading spinner"
                className="mr-2"
                size="sm"
                light
              />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </section>

      <div className=" min-h-[300px] max-h-80  overflow-y-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Patrol</Table.HeadCell>
            <Table.HeadCell>Beat</Table.HeadCell>
            <Table.HeadCell>Guard</Table.HeadCell>
            <Table.HeadCell>Abandoned By</Table.HeadCell>

            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell className=" w-52">Start Time</Table.HeadCell>
            <Table.HeadCell className="w-52">End Time</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={7}
                  className="whitespace-nowrap  font-medium  text-center text-gray-900 dark:text-white"
                >
                  <div className="w-full h-full justify-center flex items-center">
                    <Spinner
                      color="success"
                      aria-label="Success spinner example"
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
            {!loading && filteredPatrolInstances?.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={9}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  No History
                </Table.Cell>
              </Table.Row>
            )}
            {!loading &&
              currentEntries?.map((instance, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="capitalize">
                    {instance.patrol?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell>{instance.beat?.name || "N/A"}</Table.Cell>
                  <Table.Cell className="capitalize">
                    {instance.guard?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="capitalize">
                    {instance.abandonedby?.name || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="capitalize">
                    {instance.status}
                  </Table.Cell>
                  <Table.Cell>
                    {instance.starttime
                      ? formatDate(instance.starttime) +
                        "-" +
                        formattedTime(instance.starttime)
                      : "Not completed"}
                  </Table.Cell>
                  <Table.Cell>
                    {instance.endtime
                      ? formatDate(instance.endtime) +
                        "-" +
                        formattedTime(instance.endtime)
                      : "Not completed"}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        totalEntries={filteredPatrolInstances?.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export { PatrolHistory };

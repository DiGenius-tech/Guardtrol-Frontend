import React, { useState, useEffect } from "react";
import { Button, Datepicker, Spinner, Table, TextInput } from "flowbite-react"; // Assuming Input component for search
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import { get } from "../../../../../lib/methods";
import { API_BASE_URL } from "../../../../../constants/api";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
} from "../../../../../redux/selectors/auth";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from "../../../../../shared/Pagination/Pagination";

const GuardsHistory = () => {
  const organization = useSelector(selectOrganization);
  const { data: guards } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filteredPatrols, setFilteredPatrols] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useSelector(selectToken);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isPatrolInstacesFetching, setIsPatrolInstacesFetching] =
    useState(false);
  const [patrols, setPatrols] = useState([]);

  const [loading, setLoading] = useState(false);
  const getPatrolInstances = async () => {
    setIsPatrolInstacesFetching(true);
    try {
      if (!organization) return;
      const res = await get(
        API_BASE_URL + `patrols/get-instances/${organization}`,
        token
      );
      setPatrols(res);
    } catch (error) {
    } finally {
      setIsPatrolInstacesFetching(false);
    }
  };
  useEffect(() => {
    getLogs();
    getPatrolInstances();
  }, [organization]); // Fetch logs on component mount

  useEffect(() => {
    filterLogs();
  }, [startDate, endDate, guards, patrols, searchQuery]);

  const getLogs = async () => {
    try {
      setLoading(true);
      if (!organization) return;
      const res = await get(API_BASE_URL + `logs/${organization}`, token);
      setLogs(res);
      setFilteredLogs(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];
    let filteredPart = [...patrols];

    if (startDate && endDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });

      filteredPart = filteredPart.filter((pat) => {
        const patDate = new Date(pat.createdAt);
        return patDate >= new Date(startDate) && patDate <= new Date(endDate);
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((log) =>
        log?.guard?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
    setFilteredPatrols(filteredPart);
  };

  const calculateAggregates = () => {
    const guardAggregates = {};

    filteredLogs?.forEach((log) => {
      const guardId = log?.guard?._id;
      if (!guardId) return;

      if (!guardAggregates[guardId]) {
        guardAggregates[guardId] = {
          guardName: log?.guard?.name || "N/A",
          totalPatrols: 0,
          totalClockInTime: 0,
          totalClockOutTime: 0,
          patrolCount: 0,
          clockInLogs: [],
          clockOutLogs: [],
        };
      }

      const clockInLog = logs?.find(
        (log) =>
          log?.guard?._id === guardId && log?.message.includes("clocked in")
      );
      const clockOutLog = logs?.find(
        (log) =>
          log?.guard?._id === guardId && log?.message.includes("clockedout")
      );

      if (clockInLog) {
        const clockInTime = new Date(clockInLog.createdAt).getTime();
        guardAggregates[guardId]?.clockInLogs.push(clockInTime);
      }
      if (clockOutLog) {
        const clockOutTime = new Date(clockOutLog.createdAt).getTime();
        guardAggregates[guardId]?.clockOutLogs.push(clockOutTime);
      }

      guardAggregates[guardId].totalPatrols = filteredPatrols?.filter(
        (fp) => fp?.guard?._id === guardId
      )?.length;
    });

    const guardList = Object.values(guardAggregates).map((guard) => {
      const totalClockInTime = guard?.clockInLogs?.reduce(
        (acc, time) => acc + time,
        0
      );
      const totalClockOutTime = guard?.clockOutLogs?.reduce(
        (acc, time) => acc + time,
        0
      );
      return {
        ...guard,
        avgClockInTime:
          guard?.clockInLogs.length > 0
            ? new Date(totalClockInTime / guard.clockInLogs.length)
                .toISOString()
                .substr(11, 8)
            : "N/A",
        avgClockOutTime:
          guard?.clockOutLogs.length > 0
            ? new Date(totalClockOutTime / guard.clockOutLogs.length)
                .toISOString()
                .substr(11, 8)
            : "N/A",
      };
    });

    return guardList;
  };

  const aggregatedData = calculateAggregates();
  const displayedGuards = aggregatedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const exportToExcel = () => {
    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? startDate + " - " + endDate : "All"
        } `,
      ],
      [`Selected Guard: ${searchQuery || "All Guards"}`],
      [],
      ["GuardName", "totalPatrols", "avgClockInTime", "avgClockOutTime"],
    ];

    const exclFormat = aggregatedData?.map((aggregated) => [
      aggregated?.guardName || "N/A",
      aggregated?.totalPatrols,
      aggregated?.avgClockInTime,
      aggregated?.avgClockOutTime,
    ]);

    const combinedData = [...headerData, ...exclFormat];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guards History");

    XLSX.writeFile(wb, "guards_history.xlsx");
  };

  // const exportToPdf = () => {
  //   const doc = new jsPDF();
  //   const fontSize = 12;
  //   const pageHeight = doc.internal.pageSize.height;
  //   let yPosition = 20;

  //   doc.setFontSize(fontSize);
  //   doc.text("Guards History Report", 14, yPosition);
  //   yPosition += fontSize + 10;

  //   const headers = [
  //     [
  //       "Index",
  //       "Guard Name",
  //       "Total Patrols",
  //       "AvgClockInTime",
  //       "AvgClockOutTime",
  //     ],
  //   ];

  //   const data = aggregatedData.map((log, index) => [
  //     index + 1,
  //     log?.name || "N/A",
  //     log?.totalPatrols || "N/A",
  //     log?.avgClockInTime || "N/A",
  //     log?.avgClockOutTime || "N/A",
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

  //   doc.save("guards_history.pdf");
  // };
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = aggregatedData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Guards History</h2>
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

          <TextInput
            type="text"
            className="min-w-40 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guard Name"
          />
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 rounded min-w-40 h-10"
          >
            Export to Excel
          </button>
          {/* <button
            onClick={exportToPdf}
            className="bg-red-500 text-white px-4 rounded  min-w-40 h-10"
          >
            Export to PDF
          </button> */}
          <Button
            color={"green"}
            onClick={getLogs}
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
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Total Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clock In</Table.HeadCell>
            <Table.HeadCell>Avg Clock Out</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
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
            {!loading && displayedGuards?.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
                  className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
                >
                  {"No History"}
                </Table.Cell>
              </Table.Row>
            )}
            {!loading &&
              currentEntries?.map((guard, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {guard.guardName}
                  </Table.Cell>
                  <Table.Cell>{guard.totalPatrols}</Table.Cell>
                  <Table.Cell>{guard.avgClockInTime}</Table.Cell>
                  <Table.Cell>{guard.avgClockOutTime}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        totalEntries={aggregatedData.length}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export { GuardsHistory };

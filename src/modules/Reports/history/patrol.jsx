import React, { useState, useEffect } from "react";
import { Button, Spinner, Table, TextInput } from "flowbite-react";
import "tailwindcss/tailwind.css";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { selectOrganization, selectToken } from "../../../redux/selectors/auth";
import Pagination from "../../../shared/Pagination/Pagination";
import { API_BASE_URL } from "../../../constants/api";
import { format } from "date-fns";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { useFetchPatrolInstancesQuery } from "../../../redux/services/patrol";
import { formatDate, formatTime } from "../../../utils/dateUtils";

const PatrolHistory = () => {
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedBeatData, setselectedBeatData] = useState();

  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization: organization },
    {
      skip: !organization,
    }
  );

  const {
    data: patrolInstancesApiResponse,
    refetch,
    isFetching,
    isLoading,
  } = useFetchPatrolInstancesQuery(
    {
      organizationId: organization,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      guardName: searchQuery ? searchQuery : undefined,
      beatId: selectedBeat ? selectedBeat : undefined,
      page: currentPage,
      limit: entriesPerPage,
    },
    {
      skip: !organization,
    }
  );

  const exportToExcel = () => {
    const exclFormat = patrolInstancesApiResponse.patrols?.map((instance) => ({
      Patrol: instance?.patrol?.name || "N/A",
      StartTime: instance?.starttime,
      EndTime: instance?.endtime,
      Status: instance?.status,
      Beat: instance?.beat?.name || "N/A",
      Guard: instance?.guard?.name || "N/A",
      AbandonedBy: instance?.abandonedby?.name || "N/A",
    }));

    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? `${startDate} - ${endDate}` : "All"
        }`,
      ],
      [`Selected Beat: ${selectedBeatData?.name || "All Beats"}`],
      [],
      [
        "Patrol",
        "Start Time",
        "End Time",
        "Status",
        "Beat",
        "Guard",
        "Abandoned By",
      ],
    ];

    const combinedData = [...headerData, ...exclFormat.map(Object.values)];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patrol History");

    XLSX.writeFile(workbook, "patrol_history.xlsx");
  };

  // const formattedTime = (date) => format(new Date(date), "hh:mm a");
  // const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");

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
            value={selectedBeat}
            onChange={(e) => {
              const selectedBeatId = e.target.value;
              setSelectedBeat(selectedBeatId);
              const selectedBeat = beatsApiResponse?.beats?.find(
                (beat) => beat._id === selectedBeatId
              );

              setselectedBeatData(selectedBeat);
            }}
            className="border px-2 border-gray-300 rounded-md min-w-40 h-10 sm:w-[48%] md:w-auto"
          >
            <option value="">Select Beat</option>
            {beatsApiResponse?.beats?.map((beat) => (
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
            color="blue"
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 rounded min-w-40 h-10"
          >
            Export to Excel
          </Button>
          <Button
            color="green"
            onClick={refetch}
            className="bg-green-500 text-white px-4 rounded min-w-40 h-10"
            disabled={isFetching}
          >
            {isFetching ? (
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

      <div className="min-h-[300px] max-h-80 overflow-y-auto ">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Patrol</Table.HeadCell>
            <Table.HeadCell className=" min-w-40">Beat</Table.HeadCell>
            <Table.HeadCell>Guard</Table.HeadCell>
            <Table.HeadCell>Abandoned By</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell className="min-w-60">Start Time</Table.HeadCell>
            <Table.HeadCell className=" min-w-60">End Time</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={7}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
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
            {!isLoading && patrolInstancesApiResponse.patrols?.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={9}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  No History
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading &&
              patrolInstancesApiResponse.patrols?.map((instance, index) => (
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
                        formatTime(instance.starttime)
                      : "Not completed"}
                  </Table.Cell>
                  <Table.Cell>
                    {instance.endtime
                      ? formatDate(instance.endtime) +
                        "-" +
                        formatTime(instance.endtime)
                      : "Not completed"}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        totalEntries={patrolInstancesApiResponse?.total || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export { PatrolHistory };

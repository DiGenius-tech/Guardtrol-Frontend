import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { Button, Spinner, Table } from "flowbite-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Pagination from "../../../shared/Pagination/Pagination"; // Adjust the import based on your project structure
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import { useFetchTimelineLogsQuery } from "../../../redux/services/timelinelogs";
import { POOLING_TIME } from "../../../constants/static";
import { formatDate, formatDateTime } from "../../../utils/dateUtils";

const BeatsLog = () => {
  const organization = useSelector(selectOrganization);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedBeatData, setselectedBeatData] = useState();

  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization: organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const {
    data: logsAPiResponse,
    refetch,
    isLoading,
    isFetching,
  } = useFetchTimelineLogsQuery(
    {
      organizationId: organization,

      ...(startDate &&
        endDate && {
          startDate,
          endDate,
        }),
      ...(selectedBeat && {
        selectedEntity: selectedBeat,
        entityType: "beat",
      }),
      where: "beat",
      ...(selectedType && {
        type: selectedType,
      }),

      page: currentPage,
      limit: entriesPerPage,
    },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const exportToExcel = () => {
    const columns = [
      { header: "Date", key: "date" },
      { header: "Message", key: "message" },
      { header: "Beat", key: "beat" },
      { header: "Type", key: "type" },
    ];

    const data = logsAPiResponse?.logs?.map((log) => ({
      date: format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
      message: log.message,
      beat: log?.beat?.name || "Unknown",
      type: log.type,
    }));

    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? startDate + " - " + endDate : "All"
        } `,
      ],
      [`Selected Beat: ${selectedBeatData?.name || "All Beats"}`],
      [],
      columns.map((col) => col.header),
    ];

    const dataRows = data.map((log) => [
      log.date,
      log.message,
      log.beat,
      log.type,
    ]);

    const combinedData = [...headerData, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");

    XLSX.writeFile(wb, "logs_history.xlsx");
  };

  const chartData = {
    series: [
      {
        name: "Logs",
        data: logsAPiResponse?.logs?.map((log) => ({
          x: new Date(log.createdAt).getTime(),
          y: 1,
        })),
      },
    ],
    options: {
      chart: {
        type: "line",
      },
      xaxis: {
        type: "datetime",
      },
    },
  };

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Beats Log</h2>
      </section>
      <div className="flex gap-2 mt-1 flex-wrap overflow-y-auto py-1">
        <input
          className="border-gray-300 rounded-md min-w-40 h-10"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border-gray-300 rounded-md min-w-40 h-10"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-2 border-gray-300 rounded-md min-w-40 h-10 sm:w-[48%] md:w-auto"
        >
          <option value="">All Types</option>
          <option value="Clock Action">Clock</option>
          <option value="Patrol Action">Patrol</option>
          {/* <option value="Beat Action">Beat</option> */}
          <option value="Guard Action">Guard</option>
        </select>
        <select
          value={selectedBeat}
          onChange={(e) => {
            const selectedBeatId = e.target.value;
            setSelectedBeat(selectedBeatId);
            const selectedBeat = beatsApiResponse?.beats?.find(
              (beat) => beat._id === selectedBeatId
            );

            console.log(selectedBeat);
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
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white min-w-40 h-10 px-4 rounded w-full sm:w-[48%] md:w-auto"
        >
          Export to Excel
        </button>
        <Button
          color={"green"}
          onClick={refetch}
          className="bg-green-500 min-w-40 h-10 text-white px-4 rounded"
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

      <div className="min-h-[300px]  max-h-80 overflow-y-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Beat</Table.HeadCell>
            <Table.HeadCell className=" w-36">Type</Table.HeadCell>
            <Table.HeadCell className=" w-52">Date</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {isLoading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
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
            {!isLoading &&
              (!logsAPiResponse?.logs ||
                logsAPiResponse?.logs.length === 0) && (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell
                    colSpan={4}
                    className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                  >
                    No Logs
                  </Table.Cell>
                </Table.Row>
              )}
            {!isLoading &&
              logsAPiResponse?.logs?.map((log) => (
                <Table.Row key={log._id}>
                  <Table.Cell>{log.beat?.name || "Unknown"}</Table.Cell>
                  <Table.Cell>{log.type}</Table.Cell>
                  <Table.Cell>{formatDateTime(log.createdAt)}</Table.Cell>
                  <Table.Cell>{log.message}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="relative pt-20 md:mt-4">
        <Pagination
          totalEntries={logsAPiResponse?.total || 0}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={setEntriesPerPage}
        />
      </div>
      <div className="mt-5">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export { BeatsLog };

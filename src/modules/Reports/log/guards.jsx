import React, { useState, useEffect } from "react";
import { Button, Spinner, Table } from "flowbite-react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetGuardsQuery } from "../../../redux/services/guards";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Pagination from "../../../shared/Pagination/Pagination"; // Adjust the import based on your project structure
import { selectOrganization } from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { useFetchTimelineLogsQuery } from "../../../redux/services/timelinelogs";
import { POOLING_TIME } from "../../../constants/static";
import { formatDateTime } from "../../../utils/dateUtils";

const GuardsLog = () => {
  const organization = useSelector(selectOrganization);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedGuard, setSelectedGuard] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data: guards } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  const {
    data: logsAPiResponse,
    refetch,
    isFetching,
  } = useFetchTimelineLogsQuery(
    {
      organizationId: organization,
      ...(startDate &&
        endDate && {
          startDate,
          endDate,
        }),
      ...(selectedGuard && {
        selectedEntity: selectedGuard,
        entityType: "guard",
      }),

      where: "guard",
      // ...(selectedType && {
      //   type: selectedType,
      // }),
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
      { header: "Guard", key: "guard" },
      { header: "Type", key: "type" },
    ];

    const data = logsAPiResponse?.logs?.map((log) => ({
      date: format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
      message: log.message,
      guard: log?.guard?.name || "Unknown",
      type: log.type,
    }));

    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? startDate + " - " + endDate : "All"
        } `,
      ],
      [`Selected Guard: ${selectedGuard || "All Guards"}`],
      [],
      columns.map((col) => col.header),
    ];

    const dataRows = data.map((log) => [
      log.date,
      log.message,
      log.guard,
      log.type,
    ]);

    const combinedData = [...headerData, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    XLSX.writeFile(workbook, "guards_logs.xlsx");
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
        <h2 className="text-xl font-semibold">Guards Log</h2>
      </section>
      <div className="flex gap-2 mt-1 flex-wrap overflow-y-auto py-1">
        <input
          type="datetime-local"
          className="m-0 min-w-40 h-10 sm:w-[48%] md:w-auto border-gray-300 rounded-md"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          className="m-0 min-w-40 h-10 sm:w-[48%] md:w-auto border-gray-300 rounded-md"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          value={selectedGuard}
          onChange={(e) => setSelectedGuard(e.target.value)}
          className="border px-2 min-w-40 h-10 border-gray-300 rounded-md m-0 w-full sm:w-[48%] md:w-auto"
        >
          <option value="">Select Guard</option>
          {guards?.map((guard) => (
            <option key={guard?._id} value={guard?._id}>
              {guard?.name}
            </option>
          ))}
        </select>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white min-w-40 h-10 px-4 rounded sm:w-[48%] md:w-auto"
        >
          Export to Excel
        </button>
        <Button
          color={"green"}
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

      <div className="min-h-[300px] max-h-80 overflow-y-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Guard</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {isFetching && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={3}
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
            {!isFetching &&
              (!logsAPiResponse?.logs ||
                logsAPiResponse?.logs.length === 0) && (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell
                    colSpan={3}
                    className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                  >
                    No Logs
                  </Table.Cell>
                </Table.Row>
              )}
            {!isFetching &&
              logsAPiResponse?.logs?.map((log) => (
                <Table.Row key={log._id}>
                  <Table.Cell>{formatDateTime(log.createdAt)}</Table.Cell>
                  <Table.Cell>{log?.guard?.name}</Table.Cell>
                  <Table.Cell>{log.message}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>

      <div className="relative  pt-20 md:mt-4">
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

export { GuardsLog };

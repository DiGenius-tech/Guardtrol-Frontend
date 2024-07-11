import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { Button, Spinner, Table } from "flowbite-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useGetTimelineLogsQuery } from "../../../../../redux/services/timelinelogs";
import Pagination from "../../../../../shared/Pagination/Pagination"; // Adjust the import based on your project structure
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../../../redux/selectors/auth";

const BeatsLog = () => {
  const organization = useSelector(selectOrganization);
  const {
    data: allLogs,
    refetch,
    isFetching,
  } = useGetTimelineLogsQuery(organization, {
    skip: organization ? false : true,
  });

  const [startDate, setStartDate] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const { data: beats } = useGetBeatsQuery(organization, {
    skip: organization ? false : true,
  });

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  useEffect(() => {
    if (!allLogs) return;

    // Parse date only once
    const parsedStartDate = startDate ? new Date(startDate) : null;

    const parsedEndDate = endDate ? new Date(endDate) : null;

    const newFilteredLogs = allLogs.filter((log) => {
      const logDate = new Date(log.createdAt);
      const logType = log.type;
      const beatId = log?.beat?._id;

      const dateCondition =
        (!parsedStartDate || logDate >= parsedStartDate) &&
        (!parsedEndDate || logDate <= parsedEndDate);

      const typeCondition = !selectedType || logType === selectedType;

      const beatCondition = !selectedBeat || beatId === selectedBeat;

      return dateCondition && typeCondition && beatCondition;
    });

    setFilteredLogs(newFilteredLogs);
  }, [allLogs, startDate, endDate, selectedType, selectedBeat]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const exportToExcel = () => {
    const columns = [
      { header: "Date", key: "date" },
      { header: "Message", key: "message" },
      { header: "Beat", key: "beat" },
      { header: "Type", key: "type" },
    ];

    const data = filteredLogs?.map((log) => ({
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
      [`Selected Beat: ${selectedBeat || "All Beats"}`],
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
        data: filteredLogs?.map((log) => ({
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

  // Pagination logic
  const totalEntries = filteredLogs?.length || 0;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentLogs = filteredLogs?.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Beats Log</h2>
      </section>
      <div className="flex gap-2 mt-1 flex-wrap overflow-y-scroll remove-scrollbar py-1">
        <input
          className="border-gray-300 rounded-md min-w-40 h-10"
          type="datetime-local"
          selected={startDate}
          onChange={(e) => handleDateChange(e.target.value, "start")}
        />

        <input
          type="datetime-local"
          className="border-gray-300 rounded-md min-w-40 h-10"
          selected={endDate}
          onChange={(e) => handleDateChange(e.target.value, "end")}
        />
        <select
          defaultValue={selectedType}
          onChange={handleTypeChange}
          className="border px-2  border-gray-300 rounded-md m-0 min-w-40 h-10 sm:w-[48%] md:w-auto"
        >
          <option value="">All Types</option>
          <option value="Clock Action">Clock Action</option>
          <option value="Patrol Action">Patrol Action</option>
        </select>
        <select
          defaultValue={selectedBeat}
          onChange={(e) => setSelectedBeat(e.target.value)}
          className="border px-2 min-w-40 h-10 border-gray-300 rounded-md m-0 w-full sm:w-[48%] md:w-auto"
        >
          <option value="">Select Beat</option>
          {beats?.map((beat) => (
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

      <div className=" min-h-[300px] max-h-80  overflow-y-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Beat</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {isFetching && (
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
            {!isFetching && (currentLogs?.length === 0 || !currentLogs) && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
                  className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
                >
                  {"No Logs"}
                </Table.Cell>
              </Table.Row>
            )}
            {!isFetching &&
              currentLogs?.map((log) => (
                <Table.Row key={log._id}>
                  <Table.Cell>
                    {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </Table.Cell>
                  <Table.Cell>{log.message}</Table.Cell>
                  <Table.Cell>{log.beat?.name || "Unknown"}</Table.Cell>
                  <Table.Cell>{log.type}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="relative mt-16">
        <Pagination
          totalEntries={totalEntries}
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

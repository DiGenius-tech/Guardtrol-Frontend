import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { Datepicker, Table } from "flowbite-react";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import { format } from "date-fns";
import { useGetTimelineLogsQuery } from "../../../../../redux/services/timelinelogs";

const BeatsLog = () => {
  const { data: allLogs } = useGetTimelineLogsQuery();
  const [startDate, setStartDate] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const { data: beats } = useGetBeatsQuery();

  //  useEffect(() => {
  // if (allLogs) {
  //   setFilteredLogs(
  //     allLogs.filter((log) => {
  //       const logDate = new Date(log.timestamp);
  //       return (
  //         (!startDate || logDate >= new Date(startDate)) &&
  //         (!endDate || logDate <= new Date(endDate))
  //       );
  //     })
  //   );
  // }
  // }, [allLogs, startDate, endDate]);

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  useEffect(() => {
    const newFilteredLogs = allLogs?.filter((log) => {
      const logDate = new Date(log.createdAt);
      const logType = log.type;
      const BeatId = log?.beat?._id;

      return (!startDate || logDate >= new Date(startDate)) &&
        (!logType || selectedType) === selectedType &&
        selectedBeat
        ? BeatId === selectedBeat
        : true && selectedType
        ? logType === selectedType
        : true && (!endDate || logDate <= new Date(endDate));
    });

    setFilteredLogs(newFilteredLogs);
  }, [startDate, endDate, selectedType, selectedBeat]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const exportToExcel = () => {
    const columns = [
      { header: "Date", key: "date" },
      { header: "User", key: "user" },
      { header: "Message", key: "message" },
      { header: "Beat", key: "beat" },
      { header: "Type", key: "type" },
    ];

    // Map the filteredLogs to the defined columns
    const data = filteredLogs.map((log) => ({
      date: format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
      user: log.user?.name || "Unknown",
      message: log.message,
      beat: log?.beat?.name || "Unknown",
      type: log.type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.sheet_add_aoa(worksheet, [columns.map((col) => col.header)], {
      origin: "A1",
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "beats_logs.xlsx");
  };

  const chartData = {
    series: [
      {
        name: "Logs",
        data: filteredLogs?.map((log) => ({
          x: new Date(log.createdAt).getTime(),
          y: 1, // You can customize this value based on your requirements
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
    <div className="container mx-auto">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Beats Log</h2>
      </section>
      <div className="flex  flex-wrap gap-3">
        <input
          type="date"
          label="Start Date"
          className="m-0 w-full sm:w-[48%] md:w-auto"
          selected={startDate}
          onChange={(e) => handleDateChange(e.target.value, "start")}
        />
        <input
          type="date"
          className="m-0 w-full sm:w-[48%] md:w-auto"
          label="End Date"
          selected={endDate}
          onChange={(e) => handleDateChange(e.target.value, "end")}
        />
        <select
          defaultValue={selectedType}
          onChange={handleTypeChange}
          className="border px-2 h-[41.6px] rounded m-0 w-full sm:w-[48%] md:w-auto"
        >
          <option value="">All Types</option>
          <option value="Clock Action">Clock Action</option>
          <option value="Patrol Action">Patrol Action</option>
        </select>
        <select
          defaultValue={selectedBeat}
          onChange={(e) => setSelectedBeat(e.target.value)}
          className="border px-2 h-[41.6px] rounded m-0 w-full sm:w-[48%] md:w-auto"
        >
          <option value="">Select Beat</option>
          {beats?.map((beat) => (
            <option value={beat?._id}>{beat?.name}</option>
          ))}
          {/* Add other types as needed */}
        </select>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white  h-[41.6px]  px-4 rounded w-full sm:w-[48%] md:w-auto"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-scroll max-h-96 mt-5">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            {/* <Table.HeadCell>User</Table.HeadCell> */}
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Beat</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredLogs
              .filter((log) => log.beat)
              ?.map((log) => (
                <Table.Row key={log._id}>
                  <Table.Cell>
                    {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </Table.Cell>
                  {/* <Table.Cell>{log.user?.name || "Unknown"}</Table.Cell> */}
                  <Table.Cell>{log.message}</Table.Cell>
                  <Table.Cell>{log.beat?.name || "Unknown"}</Table.Cell>
                  <Table.Cell>{log.type}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
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

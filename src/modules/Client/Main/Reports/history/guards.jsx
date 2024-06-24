import React, { useState, useEffect } from "react";
import { Datepicker, Table, TextInput } from "flowbite-react"; // Assuming Input component for search
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";
import { get } from "../../../../../lib/methods";
import { API_BASE_URL } from "../../../../../constants/api";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../../redux/selectors/auth";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from "../../../../../shared/Pagination/Pagination";

const GuardsHistory = () => {
  const { data: guards } = useGetGuardsQuery();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useSelector(selectToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    getLogs();
  }, []); // Fetch logs on component mount

  useEffect(() => {
    filterLogs();
  }, [startDate, endDate, guards]);

  const getLogs = async () => {
    const res = await get(API_BASE_URL + "logs", token);
    setLogs(res);
    setFilteredLogs(res);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (startDate && endDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((log) =>
        log.guard.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
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

      guardAggregates[guardId].totalPatrols += 1;
      guardAggregates[guardId].patrolCount += 1;
    });

    const guardList = Object.values(guardAggregates).map((guard) => {
      const totalClockInTime = guard?.clockInLogs.reduce(
        (acc, time) => acc + time,
        0
      );
      const totalClockOutTime = guard?.clockOutLogs.reduce(
        (acc, time) => acc + time,
        0
      );
      console.log(totalClockInTime / guard?.clockInLogs.length);
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
  console.log(aggregatedData);

  const exportToExcel = () => {
    const exclFormat = aggregatedData.map((aggregated) => {
      return {
        GuardName: aggregated?.guardName || "N/A",
        totalPatrols: aggregated?.totalPatrols,
        avgClockInTime: aggregated?.avgClockInTime,
        avgClockOutTime: aggregated?.avgClockOutTime,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(exclFormat);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guards History");
    XLSX.writeFile(workbook, "guards_history.xlsx");
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const fontSize = 12;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    doc.setFontSize(fontSize);
    doc.text("Guards History Report", 14, yPosition);
    yPosition += fontSize + 10;

    const headers = [
      [
        "Index",
        "Guard Name",
        "Total Patrols",
        "AvgClockInTime",
        "AvgClockOutTime",
      ],
    ];

    const data = aggregatedData.map((log, index) => [
      index + 1,
      log?.name || "N/A",
      log?.totalPatrols || "N/A",
      log?.avgClockInTime || "N/A",
      log?.avgClockOutTime || "N/A",
    ]);

    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: data,
      theme: "striped",
      styles: { fontSize: fontSize - 2 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
      didDrawPage: (data) => {
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        const totalPages = doc.internal.getNumberOfPages();
        const footerText = `Page ${currentPage} of ${totalPages}`;
        doc.setFontSize(fontSize - 4);
        doc.text(footerText, data.settings.margin.left, pageHeight - 10);
      },
    });

    doc.save("guards_history.pdf");
  };
  return (
    <div className="container mx-auto relative min-h-[450px]">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Guards History</h2>
        <div className="flex space-x-4 mt-4">
          <Datepicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
          />
          <Datepicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
          />
          <TextInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guard Name"
          />
        </div>
      </section>
      <button
        onClick={exportToExcel}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Export to Excel
      </button>
      <button
        onClick={exportToPdf}
        className="bg-red-500 text-white py-2 px-4 rounded mt-4 ml-4"
      >
        Export to PDF
      </button>
      <div className=" max-h-80 mt-5">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Total Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clock In</Table.HeadCell>
            <Table.HeadCell>Avg Clock Out</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {displayedGuards?.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
                  className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
                >
                  {"No History"}
                </Table.Cell>
              </Table.Row>
            )}
            {displayedGuards?.map((guard, index) => (
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

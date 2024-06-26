import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useSelector } from "react-redux";
import { Datepicker, Table, Select, Button, Spinner } from "flowbite-react";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import { get } from "../../../../../lib/methods";
import { selectToken } from "../../../../../redux/selectors/auth";
import { API_BASE_URL } from "../../../../../constants/api";
import Pagination from "../../../../../shared/Pagination/Pagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BeatsHistory = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [patrols, setPatrols] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredPatrols, setFilteredPatrols] = useState([]);
  const { data: guards } = useGetGuardsQuery();
  const { data: beats } = useGetBeatsQuery();
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const token = useSelector(selectToken);
  const fetchData = async () => {
    try {
      setLoading(true);
      const patrolInstances = await get(
        API_BASE_URL + "patrols/get-instances",
        token
      );
      setPatrols(patrolInstances);
      setFilteredPatrols(patrolInstances);

      const logData = await get(API_BASE_URL + "logs", token);
      setLogs(logData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  const handleFilterChange = () => {
    let filteredData = patrols;

    if (selectedBeat) {
      filteredData = filteredData.filter(
        (patrol) => patrol.beat && patrol.beat._id === selectedBeat
      );
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter((patrol) => {
        const logDate = new Date(patrol.createdAt);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });
    }

    setFilteredPatrols(filteredData);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedBeat, startDate, endDate]);

  const calculateAggregates = () => {
    const beatAggregates = {};

    filteredPatrols?.forEach((patrol) => {
      const beatId = patrol?.beat?._id;
      if (!beatId) return;

      if (!beatAggregates[beatId]) {
        beatAggregates[beatId] = {
          beatName: patrol?.beat?.name || "N/A",
          totalPatrols: 0,
          totalClockInTime: 0,
          totalClockOutTime: 0,
          patrolCount: 0,
          clockInLogs: [],
          clockOutLogs: [],
        };
      }

      const clockInLog = logs.find(
        (log) =>
          log?.guard?._id === patrol?.guard?._id &&
          log?.beat?._id === beatId &&
          log.message.includes("clocked in")
      );
      const clockOutLog = logs.find(
        (log) =>
          log?.guard?._id === patrol?.guard?._id &&
          log?.beat?._id === beatId &&
          log?.message.includes("clockedout")
      );

      if (clockInLog) {
        const clockInTime = new Date(clockInLog.createdAt).getTime();
        beatAggregates[beatId]?.clockInLogs.push(clockInTime);
      }
      if (clockOutLog) {
        const clockOutTime = new Date(clockOutLog.createdAt).getTime();
        beatAggregates[beatId]?.clockOutLogs.push(clockOutTime);
      }

      beatAggregates[beatId].totalPatrols += 1;
      beatAggregates[beatId].patrolCount += 1;
    });

    const beatList = Object.values(beatAggregates).map((beat) => {
      const totalClockInTime = beat.clockInLogs?.reduce(
        (acc, time) => acc + time,
        0
      );
      const totalClockOutTime = beat.clockOutLogs?.reduce(
        (acc, time) => acc + time,
        0
      );
      return {
        ...beat,
        avgClockInTime:
          beat?.clockInLogs?.length > 0
            ? new Date(totalClockInTime / beat?.clockInLogs.length)
                .toISOString()
                .substr(11, 8)
            : "N/A",
        avgClockOutTime:
          beat.clockOutLogs.length > 0
            ? new Date(totalClockOutTime / beat?.clockOutLogs.length)
                .toISOString()
                .substr(11, 8)
            : "N/A",
      };
    });

    return beatList;
  };

  const aggregatedData = calculateAggregates();
  const displayedPatrols = aggregatedData?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const exportToExcel = () => {
    const exclFormat = aggregatedData?.map((aggregated) => {
      return {
        beatName: aggregated?.name || "N/A",
        totalPatrols: aggregated?.totalPatrols,
        patrolCount: aggregated?.patrolCount,
        avgClockInTime: aggregated?.avgClockInTime,
        avgClockOutTime: aggregated?.avgClockOutTime,
      };
    });
    const ws = XLSX.utils.json_to_sheet(exclFormat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Beats History");
    XLSX.writeFile(wb, "beats_history.xlsx");
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Beat name",
          "Total Patrols",
          "Avg Clock-in Time",
          "Avg Clock-out Time",
        ],
      ],
      body: aggregatedData.map((beat) => [
        beat.beatName,
        beat.totalPatrols,
        beat.avgClockInTime,
        beat.avgClockOutTime,
      ]),
    });
    doc.save("beats_history.pdf");
  };
  return (
    <div className="container mx-auto relative min-h-[450px]  pb-36">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Beats History</h2>
        <div className="flex gap-2 mt-4">
          <input
            className="border-gray-300 rounded-md"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="border-gray-300 rounded-md"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Select
            id="beat"
            value={selectedBeat}
            onChange={(e) => setSelectedBeat(e.target.value)}
            placeholder="Select Beat"
          >
            <option value="">All Beats</option>
            {beats?.map((beat) => (
              <option key={beat._id} value={beat._id}>
                {beat.name}
              </option>
            ))}
          </Select>
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white  px-4 rounded "
          >
            Export to Excel
          </button>
          <button
            onClick={exportToPdf}
            className="bg-red-500 text-white  px-4 rounded "
          >
            Export to PDF
          </button>
          <Button
            color={"green"}
            onClick={fetchData}
            className="bg-green-500 text-white px-4 rounded"
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
      <div className="overflow-x-auto mt-5 mb-40">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Beat name</Table.HeadCell>
            <Table.HeadCell>Total Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clock-in Time</Table.HeadCell>
            <Table.HeadCell>Avg Clock-out Time</Table.HeadCell>
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
            {!loading && displayedPatrols?.length === 0 && (
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
              displayedPatrols.map((beat, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {beat.beatName}
                  </Table.Cell>
                  <Table.Cell>{beat.totalPatrols}</Table.Cell>
                  <Table.Cell>{beat.avgClockInTime}</Table.Cell>
                  <Table.Cell>{beat.avgClockOutTime}</Table.Cell>
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

export { BeatsHistory };

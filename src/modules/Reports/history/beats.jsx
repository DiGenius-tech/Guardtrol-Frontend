import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { useSelector } from "react-redux";
import { Table, Select, Button, Spinner } from "flowbite-react";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { selectOrganization, selectToken } from "../../../redux/selectors/auth";
import Pagination from "../../../shared/Pagination/Pagination";
import * as XLSX from "xlsx";
import { useFetchBeatHistoryQuery } from "../../../redux/services/reports";
import { POOLING_TIME } from "../../../constants/static";

const BeatsHistory = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedBeatData, setselectedBeatData] = useState();

  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);

  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization: organization },
    {
      skip: !organization,
    }
  );

  const {
    data: patrolsApiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useFetchBeatHistoryQuery(
    {
      organizationId: organization,
      page: currentPage,
      limit: entriesPerPage,
      beatId: selectedBeat ? selectedBeat : undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    },
    { skip: !organization, pollingInterval: POOLING_TIME }
  );

  const aggregatedData = patrolsApiResponse?.patrols || [];
  const totalEntries = patrolsApiResponse?.total || 0;

  const exportToExcel = () => {
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
        "beatName",
        "totalPatrols",
        "completedPatrols",
        "abandonedPatrols",
        "avgClockInTime",
        "avgClockOutTime",
      ],
    ];

    const exclFormat = aggregatedData.map((aggregated) => [
      aggregated.beatName || "N/A",
      aggregated.totalPatrols,
      aggregated.completedPatrols,
      aggregated.abandonedPatrols,
      aggregated.avgClockInTime,
      aggregated.avgClockOutTime,
    ]);

    const combinedData = [...headerData, ...exclFormat];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Beats History");
    XLSX.writeFile(wb, "beats_history.xlsx");
  };

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Beats History</h2>
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

          <Select
            id="beat"
            className="min-w-40 h-10"
            value={selectedBeat}
            onChange={(e) => {
              const selectedBeatId = e.target.value;
              setSelectedBeat(selectedBeatId);
              const selectedBeat = beatsApiResponse?.beats?.find(
                (beat) => beat._id === selectedBeatId
              );

              setselectedBeatData(selectedBeat);
            }}
            placeholder="Select Beat"
          >
            <option value="">All Beats</option>
            {beatsApiResponse?.beats?.map((beat) => (
              <option key={beat._id} value={beat._id}>
                {beat.name}
              </option>
            ))}
          </Select>
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white min-w-40 h-10 px-4 rounded"
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
      </section>
      <div className="min-h-[300px] max-h-80 overflow-y-auto ">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Beat name</Table.HeadCell>
            <Table.HeadCell>Total Patrols</Table.HeadCell>
            <Table.HeadCell>Completed Patrols</Table.HeadCell>
            <Table.HeadCell>Abandoned Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clock-in Time</Table.HeadCell>
            <Table.HeadCell>Avg Clock-out Time</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={6}
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
            {!isLoading && aggregatedData.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={6}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  No History
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading &&
              aggregatedData.map((beat, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {beat.beatName}
                  </Table.Cell>
                  <Table.Cell>{beat.totalPatrols}</Table.Cell>
                  <Table.Cell>{beat.completedPatrols}</Table.Cell>
                  <Table.Cell>{beat.abandonedPatrols}</Table.Cell>
                  <Table.Cell>{beat.avgClockInTime}</Table.Cell>
                  <Table.Cell>{beat.avgClockOutTime}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        totalEntries={totalEntries}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export { BeatsHistory };

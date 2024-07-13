import React, { useState, useEffect } from "react";
import { Button, Spinner, Table, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import {
  selectOrganization,
  selectToken,
} from "../../../../../redux/selectors/auth";
import Pagination from "../../../../../shared/Pagination/Pagination";
import * as XLSX from "xlsx";
import "tailwindcss/tailwind.css";
import { useFetchGuardHistoryQuery } from "../../../../../redux/services/reports";
import { useDebouncedValue } from "../../../../../utils/assetHelper";
import { POOLING_TIME } from "../../../../../constants/static";

const GuardsHistory = () => {
  const organization = useSelector(selectOrganization);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const debouncedSearchQuery = useDebouncedValue(searchQuery);

  const { data, refetch, isFetching } = useFetchGuardHistoryQuery(
    {
      organizationId: organization,
      page: currentPage,
      limit: entriesPerPage,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      searchQuery: debouncedSearchQuery ? debouncedSearchQuery : undefined,
    },
    { skip: !organization, pollingInterval: POOLING_TIME }
  );

  const aggregatedData = data?.patrols || [];
  const totalEntries = data?.total || 0;

  const exportToExcel = () => {
    const headerData = [
      ["Filter Information"],
      [
        `Date Range: ${
          startDate && endDate ? `${startDate} - ${endDate}` : "All"
        }`,
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
      <div className="min-h-[300px] max-h-80 overflow-y-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Total Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clock In</Table.HeadCell>
            <Table.HeadCell>Avg Clock Out</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isFetching && (
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
            {!isFetching && aggregatedData.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={4}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  No History
                </Table.Cell>
              </Table.Row>
            )}
            {!isFetching &&
              currentEntries.map((guard, index) => (
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
        totalEntries={totalEntries}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export { GuardsHistory };

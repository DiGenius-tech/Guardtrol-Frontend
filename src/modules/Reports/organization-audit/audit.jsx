import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useFetchTimelineLogsQuery } from "../../../redux/services/timelinelogs"; // Adjust the import based on your actual service path
import { Button, Spinner, Table } from "flowbite-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Pagination from "../../../shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import { POOLING_TIME } from "../../../constants/static";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { formatDateTime } from "../../../utils/dateUtils";

const OrganizationAudits = () => {
  const organization = useSelector(selectOrganization);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedBeat, setSelectedBeat] = useState("");
  const [selectedBeatData, setselectedBeatData] = useState();

  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization: organization },
    {
      skip: organization ? false : true,
    }
  );
  const {
    data: auditsApiResponse,
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
      ...(selectedType && {
        selectedType,
      }),
      ...(selectedBeat && {
        selectedEntity: selectedBeat,
        entityType: "beat",
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
      { header: "Type", key: "type" },
    ];

    const data = auditsApiResponse?.audits?.map((audit) => ({
      date: format(new Date(audit.createdAt), "yyyy-MM-dd HH:mm:ss"),
      message: audit.message,
      type: audit.type,
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
      columns?.map((col) => col.header),
    ];

    const dataRows = data
      ? data?.map((audit) => [
          audit.date,
          audit.message,
          audit.type,
          audit.beat?.name,
        ])
      : [];

    const combinedData = [...headerData, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Organization Audits");

    XLSX.writeFile(wb, "organization_audits.xlsx");
  };

  const chartData = {
    series: [
      {
        name: "Audits",
        data: auditsApiResponse
          ? auditsApiResponse?.audits?.map((audit) => ({
              x: new Date(audit.createdAt).getTime(),
              y: 1,
            }))
          : [],
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
        <h2 className="text-xl font-semibold">Organization Audits</h2>
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

      <div className="min-h-[300px] max-h-80 overflow-y-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Performed By</Table.HeadCell>
            <Table.HeadCell>Guard </Table.HeadCell>
            <Table.HeadCell>Beat </Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
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
              (!auditsApiResponse?.audits ||
                auditsApiResponse?.audits.length === 0) && (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell
                    colSpan={6}
                    className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                  >
                    No Audits
                  </Table.Cell>
                </Table.Row>
              )}
            {!isFetching &&
              auditsApiResponse?.audits?.map((audit) => (
                <Table.Row key={audit._id}>
                  <Table.Cell>{formatDateTime(audit.createdAt)}</Table.Cell>
                  <Table.Cell>{audit?.message}</Table.Cell>
                  <Table.Cell>
                    {audit?.performer?.name ? audit?.performer?.name : "-----"}
                  </Table.Cell>
                  <Table.Cell>
                    {audit?.beat?.name ? audit?.beat?.name : "------"}
                  </Table.Cell>
                  <Table.Cell>
                    {audit?.guard?.name ? audit?.guard?.name : "------"}
                  </Table.Cell>
                  <Table.Cell>{audit.type}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="relative mt-36 md:mt-4">
        <Pagination
          totalEntries={auditsApiResponse?.total || 0}
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

export { OrganizationAudits };

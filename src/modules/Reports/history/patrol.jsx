import React, { useState, useEffect } from "react";
import { Button, Spinner, Table, TextInput, Modal } from "flowbite-react";
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
import { Badge } from "../../../components/badge";

const PatrolHistory = () => {
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedBeatData, setselectedBeatData] = useState();
  
  // State for description logs popup
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [currentPatrolDetails, setCurrentPatrolDetails] = useState(null);

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
      ...(selectedStatus && { status: selectedStatus }),
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

  const formatPatrolInstancesData = (data) => {
    return data.map((patrolInstance) => ({
      ...patrolInstance,
      status: <Badge status={patrolInstance.status} type={"PATROL_STATUS"} />,
    }));
  };
  
  // Handle opening the logs modal
  const handleViewDetails = (instance) => {
    setCurrentPatrolDetails(instance);
    setShowLogsModal(true);
  };

  // Helper function to prepare description for display
  const prepareDescription = (description) => {
    if (!description) {
      return [];
    }
    
    if (Array.isArray(description)) {
      return description.filter(item => item && item.trim() !== "");
    }
    
    if (typeof description === 'string' && description.trim() !== "") {
      return [description];
    }
    
    return [];
  };

  // Check if description has content
  const hasDescriptionContent = (description) => {
    if (!description) return false;
    if (Array.isArray(description)) return description.some(item => item && item.trim() !== "");
    if (typeof description === 'string') return description.trim() !== "";
    return false;
  };

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
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            className="border px-2 border-gray-300 rounded-md min-w-40 h-10 sm:w-[48%] md:w-auto"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="abandoned">Abandoned</option>
            <option value="completed">Completed</option>
            <option value="interrupted">Interrupted</option>
          </select>
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
            <Table.HeadCell className=" min-w-40">Abandoned By</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell className="min-w-60">Start Time</Table.HeadCell>
            <Table.HeadCell className=" min-w-60">End Time</Table.HeadCell>
            <Table.HeadCell className=" min-w-100">Description</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={8}
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
                  colSpan={8}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  No History
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading &&
              formatPatrolInstancesData(
                patrolInstancesApiResponse.patrols
              )?.map((instance, index) => (
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
                  <Table.Cell>
                    {hasDescriptionContent(instance.description) ? (
                      <Button 
                        size="sm" 
                        className="bg-[#008080]"
                        color="info"
                        onClick={() => handleViewDetails(instance)}
                      >
                        View Logs
                      </Button>
                    ) : (
                      <span className="text-gray-500">No description</span>
                    )}
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

      {/* Enhanced Patrol Details Modal */}
      <Modal
        show={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        size="lg"
      >
        <Modal.Header>
          <span className="text-lg font-semibold">
            Patrol Details: {currentPatrolDetails?.patrol?.name || "N/A"}
          </span>
        </Modal.Header>
        <Modal.Body>
          {currentPatrolDetails && (
            <div className="space-y-6">
              {/* Patrol Information Section */}
              <div className="border-b pb-4">
                <h3 className="text-md font-semibold mb-3">Patrol Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Beat</p>
                    <p className="font-medium">{currentPatrolDetails.beat?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="font-medium mt-1">
                      {typeof currentPatrolDetails.status === 'string' ? (
                        <Badge status={currentPatrolDetails.status} type={"PATROL_STATUS"} />
                      ) : (
                        currentPatrolDetails.status
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">
                      {currentPatrolDetails.starttime
                        ? `${formatDate(currentPatrolDetails.starttime)} ${formatTime(currentPatrolDetails.starttime)}`
                        : "Not started"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium">
                      {currentPatrolDetails.endtime
                        ? `${formatDate(currentPatrolDetails.endtime)} ${formatTime(currentPatrolDetails.endtime)}`
                        : "Not completed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personnel Section */}
              <div className="border-b pb-4">
                <h3 className="text-md font-semibold mb-3">Personnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Assigned Guard</p>
                    <p className="font-medium capitalize">{currentPatrolDetails.guard?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abandoned By</p>
                    <p className="font-medium capitalize">{currentPatrolDetails.abandonedby?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Description/Logs Section */}
              <div>
                <h3 className="text-md font-semibold mb-3">Patrol Logs</h3>
                {prepareDescription(currentPatrolDetails.description).length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {prepareDescription(currentPatrolDetails.description).map((log, index) => (
                        <li key={index} className="text-gray-700">
                          {log}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No logs available for this patrol</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowLogsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { PatrolHistory };
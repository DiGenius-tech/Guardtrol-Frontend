import React, { useEffect, useState } from "react";
import { Modal, Table, Select, Button, Spinner } from "flowbite-react";
import {
  useApproveModificationMutation,
  useGetAllModificationsQuery,
  useRevertModificationMutation,
} from "../../redux/services/modifications";
import { useGetBeatsQuery } from "../../redux/services/beats";
import { format } from "date-fns";
import Pagination from "../../shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../redux/selectors/auth";
import { ASSET_URL } from "../../constants/api";
import { useGetGuardsQuery } from "../../redux/services/guards";
import { formatDate, formatDateTime } from "../../utils/dateUtils";
import { POOLING_TIME } from "../../constants/static";

const guardAttributes = {
  idname: "Identification Name",
  idfile: "Identification File",
  idnumber: "Identification Number",
  name: "Name",
  personalinformation: "Personal Information",
  height: "Guard height",
  dob: "Guard date of birth",
  sex: "Guard sex",
  state: "Guard state",
  altphone: "Guard altphone",
};
const RequestsHistory = () => {
  const organization = useSelector(selectOrganization);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedModification, setSelectedModification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredModifications, setFilteredModifications] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: guards, refetch: refetchGuards } = useGetGuardsQuery(
    organization,
    {
      skip: organization ? false : true,
    }
  );
  const {
    data: modifications,
    isLoading,
    refetch,
  } = useGetAllModificationsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const handleFilterChange = () => {
    let filteredData = modifications;

    if (selectedStatus) {
      console.log(selectedStatus);
      filteredData = filteredData.filter(
        (modification) => modification.status === selectedStatus
      );
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter((modification) => {
        const logDate = new Date(modification.createdAt);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });
    }

    setFilteredModifications(filteredData);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedStatus, startDate, endDate, modifications]);

  const [approveModification] = useApproveModificationMutation();
  const [revertModification] = useRevertModificationMutation();

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredModifications?.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleApprove = async (id) => {
    await approveModification(id);
    await refetch();
    await refetchGuards();
    setIsModalOpen(false);
  };

  const handleRevert = async (id) => {
    await revertModification(id);
    await refetch();
    await refetchGuards();
    setIsModalOpen(false);
  };

  const openModal = (modification) => {
    setSelectedModification(modification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModification(null);
  };

  const highlightDifferences = (previousState, newState) => {
    const differences = {};
    for (const key in previousState) {
      const prev = previousState[key];
      const newVal = newState[key];
      if (prev !== newVal && JSON.stringify(prev) !== JSON.stringify(newVal)) {
        differences[key] = {
          previous: prev,
          new: newVal,
        };
      }
    }
    return differences;
  };

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <div key={index} className="ml-4">
            {renderValue(item)}
          </div>
        ));
      } else {
        return Object.keys(value).map((key) => {
          return (
            <div key={key} className="ml-4">
              <strong>{guardAttributes?.[key]}:</strong>{" "}
              {renderValue(value[key])}
            </div>
          );
        });
      }
    }
    if (typeof value === "string" && value.includes("uploads/")) {
      return (
        <img
          src={`${ASSET_URL + value}`}
          alt="Identification"
          className="mt-2 mb-2 max-h-40"
        />
      );
    }
    return value;
  };

  const renderDifferences = (differences) => {
    return Object.keys(differences).map((key) => (
      <div key={key} className="mb-2 ml-9">
        <strong>
          {guardAttributes?.[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          :
        </strong>
        <div className="ml-4">
          <div style={{ color: "red", textDecoration: "line-through" }}>
            {renderValue(differences[key].previous)}
          </div>
          &rarr;
          <div style={{ color: "green" }}>
            {renderValue(differences[key].new)}
          </div>
        </div>
      </div>
    ));
  };

  const exportToExcel = () => {
    // Add your export to Excel logic here
  };

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">Requests </h2>

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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            placeholder="Select Status"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="reverted">Reject</option>
          </Select>
          {/* <Button
            onClick={exportToExcel}
            className="bg-blue-500 text-white min-w-40 h-10 px-4 rounded"
          >
            Export to Excel
          </Button> */}
          <Button
            color={"green"}
            onClick={refetch}
            className="bg-green-500 text-white px-4 rounded min-w-40 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
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

      <div className=" min-h-[300px] max-h-80  overflow-y-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>From Beat</Table.HeadCell>
            <Table.HeadCell>Request by</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date Requested</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {!isLoading && currentEntries?.length === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={6}
                  className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
                >
                  {"No Requests"}
                </Table.Cell>
              </Table.Row>
            )}
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center">
                  <Spinner aria-label="Loading" />
                </Table.Cell>
              </Table.Row>
            )}

            {!isLoading &&
              currentEntries?.length !== 0 &&
              currentEntries?.map((modification) => (
                <Table.Row key={modification?.id}>
                  <Table.Cell>{modification?.type}</Table.Cell>
                  <Table.Cell>{modification?.beat?.name}</Table.Cell>
                  <Table.Cell>{modification?.performer?.name}</Table.Cell>
                  <Table.Cell className=" capitalize">
                    {modification?.status}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateTime(modification.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      className="bg-[#008080] "
                      onClick={() => openModal(modification)}
                    >
                      View Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="relative mt-16">
        <Pagination
          totalEntries={modifications?.length || []}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={setEntriesPerPage}
        />
      </div>

      {selectedModification && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <Modal.Header>Request Details</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <strong>Type:</strong> {selectedModification?.type}
              </div>
              <div>
                <strong>Request by:</strong>{" "}
                {selectedModification?.performer?.name}
              </div>
              <div>
                <strong className=" underline">Updates</strong>
                {renderDifferences(
                  highlightDifferences(
                    selectedModification?.previousState,
                    selectedModification?.newState
                  )
                )}
              </div>
              <div className=" capitalize">
                <strong>Status:</strong>{" "}
                {selectedModification?.status === "reverted"
                  ? "Rejected"
                  : selectedModification?.status}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {formatDateTime(selectedModification?.createdAt)}
              </div>
              <div>
                <strong>Updated:</strong>{" "}
                {formatDateTime(selectedModification?.updatedAt)}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="bg-[#008080] text-white px-4 rounded min-w-40 h-10"
              onClick={() => handleApprove(selectedModification?._id)}
              disabled={selectedModification?.status !== "pending"}
            >
              Approve
            </Button>
            <Button
              color="failure"
              onClick={() => handleRevert(selectedModification?._id)}
              disabled={selectedModification?.status !== "pending"}
              className="ml-2"
            >
              Reject
            </Button>
            <Button color="dark" onClick={closeModal} className="ml-2">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export { RequestsHistory };

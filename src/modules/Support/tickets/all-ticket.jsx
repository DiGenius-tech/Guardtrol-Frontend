import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useGetTicketsQuery } from "../../../redux/services/support";
import { selectOrganization } from "../../../redux/selectors/auth";
import { formatDateTime } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../shared/Pagination/Pagination";
import { selectUnreadTickets } from "../../../redux/selectors/notification";
import { removeNotification } from "../../../redux/slice/notificationSlice";

const ViewAllTickets = () => {
  const organization = useSelector(selectOrganization);
  const unreadTickets = useSelector(selectUnreadTickets);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const navigate = useNavigate();

  const {
    data: ticketApiResponse,
    isLoading,
    refetch,
  } = useGetTicketsQuery({
    organization,
    page: currentPage,
    limit: entriesPerPage,
  });
  const indexOfLastEntry = currentPage * entriesPerPage;

  const handleViewTicket = (ticketId) => {
    if (unreadTickets.includes(ticketId)) {
      dispatch(removeNotification(ticketId));
    }
    navigate(`/client/support/tickets/view/${ticketId}`);
  };

  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      <section className="mb-2">
        <h2 className="text-xl font-semibold">All Tickets</h2>
        <div className="flex justify-end gap-2 mt-1 flex-wrap overflow-y-scroll remove-scrollbar py-1">
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
      <div className="min-h-[300px] max-h-80 overflow-y-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Ticket Number</Table.HeadCell>
            <Table.HeadCell>Subject</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>

            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {!isLoading && ticketApiResponse?.total === 0 && (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={5}
                  className="whitespace-nowrap font-medium text-center text-gray-900 dark:text-white"
                >
                  {"No Tickets"}
                </Table.Cell>
              </Table.Row>
            )}
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan="5" className="text-center">
                  <Spinner aria-label="Loading" />
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading &&
              ticketApiResponse?.data?.map((ticket) => {
                return (
                  <Table.Row key={ticket._id}>
                    <Table.Cell>
                      <>{ticket.ticketNumber}</>
                    </Table.Cell>
                    <Table.Cell>
                      <>
                        {ticket.subject}
                        {unreadTickets.includes(ticket._id) ? (
                          <span className="ml-2 text-red-500">*</span>
                        ) : (
                          ""
                        )}
                      </>
                    </Table.Cell>
                    <Table.Cell>
                      <>{ticket.category?.title}</>
                    </Table.Cell>

                    <Table.Cell className="capitalize">
                      {ticket.status}
                    </Table.Cell>
                    <Table.Cell>{formatDateTime(ticket.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <Button
                        className="bg-[#008080]"
                        onClick={() => handleViewTicket(ticket._id)}
                      >
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
      <div className="relative mt-16">
        <Pagination
          totalEntries={ticketApiResponse?.total || 0}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={setEntriesPerPage}
        />
      </div>
    </div>
  );
};

export default ViewAllTickets;

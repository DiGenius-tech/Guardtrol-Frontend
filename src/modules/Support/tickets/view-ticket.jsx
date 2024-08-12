import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Spinner, Textarea } from "flowbite-react";
import { formatDateTime } from "../../../utils/dateUtils";
import TextareaField from "../../Sandbox/TextareaField/TextareaField";
import { useSelector, useDispatch } from "react-redux";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { errorHandler } from "../../../lib/errorHandler";
import {
  useAddTicketReplyMutation,
  useGetTicketsByIDQuery,
  useGetTicketsQuery,
} from "../../../redux/services/support";
import socket from "../../../services/sockets";
import { toast } from "react-toastify";
import { removeNotification } from "../../../redux/slice/notificationSlice";
import { selectUnreadTickets } from "../../../redux/selectors/notification";

const ViewTicket = () => {
  const { ticketId } = useParams();
  const {
    data: ticket,
    isLoading,
    refetch,
    isUninitialized,
  } = useGetTicketsByIDQuery(ticketId);
  const [addTicketResponse, addTicketResponseDetails] =
    useAddTicketReplyMutation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [response, setResponse] = useState("");
  const organization = useSelector(selectOrganization);
  const unreadTickets = useSelector(selectUnreadTickets);

  const handleAddResponse = async () => {
    dispatch(suspenseShow());
    try {
      const res = await addTicketResponse({
        ticketId: ticketId,
        author: user._id,
        message: response,
      }).unwrap();

      if (res.status === "success") {
        toast("Ticket response has been sent");
      }
      setResponse("");
      await refetch();
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(suspenseHide());
    }
  };

  useEffect(() => {
    if (unreadTickets.includes(ticket?._id)) {
      dispatch(removeNotification(ticket?._id));
    }
  }, [unreadTickets]);

  console.log(ticket?.responses);
  return (
    <div className="container mx-auto relative pb-40 sm:pb-20">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner color="success" />
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-4">{ticket?.subject}</h2>
            <div className="mb-4">
              <strong>Category:</strong> {ticket?.category?.title}
            </div>
            <div className="mb-4">
              <strong>Ticket Number:</strong> {ticket?.ticketNumber || "N/A"}
            </div>
            <div className="mb-4">
              <strong>Status:</strong> {ticket?.status}
            </div>
            <div className="mb-4">
              <strong>Created:</strong>{" "}
              {ticket?.createdAt && formatDateTime(ticket?.createdAt)}
            </div>
            <div className="mb-4">
              <strong>Description:</strong>
              <p>{ticket?.description}</p>
            </div>
            {ticket?.status !== "closed" && ticket?.status !== "closed" && (
              <div>
                <Textarea
                  label="Add a Response"
                  placeholder="Enter your response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                />
                <div className="flex justify-end text-right mt-4">
                  <Button
                    className="bg-[#008080]"
                    onClick={handleAddResponse}
                    disabled={addTicketResponseDetails.isLoading}
                  >
                    {"Submit"}
                    {addTicketResponseDetails.isLoading && (
                      <Spinner
                        aria-label="Loading spinner"
                        className="ml-2"
                        color="success"
                      />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <div className="mb-4">
              <strong>Responses:</strong>
              {ticket?.responses?.length === 0 ? (
                <p>No responses yet</p>
              ) : (
                [...ticket?.responses]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((response) => (
                    <div key={response._id} className="border-t pt-2 mt-2">
                      <p>{response.message}</p>
                      <small className="text-gray-500">
                        By {response.author?.name} on{" "}
                        {response.createdAt &&
                          formatDateTime(response.createdAt)}
                      </small>
                    </div>
                  ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewTicket;

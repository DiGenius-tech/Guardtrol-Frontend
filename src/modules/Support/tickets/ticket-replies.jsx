import React, { useState } from "react";
import {
  useGetTicketRepliesQuery,
  useAddTicketReplyMutation,
} from "../../redux/services/supportApi";

const TicketReplies = ({ ticketId }) => {
  const { data: replies } = useGetTicketRepliesQuery(ticketId);
  const [addReply] = useAddTicketReplyMutation();
  const [reply, setReply] = useState("");

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await addReply({ ticketId, reply: { message: reply } });
      setReply("");
    } catch (error) {
      console.error("Failed to add reply", error);
    }
  };

  return (
    <div>
      <h2>Ticket Replies</h2>
      {replies?.map((reply) => (
        <div key={reply._id}>
          <p>{reply.message}</p>
        </div>
      ))}
      <form onSubmit={handleReplySubmit}>
        <textarea
          placeholder="Add a reply"
          value={reply}
          onChange={handleReplyChange}
        ></textarea>
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default TicketReplies;

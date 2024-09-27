import { Outlet } from "react-router-dom";
import TicketToolbar from "./tickets-toolbar";

const TicketLayout = () => {
  return (
    <>
      <TicketToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default TicketLayout;

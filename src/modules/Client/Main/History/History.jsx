import { Tabs } from "flowbite-react";
import React from "react";
import ClockInHistory from "./ClockInHistory/ClockInHistory";
import ClockOutHistory from "./ClockOutHistory/ClockOutHistory";
import OutOnBreakHistory from "./OutOnBreakHistory/OutOnBreakHistory";
import PatrolsHistory from "./PatrolsHistory/PatrolsHistory";
import HistoryToolbar from "./HistoryToolbar/HistoryToolbar";
import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <>
      {/* history-app works! */}

      <HistoryToolbar />
      <div className="py-4">
        <Outlet />
      </div>
    </>
  );
};

export default History;

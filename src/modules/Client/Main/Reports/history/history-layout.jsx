import { Outlet } from "react-router-dom";
import HistoryToolbar from "./history-toolbar";

const HistoryLayout = () => {
  return (
    <>
      <HistoryToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default HistoryLayout;

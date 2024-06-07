import { Outlet } from "react-router-dom";
import ReportToolbar from "./report-toolbar";

const ReportLayout = () => {
  return (
    <>
      <ReportToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default ReportLayout;

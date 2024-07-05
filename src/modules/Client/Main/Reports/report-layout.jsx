import { Outlet } from "react-router-dom";
import ReportToolbar from "./report-toolbar";

const ReportLayout = () => {
  return (
    <>
      <ReportToolbar />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default ReportLayout;

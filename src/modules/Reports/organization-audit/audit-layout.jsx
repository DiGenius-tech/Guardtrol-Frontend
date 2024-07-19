import { Outlet } from "react-router-dom";
import AuditToolbar from "./audit-toolbar";

const AuditLayout = () => {
  return (
    <>
      {/* <HistoryToolbar /> */}
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default AuditLayout;

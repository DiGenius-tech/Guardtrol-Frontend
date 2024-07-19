import { Outlet } from "react-router-dom";
import LogToolbar from "./log-toolbar";

const LogLayout = () => {
  return (
    <>
      <LogToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default LogLayout;

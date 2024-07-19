import { Outlet } from "react-router-dom";
import MetricsToolbar from "./metrics-toolbar";

const MetricsLayout = () => {
  return (
    <>
      <MetricsToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default MetricsLayout;

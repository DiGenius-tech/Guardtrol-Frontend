import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar"; // Assuming you have a DashboardSidebar component

const DashboardLayout = () => {
  return (
    <div>
      <DashboardSidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

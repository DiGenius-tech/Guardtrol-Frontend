import { Outlet } from "react-router-dom";
import PatrolGuardListToolbar from "./guad-list/PatrolGuardListToolbar";

const GuardLayout = () => {
  return (
    <>
      <PatrolGuardListToolbar />
      <div className="my-4"></div>
      <Outlet />
    </>
  );
};

export default GuardLayout;

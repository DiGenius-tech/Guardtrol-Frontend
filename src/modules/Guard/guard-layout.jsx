import { Outlet } from "react-router-dom";
import PatrolGuardListToolbar from "./PatrolGuardList/PatrolGuardListToolbar";

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

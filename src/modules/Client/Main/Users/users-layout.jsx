import { Outlet } from "react-router-dom";
import UsersToolbar from "./users-toolbar";

const UsersLayout = () => {
  return (
    <>
      {/* <UsersToolbar /> */}
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default UsersLayout;

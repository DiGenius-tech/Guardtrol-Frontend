import { Outlet, useNavigate } from "react-router-dom";
import SettingsToolbar from "./SettingsToolbar/SettingsToolbar";

const SettingsLayout = () => {
  return (
    <>
      <SettingsToolbar />
      <div className="mt-4 px-7">
        <Outlet />
      </div>
    </>
  );
};

export default SettingsLayout;

import { Outlet } from "react-router-dom";
import SupportToolbar from "./support-toolbar";

const SupportLayout = () => {
  return (
    <>
      <SupportToolbar />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default SupportLayout;

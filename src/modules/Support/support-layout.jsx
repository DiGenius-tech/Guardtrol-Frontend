import { Outlet } from "react-router-dom";
import SupportToolbar from "./support-toolbar";

const SupportLayout = () => {
  return (
    <>
      <SupportToolbar />
      <div className="bg-gray-50 dark:bg-gray-800 py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
      
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default SupportLayout;

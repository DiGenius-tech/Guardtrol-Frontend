import { Outlet } from "react-router-dom";
import FaqsToolbar from "./faqs-toolbar";

const FaqsLayout = () => {
  return (
    <>
      <FaqsToolbar />
      <div className=" p-4">
        <Outlet />
      </div>
    </>
  );
};

export default FaqsLayout;

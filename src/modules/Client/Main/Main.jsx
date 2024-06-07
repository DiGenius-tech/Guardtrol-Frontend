import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <>
      {/* main-app works! */}
      <div className="bg-[#faffff] min-h-full h-full p-2 sm:p-4">
        <Outlet />
      </div>
    </>
  );
};

export default Main;

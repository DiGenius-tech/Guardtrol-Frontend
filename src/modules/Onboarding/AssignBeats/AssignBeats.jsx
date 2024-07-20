import React from "react";
import { Outlet } from "react-router-dom";

const AssignBeats = () => {
  return (
    <>
      {/* assign-beats-app works! */}
      {/* <h1 className="font-bold text-center text-2xl text-dark-450">
       Assign Guards
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        Now Lets Assign Guards To Specific Beats
      </p> */}
      <div className="mt-8"></div>
      <Outlet />
      <div className="my-16"></div>
    </>
  );
};

export default AssignBeats;

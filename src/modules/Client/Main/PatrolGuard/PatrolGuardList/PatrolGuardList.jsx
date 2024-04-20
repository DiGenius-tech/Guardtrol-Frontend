import "./PatrolGuardList.scss";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import PatrolGuardListToolbar from "./PatrolGuardListToolbar/PatrolGuardListToolbar";

function PatrolGuardList() {
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <PatrolGuardListToolbar />
      <div className="my-4"></div>
      <Outlet />
    </>
  );
}

export default PatrolGuardList;

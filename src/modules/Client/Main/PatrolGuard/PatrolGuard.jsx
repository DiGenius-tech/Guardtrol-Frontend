import { Badge, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";
import EditGuard from "./EditGuard/EditGuard";
import { Outlet } from "react-router-dom";

const PatrolGuard = () => {

  return (
    <>
      {/* patrol-guard-app works! */}

        <Outlet/>
    </>
  );
};

export default PatrolGuard;

import { Badge, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./guad-list/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";
import EditGuard from "./EditGuard/EditGuard";
import { Outlet } from "react-router-dom";

const PatrolGuard = () => {
  const [guardToEdit, setGuardToEdit] = useState(null);

  const [sentRequestCount, setSentRequestCount] = useState(0);
  const [guardCount, setGuardCount] = useState(0);
  const handleSentRequestTitle = () => {
    return (
      <span className="flex flex-nowrap">
        In-Active Guards&nbsp;
        <Badge color="gray">{sentRequestCount.toString()}</Badge>
      </span>
    );
  };

  const handleGuardTitle = () => {
    return (
      <span className="flex flex-nowrap">
        Active Guards&nbsp;
        <Badge color="gray">{guardCount.toString()}</Badge>
      </span>
    );
  };

  return (
    <>
      {/* patrol-guard-app works! */}

      <Outlet />
    </>
  );
};

export default PatrolGuard;

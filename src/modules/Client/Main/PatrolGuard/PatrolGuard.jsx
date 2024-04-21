import { Badge, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";
import EditGuard from "./EditGuard/EditGuard";
import { Outlet } from "react-router-dom";

const PatrolGuard = () => {
  const [guardToEdit, setGuardToEdit] = useState(null)

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

  useEffect(() => {
    console.log("guardToEdit: ", guardToEdit)
  }, [guardToEdit])

  return (
    <>
      {/* patrol-guard-app works! */}

      <div className="tab flex-tabs">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title={handleGuardTitle()}>
            <PatrolGuardList 
            setGuardCount={setGuardCount}
            setGuardToEdit={setGuardToEdit}
            />
          </Tabs.Item>
          <Tabs.Item title={handleSentRequestTitle()}>
            <SentRequest
              sentRequestCount={sentRequestCount}
              setSentRequestCount={setSentRequestCount}
              setGuardToEdit={setGuardToEdit}
            />
          </Tabs.Item>
        </Tabs>
      </div>


      <EditGuard
        guardToEdit={guardToEdit} setGuardToEdit={setGuardToEdit} />
    </>
  );
};

export default PatrolGuard;

import { Badge, Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";
import EditGuard from "./EditGuard/EditGuard";

const PatrolGuard = () => {
  const [guardToEdit, setGuardToEdit] = useState(null)


  useEffect(() => {
    console.log("guardToEdit: ", guardToEdit)
  }, [guardToEdit])

  return (
    <>
      {/* patrol-guard-app works! */}

      <div className="tab flex-tabs">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Guards">
            <PatrolGuardList
              setGuardToEdit={setGuardToEdit} />
          </Tabs.Item>
        </Tabs>
      </div>


      <EditGuard
        guardToEdit={guardToEdit} setGuardToEdit={setGuardToEdit} />
    </>
  );
};

export default PatrolGuard;

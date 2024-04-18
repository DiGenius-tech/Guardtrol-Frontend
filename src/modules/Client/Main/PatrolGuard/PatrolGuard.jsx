import { Badge, Tabs } from "flowbite-react";
import React, { useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";

const PatrolGuard = () => {
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

      <div className="tab flex-tabs">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title={handleGuardTitle()}>
            <PatrolGuardList 
            setGuardCount={setGuardCount}/>
          </Tabs.Item>
          <Tabs.Item title={handleSentRequestTitle()}>
            <SentRequest
              sentRequestCount={sentRequestCount}
              setSentRequestCount={setSentRequestCount}
            />
          </Tabs.Item>
        </Tabs>
      </div>

      {/* <button onClick={() => setSentRequestCount((init) => init + 1)}>
        Click me!
      </button> */}
    </>
  );
};

export default PatrolGuard;

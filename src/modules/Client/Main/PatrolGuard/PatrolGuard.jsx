import { Badge, Tabs } from "flowbite-react";
import React, { useState } from "react";
import "./PatrolGuard.scss";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";
import SentRequest from "./SentRequest/SentRequest";

const PatrolGuard = () => {
  const [sentRequestCount, setSentRequestCount] = useState(0);
  //   const sentRequest = "Sent requests" + sentRequestCount;
  console.log("sentRequestCount: ", sentRequestCount);

  const handleSentRequestTitle = () => {
    return (
      <span className="flex flex-nowrap">
        Sent requests&nbsp;
        <Badge color="gray">{sentRequestCount.toString()}</Badge>
      </span>
    );
  };
  return (
    <>
      {/* patrol-guard-app works! */}

      <div className="tab flex-tabs">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Guards">
            <PatrolGuardList />
          </Tabs.Item>
          <Tabs.Item title={handleSentRequestTitle()}>
            <SentRequest />
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

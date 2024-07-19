import React, { useState } from "react";
import BeatGaurds from "./BeatDetailsTabs/BeatGuards";
import BeatPatrol from "./BeatDetailsTabs/BeatPatrol";
import { Tabs } from "flowbite-react";
import BeatInformation from "./BeatDetailsTabs/BeatInformation";
import AssignedBeatList from "../Onboarding/AssignBeats/AssignedBeatList";
import AssignNewBeat from "../Onboarding/AssignBeats/AssignNewBeat";

const AssignBeat = () => {
  const [page, setPage] = useState("");

  return (
    <div className="tab flex-tabs flex-tab-nowrap">
      {page === "AssignedBeatList" ||
        (page === "" && (
          <AssignedBeatList
            isOnboarding={false}
            page={"adsadda"}
            setPage={setPage}
          />
        ))}
      {page === "AssignNewBeat" && <AssignNewBeat isOnboarding={false} />}
    </div>
  );
};

export default AssignBeat;

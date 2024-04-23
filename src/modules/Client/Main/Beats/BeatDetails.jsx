import React from "react";
import BeatGaurds from "./BeatDetailsTabs/BeatGaurds";
import BeatPatrol from "./BeatDetailsTabs/BeatPatrol";

const BeatDetails = () => {
  return (
    <div className="tab flex-tabs flex-tab-nowrap">
      <Tabs aria-label="Tabs with underline" style="fullWidth">
        <Tabs.Item active title="Personal information">
          <BeatInformation />
        </Tabs.Item>
        <Tabs.Item active title="Personal information">
          <BeatGaurds />
        </Tabs.Item>
        <Tabs.Item active title="Personal information">
          <BeatPatrol />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default BeatDetails;

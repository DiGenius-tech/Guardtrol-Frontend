import React from "react";
import BeatGaurds from "./BeatDetailsTabs/BeatGaurds";
import BeatPatrol from "./BeatDetailsTabs/BeatPatrol";
import { Tabs } from "flowbite-react";
import BeatInformation from "./BeatDetailsTabs/BeatInformation";
import AssignedBeatList from "../../../Onboarding/pages/AssignBeats/AssignedBeatList/AssignedBeatList";
import AssignNewBeat from "../../../Onboarding/pages/AssignBeats/AssignNewBeat/AssignNewBeat";
import AssignBeat from "./AssignBeat";
import { useParams } from "react-router-dom";
import { useGetBeatsQuery } from "../../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/selectors/auth";
import BeatReport from "./BeatDetailsTabs/BeatReport";

const BeatDetails = () => {
  const { beatId } = useParams();
  const user = useSelector(selectUser);

  const {
    data: beats,
    isLoading,
    error,
  } = useGetBeatsQuery(user.userid, { skip: user.userid ? false : true });

  const beat = beats?.find((b) => b._id === beatId);

  return (
    <div className="tab flex-tabs flex-tab-nowrap">
      <Tabs aria-label="Tabs with underline" style="fullWidth">
        <Tabs.Item active title="Beat Information">
          <BeatInformation beat={beat} />
        </Tabs.Item>
        <Tabs.Item active title="Gaurds">
          <BeatGaurds />
        </Tabs.Item>
        <Tabs.Item active title="Patrol">
          <BeatPatrol />
        </Tabs.Item>
        <Tabs.Item active title="Assign To Beat">
          <AssignBeat />
        </Tabs.Item>
        <Tabs.Item active title="Reports">
          <BeatReport />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default BeatDetails;

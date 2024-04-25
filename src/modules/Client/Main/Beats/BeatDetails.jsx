import React from "react";
import BeatGaurds from "./BeatDetailsTabs/BeatGaurds";
import BeatPatrol from "./BeatDetailsTabs/BeatPatrol";
import { Tabs } from "flowbite-react";
import BeatInformation from "./BeatDetailsTabs/BeatInformation";
import AssignedBeatList from "../../../Onboarding/pages/AssignBeats/AssignedBeatList/AssignedBeatList";
import AssignNewBeat from "../../../Onboarding/pages/AssignBeats/AssignNewBeat/AssignNewBeat";
import AssignBeat from "./AssignBeat";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { useGetBeatsQuery } from "../../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/selectors/auth";
import BeatReport from "./BeatDetailsTabs/BeatReport";
import BeatList from "./BeatList";
import BeatDetailsHeader from "./BeatDetailsTabs/BeatDetailsHeader";
import PatrolGuardList from "../PatrolGuard/PatrolGuardList/PatrolGuardList";
import ActivateGuard from "../PatrolGuard/ActivateGuard/ActivateGuard";
import InactivePatrolGuards from "../PatrolGuard/PatrolGuardList/InactivePatrolGuards/InactivePatrolGuards";
import ActivePatrolGuards from "../PatrolGuard/PatrolGuardList/ActivePatrolGuards/ActivePatrolGuards";
import AddGuard from "../../../Onboarding/pages/OnboardGuard/AddGuard/AddGuard";

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
    <>
      <BeatDetailsHeader />
      <Outlet />
    </>
  );
};

export const BeatGaurdRouter = () => {
  const user = useSelector(selectUser);
  const { beatId } = useParams();
  const {
    data: beats,
    isLoading,
    error,
  } = useGetBeatsQuery(user.userid, { skip: user.userid ? false : true });

  const beat = beats?.find((b) => b._id === beatId);
  return (
    <Routes>
      <Route element={<PatrolGuardList />}>
        <Route path="" element={<Navigate to={"active"} />} />
        <Route path="active" element={<ActivePatrolGuards beat={beat} />} />
        <Route path="inactive" element={<InactivePatrolGuards beat={beat} />} />
        <Route path="addguard" element={<AddGuard beat={beat} />} />
      </Route>
    </Routes>
  );
};

export const BeatDetailsRouter = () => {
  return (
    <Routes>
      <Route element={<BeatDetails />}>
        <Route path="" element={<BeatInformation />} />
        <Route path="beat-guards/*" element={<BeatGaurdRouter />} />
        <Route path="beat-patrol" element={<BeatPatrol />} />
        <Route path="beat-report" element={<BeatReport />} />
      </Route>
    </Routes>
  );
};

export default BeatDetails;

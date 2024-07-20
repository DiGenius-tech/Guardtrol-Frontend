import React from "react";
import AssignNewBeat from "../Onboarding/AssignBeats/AssignNewBeat";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { useGetBeatsQuery } from "../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../redux/selectors/auth";
import BeatDetailsHeader from "./BeatDetailsTabs/BeatDetailsHeader";
import PatrolGuardList from "../Guard/PatrolGuardList/PatrolGuardList";
import InactivePatrolGuards from "../Guard/PatrolGuardList/InactivePatrolGuards";
import ActivePatrolGuards from "../Guard/PatrolGuardList/ActivePatrolGuards";

const BeatDetails = () => {
  const { beatId } = useParams();
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);

  const {
    data: beatsApiResponse,
    isLoading,
    error,
  } = useGetBeatsQuery({ organization }, { skip: organization ? false : true });

  const beat = beatsApiResponse?.beats?.find((b) => b._id === beatId);

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
  const organization = useSelector(selectOrganization);

  const {
    data: beatsApiResponse,
    isLoading,
    refetch: refetchGuards,
    error,
  } = useGetBeatsQuery({ organization }, { skip: organization ? false : true });

  const beat = beatsApiResponse?.beats?.find((b) => b._id === beatId);

  return (
    <Routes>
      <Route element={<PatrolGuardList />}>
        <Route path="" element={<Navigate to={"active"} />} />
        <Route path="active" element={<ActivePatrolGuards beat={beat} />} />
        <Route path="inactive" element={<InactivePatrolGuards beat={beat} />} />
        <Route
          path="addguard"
          element={
            <AssignNewBeat
              refetchGuards={refetchGuards}
              isOnboarding={false}
              beat={beat}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export const BeatDetailsRouter = () => {
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);

  const { beatId } = useParams();
  const {
    data: beatsApiResponse,
    isLoading,
    error,
  } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const beat = beatsApiResponse?.beats?.find((b) => b._id === beatId);
  return <BeatDetailsHeader />;
};

export default BeatDetails;

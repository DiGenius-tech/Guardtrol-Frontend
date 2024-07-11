import "./PatrolGuardList.scss";

import { useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import PatrolGuardListToolbar from "./PatrolGuardListToolbar/PatrolGuardListToolbar";
import { useDeleteGuardMutation } from "../../../../../redux/services/guards";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../../redux/selectors/auth";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { useParams } from "react-router-dom";
import AddGuard from "../../../../Onboarding/pages/OnboardGuard/AddGuard/AddGuard";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};

const PatrolGuardList = (props) => {
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const { beatId } = useParams();
  const organization = useSelector(selectOrganization);

  const {
    data: beats,
    isLoading: beatsIsLoading,
    error: beatsFetchError,
  } = useGetBeatsQuery(organization, {
    skip: organization ? false : true,
  });

  const beat = beats?.find((b) => b?._id === beatId);

  const [deleteGuard, { isLoading: isUpdating, status }] =
    useDeleteGuardMutation();

  useEffect(() => {
    console.log(props);
  }, [props]);

  // if (status) {
  //   toast("Guard Deleted Successfully");
  //   setOpen(false);
  // }

  // useEffect(() => {
  //   handleSentRequest();
  // }, [auth.token]);

  // useEffect(() => {
  //   const activeguards = guards.filter((guard) => guard.isactive);
  //   props.setGuardCount(activeguards.length);
  // }, [guards]);

  return (
    <>
      {/* patrol-guard-list-app works! */}
      <PatrolGuardListToolbar />
      <div className="my-4"></div>
      <div className="px-4">
        <Outlet />
      </div>
      {/* <AlertDialog 
        open={open}
        title={`Delete Guard ?`}
        description={`Are You Sure You Want To Delete This Guard ?`}
        setOpen={setOpen}
        actionText="Delete"
        action={deleteGuard}
      /> */}
    </>
  );
};

export default PatrolGuardList;

import "./PatrolGuardList.scss";

import { useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import PatrolGuardListToolbar from "./PatrolGuardListToolbar";
import { useDeleteGuardMutation } from "../../../redux/services/guards";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { useParams } from "react-router-dom";

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

  const [deleteGuard, { isLoading: isUpdating, status }] =
    useDeleteGuardMutation();

  return (
    <>
      <PatrolGuardListToolbar />
      <div className="my-4"></div>
      <div className="px-4">
        <Outlet />
      </div>
    </>
  );
};

export default PatrolGuardList;

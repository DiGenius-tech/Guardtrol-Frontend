import { Card } from "flowbite-react";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";

import { useGetGuardsQuery } from "../../../../../../redux/services/guards";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import { useGetBeatsQuery } from "../../../../../../redux/services/beats";
import { useParams } from "react-router-dom";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};
function ActivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { beatId } = useParams();

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    isUninitialized,
    error,
  } = useGetGuardsQuery();

  const { data: beats } = useGetBeatsQuery();

  const [selectedBeat, setSelectedBeat] = useState({});

  useEffect(() => {
    setSelectedBeat(beats?.find((b) => b?._id === beatId));
  }, [beats]);

  const deleteGuard = async () => {
    dispatch(suspenseShow());
    const data = axios(
      `guard/deleteguard/${user.userid}`,
      "DELETE",
      JSON.stringify(selectedGuard),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    )
      .then((data) => {
        if (data.status) {
          refetchGuards();
          toast("Guard Deleted Successfully");
          setOpen(false);
        }
      })
      .finally(dispatch(suspenseHide()));
  };

  useEffect(() => {
    if (isUninitialized) {
      refetchGuards();
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {/* active-patrol-guards-app works! */}
      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            guards={
              beatId
                ? selectedBeat?.guards?.filter((guard) => guard.isactive)
                : guards?.filter((guard) => guard.isactive)
            }
          />
        </Card>
      </div>
      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          guards={
            beatId
              ? selectedBeat?.guards?.filter((guard) => guard.isactive)
              : guards?.filter((guard) => guard.isactive)
          }
        />
      </div>
    </>
  );
}

export default ActivePatrolGuards;

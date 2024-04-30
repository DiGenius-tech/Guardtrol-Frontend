import { Card } from "flowbite-react";
import { inactive_patrol_guards } from "../../patrol-guard-list";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";

import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import { useGetGuardsQuery } from "../../../../../../redux/services/guards";
import { useGetBeatsQuery } from "../../../../../../redux/services/beats";
import { useParams } from "react-router-dom";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 0,
};
function InactivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { beatId } = useParams();
  const { responseData, sendRequest } = useHttpRequest();

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    error,
  } = useGetGuardsQuery();
  const { data: beats } = useGetBeatsQuery();
  const selectedBeat = beats?.find((b) => b._id === beatId);

  const deleteGuard = async () => {
    dispatch(suspenseShow());
    const data = sendRequest(
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
          toast("Guard Deleted Successfully");
          setOpen(false);
        }
      })
      .finally(dispatch(suspenseHide()));
  };

  useEffect(() => {}, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      {/* inactive-patrol-guards-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            guards={
              selectedBeat?.guards?.filter((guard) => !guard.isactive) ||
              guards?.filter((guard) => !guard.isactive)
            }
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          guards={
            selectedBeat?.guards?.filter((guard) => !guard.isactive) ||
            guards?.filter((guard) => !guard.isactive)
          }
        />
      </div>
    </>
  );
}

export default InactivePatrolGuards;

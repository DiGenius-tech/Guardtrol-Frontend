import { Card } from "flowbite-react";
import { inactive_patrol_guards } from "../../patrol-guard-list";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";

import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import { useGetGuardsQuery } from "../../../../../../redux/services/guards";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 0,
};
function InactivePatrolGuards({ beat }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const { responseData, sendRequest } = useHttpRequest();

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    error,
  } = useGetGuardsQuery();

  const deleteGuard = async () => {
    dispatch(suspenseShow());
    const data = sendRequest(
      `guard/deleteguard/${user.userid}`,
      "DELETE",
      JSON.stringify(selectedGuard),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
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

  useEffect(() => {}, [user.token]);

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
              beat?.guards?.filter((guard) => !guard.isactive) ||
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
            beat?.guards?.filter((guard) => !guard.isactive) ||
            guards?.filter((guard) => !guard.isactive)
          }
        />
      </div>
    </>
  );
}

export default InactivePatrolGuards;

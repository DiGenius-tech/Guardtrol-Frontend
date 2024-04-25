import "./PatrolGuardList.scss";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AlertDialog from "../../../../../shared/Dialog/AlertDialog";
import { Card } from "flowbite-react";
import {
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../../../redux/services/guards";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../../redux/selectors/auth";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { useParams } from "react-router-dom";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};

function PatrolGuardList(props) {
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const { beatId } = useParams();

  const {
    data: guards,
    isLoading,
    error,
  } = useGetGuardsQuery(user.userid, { skip: user.userid ? false : true });

  const {
    data: beats,
    isLoading: beatsIsLoading,
    error: beatsFetchError,
  } = useGetBeatsQuery(user.userid, { skip: user.userid ? false : true });
  const beat = beats?.find((b) => b?._id === beatId);

  const [deleteGuard, { isLoading: isUpdating, status }] =
    useDeleteGuardMutation();

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  console.log(beat);
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            guards={beat?.guards || guards || []}
            setSelectedGuard={setSelectedGuard}
            setOpen={setOpen}
            setGuardToEdit={props.setGuardToEdit}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          guards={beat?.guards || guards || []}
          setSelectedGuard={setSelectedGuard}
          setOpen={setOpen}
          setGuardToEdit={props.setGuardToEdit}
        />
      </div>

      <AlertDialog
        open={open}
        title={`Delete Guard ?`}
        description={`Are You Sure You Want To Delete This Guard ?`}
        setOpen={setOpen}
        actionText="Delete"
        action={deleteGuard}
      />
    </>
  );
}

export default PatrolGuardList;

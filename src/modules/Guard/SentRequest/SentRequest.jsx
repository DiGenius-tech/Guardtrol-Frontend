import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { useEffect, useState, useContext } from "react";
import { patrol_guards } from "../patrol-guard-list";
import SentRequestDesktopView from "./SentRequestDesktopView";
import SentRequestMobileView from "./SentRequestMobileView";
import { Card } from "flowbite-react";
import { toast } from "react-toastify";

import AlertDialog from "../../../shared/Dialog/AlertDialog";
import {
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../redux/services/guards";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";

function SentRequest(props) {
  const { user } = useSelector(selectUser);

  const [inActiveGuards, setInActiveGuards] = useState([]);

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);

  const organization = useSelector(selectOrganization);
  const {
    data: guards,
    isLoading,
    error,
  } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const [deleteGuard, { isLoading: isUpdating, status }] =
    useDeleteGuardMutation();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      {/* sent-request-app works! */}

      <div className="hidden sm:block">
        <Card>
          <SentRequestDesktopView
            sentRequestList={inActiveGuards}
            setSentRequestList={setInActiveGuards}
            icon_menu_dots={icon_menu_dots}
            setSelectedGuard={setSelectedGuard}
            setGuardToEdit={props.setGuardToEdit}
            setOpen={setOpen}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <SentRequestMobileView
          sentRequestList={inActiveGuards}
          setSentRequestList={setInActiveGuards}
          icon_menu_dots={icon_menu_dots}
          setSelectedGuard={setSelectedGuard}
          setGuardToEdit={props.setGuardToEdit}
          setOpen={setOpen}
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

export default SentRequest;

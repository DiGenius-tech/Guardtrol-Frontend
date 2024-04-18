import { Card } from "flowbite-react";
import "./PatrolGuardList.scss";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AlertDialog from "../../../../../shared/Dialog/AlertDialog";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1
};

function PatrolGuardList(props) {
  const auth = useContext(AuthContext)
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [guards, setGuards] = useState([])

  const [selectedGuard, setSelectedGuard] = useState(null)
  const [open, setOpen] = useState(false)

  const handleSentRequest = () => {
    const data = sendRequest(
      `http://localhost:5000/api/guard/getguards/${auth.user.userid}`,
      'GET',
      null,
      {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      }
    ).then(data => {
      const activeguards = data.filter(guard => !guard.isactive)
      setGuards(activeguards)
      props.setGuardCount(activeguards.length)
    })
  };

  const deleteGuard = async () => {
    auth.loading(true)
    const data = sendRequest(
      `http://localhost:5000/api/guard/deleteguard/${auth.user.userid}`,
      'DELETE',
      JSON.stringify(selectedGuard),
      {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      }
    ).then(data => {
      if(data.status){
      setGuards([])
      handleSentRequest()
      toast("Guard Deleted Successfully")
      setOpen(false)
      }
    })
  }

  useEffect(() => {
    handleSentRequest();
  }, [auth.token]);

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            guards={guards}
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
          guards={guards}
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

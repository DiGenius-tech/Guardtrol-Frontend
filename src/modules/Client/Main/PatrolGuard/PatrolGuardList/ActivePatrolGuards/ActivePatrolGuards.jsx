import { Card } from "flowbite-react";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../../shared/Context/AuthContext";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};
function ActivePatrolGuards() {
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
      const activeguards = data?.filter(guard => guard.isactive)
      setGuards(activeguards)
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
      {/* active-patrol-guards-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            guards={guards}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          guards={guards}
        />
      </div>
    </>
  );
}

export default ActivePatrolGuards;

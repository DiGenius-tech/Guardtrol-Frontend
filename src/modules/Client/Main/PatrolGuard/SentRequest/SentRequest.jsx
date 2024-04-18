import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { useEffect, useState, useContext } from "react";
import { patrol_guards } from "../patrol-guard-list";
import SentRequestDesktopView from "./SentRequestDesktopView/SentRequestDesktopView";
import SentRequestMobileView from "./SentRequestMobileView/SentRequestMobileView";
import { Card } from "flowbite-react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import AlertDialog from "../../../../../shared/Dialog/AlertDialog";

function SentRequest(props) {
  const auth = useContext(AuthContext)
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [inActiveGuards, setInActiveGuards] = useState([])

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
      const inactiveguards = data.filter(guard => !guard.isactive)
      setInActiveGuards(inactiveguards)
      props.setSentRequestCount(inactiveguards.length)
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
      if(data?.status){
      setInActiveGuards([])
      handleSentRequest()
      toast("Guard Deleted Successfully")
      setOpen(false)
      return
      }
      setInActiveGuards([])
      handleSentRequest()
      setOpen(false)
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
      {/* sent-request-app works! */}

      <div className="hidden sm:block">
        <Card>
          <SentRequestDesktopView
            sentRequestList={inActiveGuards}
            setSentRequestList={setInActiveGuards}
            icon_menu_dots={icon_menu_dots}
            setSelectedGuard={setSelectedGuard}
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

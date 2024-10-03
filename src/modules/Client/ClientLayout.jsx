import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import brandLogo from "../../images/brand-logo.svg";
import "./Client.scss";
import { HiX } from "react-icons/hi";
import ClientToolbar from "../../components/ClientToolbar";
import ClientSidebar from "../../components/ClientSidebar";
import { useGetSubscriptionQuery } from "../../redux/services/subscriptions";
import {
  selectOrganization,
  selectSupportUser,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { useDispatch, useSelector } from "react-redux";
import RenewSubscription from "../Settings/RenewSubscription";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { addNotification } from "../../redux/slice/notificationSlice";
import { SocketProvider, useSocket } from "../../hooks/useSocket";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { selectPsConfig } from "../../redux/selectors/selectedPlan";

const Client = () => {
  const [isOpenSidenav, setIsOpenSidenav] = useState(false);
  const navigate = useNavigate();
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  let location = useLocation();
  const {
    data: subscription,
    isError,
    isLoading: isLoadingActiveSubscription,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, {
    skip: token && organization ? false : true,
  });

  const handleOpenSidenav = () => {
    setIsOpenSidenav(!isOpenSidenav);
  };

  const SupportUser = useSelector(selectSupportUser);
  const psConfig = useSelector(selectPsConfig);

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };

  const handleNewTicketResponse = (ticketResponse) => {
    toast("Your ticket has an update");
    dispatch(
      api.util.invalidateTags([{ type: "Tickets", _id: ticketResponse.ticket }])
    );
    dispatch(addNotification(ticketResponse.ticket));
  };

  useSocketEvent("new-ticket-response", (data) =>
    handleNewTicketResponse(data)
  );
  // useSocketEvent("new-ticket", (data) => {
  // });
  if (isLoadingActiveSubscription) {
    return (
      <div className="absolute top-0 right-0 z-40 bg-white flex w-full h-full justify-center items-center">
        <Spinner size={"xl"} color="success" />
      </div>
    );
  }

  if (
    !subscription &&
    !isLoadingActiveSubscription &&
    !location.pathname.includes("verify-payment")
  ) {
    return (
      <div className="absolute top-0 right-0 z-40 bg-white w-full h-full flex justify-center items-center">
        <div className="w-full relative top-24">
          <RenewSubscription
            isExpired={true}
            subscription={subscription}
            openModal={true}
            setRenewalModal={() => null}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {SupportUser && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            zIndex: "90",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              borderWidth: "7px",
              borderColor: "#008080",
              width: "100%",
              height: "100%",
              position: "relative",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                width: "max-content",
                paddingLeft: "20px",
                paddingRight: "20px",
                backgroundColor: "#008080",
                color: "#fff",
                position: "absolute",
                bottom: 0,
                left: 0,
                paddingTop: "8px",
              }}
            >
              Support User: {SupportUser?.name}
            </p>
          </div>
        </div>
      )}

      <div className="layout h-screen p-0">
        <div className="sticky top-0 left-0 right-0 z-40">
          <ClientToolbar
            handleOpenSidenav={handleOpenSidenav}
            isOpenSidenav={isOpenSidenav}
          />
        </div>
        <div className="client-body grid grid-cols-12 h-full">
          <div className="col-span-12 md:col-span-2">
            {isOpenSidenav && (
              <div
                onClick={handleOpenSidenav}
                className="sm:hidden z-10 backdrop-brightness-50 fixed top-0 bottom-0 left-0 right-0"
              ></div>
            )}
            <div
              className={
                (isOpenSidenav
                  ? "-left-0 md:left-0 transition ease-out duration-100 "
                  : "left-full md:left-0 transition ease-in duration-75 ") +
                "sidebar h-full fixed md:relative top-0 bottom-0 w-3/4 md:w-full pt-0 z-40 bg-white"
              }
            >
              <div className="md:hidden px-4 py-2 flex items-center justify-between">
                <div className="w-28">
                  <img src={brandLogo} alt="Guardtrol" />
                </div>
                <button onClick={handleOpenSidenav}>
                  <HiX />
                </button>
              </div>
              <ClientSidebar />
            </div>
          </div>
          <div className="col-span-12 md:col-span-10 h-[calc(100vh-80px)]">
            <div className="bg-[#faffff] min-h-full h-full px-4 pt-3 overflow-y-scroll">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;

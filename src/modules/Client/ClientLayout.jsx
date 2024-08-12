import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import brandLogo from "../../images/brand-logo.svg";
import "./Client.scss";
import { HiX } from "react-icons/hi";
import ClientToolbar from "../../components/ClientToolbar";
import ClientSidebar from "../../components/ClientSidebar";
import { useGetSubscriptionQuery } from "../../redux/services/subscriptions";
import { selectOrganization, selectToken } from "../../redux/selectors/auth";
import { useDispatch, useSelector } from "react-redux";
import RenewSubscription from "../Settings/RenewSubscription";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import { Spinner } from "flowbite-react";

const Client = () => {
  const [isOpenSidenav, setIsOpenSidenav] = useState(false);
  const navigate = useNavigate();
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  const {
    data: subscription,
    isError,
    isFetching: isFetchingActiveSubscription,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, { skip: token ? false : true });

  let location = useLocation();
  const handleOpenSidenav = () => {
    setIsOpenSidenav(!isOpenSidenav);
  };

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };

  // useEffect(() => {
  //   setIsOpenSidenav(false);
  //   if (!subscription && !isFetchingActiveSubscription) {
  //     navigate("/client/settings/billing");
  //   }
  // }, [location]);

  if (isFetchingActiveSubscription) {
    return (
      <div className="absolute top-0 right-0 z-40 bg-white flex w-full h-full justify-center items-center">
        <Spinner size={"xl"} color="success" />
      </div>
    );
  }

  if (!subscription && !isFetchingActiveSubscription) {
    return (
      <div className=" absolute top-0 right-0 z-40 bg-white w-full h-full justify-center items-center">
        <div className=" w-full relative  top-24">
          <RenewSubscription
            isExpired={true}
            subscription={subscription}
            openModal={true}
            setRenewalModal={() => null}
          />{" "}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* client-app works! */}

      <div className="layout h-screen p-0">
        <div className="sticky top-0 left-0 right-0 z-40">
          <ClientToolbar
            handleOpenSidenav={handleOpenSidenav}
            isOpenSidenav={isOpenSidenav}
          />
        </div>
        <div className="client-body grid grid-cols-12  h-full">
          <div className="col-span-12 md:col-span-2">
            {isOpenSidenav ? (
              <div
                onClick={handleOpenSidenav}
                className="sm:hidden z-10 backdrop-brightness-50 fixed top-0 bottom-0 left-0 right-0"
              ></div>
            ) : (
              ""
            )}
            <div
              className={
                (isOpenSidenav
                  ? "-left-0 md:left-0 transition ease-out duration-100 "
                  : "left-full md:left-0 transition ease-in duration-75 ") +
                "sidebar | h-full fixed md:relative top-0 bottom-0 w-3/4 md:w-full pt-0 z-40 bg-white"
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
          <div className="col-span-12 md:col-span-10  h-[calc(100vh-80px)]">
            <div className="bg-[#faffff] min-h-full  h-full px-4 pt-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      {/* <div className='sticky top-0 left-0 right-0 z-40'>
                <ClientToolbar />
            </div>
            <div className='min-h-screen bg-[#faffff] grid grid-cols-12 gap-2'>
                <div className='col-span-12 md:col-span-2'>
                    <div className="sidebar backdrop-brightness-50" style={{ position: "absolute", zIndex: "10", left: "0", width: "100%", bottom: "0", top: "0", height:"100%" }}>
                    <ClientSidebar />
                    </div>
                </div>

                <div className='col-span-12 md:col-start-3 md:col-end-12 py-2'>
                    <Main />
                </div>

            </div> */}
    </>
  );
};

export default Client;

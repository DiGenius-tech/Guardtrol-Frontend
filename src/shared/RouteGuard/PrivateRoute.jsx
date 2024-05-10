import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../redux/selectors/auth";
import { selectOnboardingLevel } from "../../redux/selectors/onboarding";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { setOnboardingLevel } from "../../redux/slice/onboardingSlice";
import { useGetBeatsQuery } from "../../redux/services/beats";
import useHttpRequest from "../Hooks/HttpRequestHook";
import { get } from "../../lib/methods";

const PrivateRoute = ({
  component: Component,
  onboarding = false,
  ...rest
}) => {
  const onboardingLevel = useSelector(selectOnboardingLevel);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const dispatch = useDispatch();

  const [onboardingRoute, setOnboardingRoute] = useState("");
  const location = useLocation();

  const {
    data: beats,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery();

  useEffect(() => {
    if (isUninitialized && token) {
      refetchBeats();
    }
  }, [token]);

  const subRoutes = [
    "add-beat",
    "add-guard",
    "checkout",
    "shop",
    "successful",
    "failed",
    "assign-new-beat",
  ];

  const subRoutes2 = ["onboarding", "successful"];

  useEffect(() => {
    dispatch(suspenseHide());
  }, []);

  useEffect(() => {
    switch (onboardingLevel) {
      case 0:
        return setOnboardingRoute("/onboarding/membership");
      case 1:
        return setOnboardingRoute("/onboarding/configure-beats");
      case 2:
        return setOnboardingRoute("/onboarding/onboard-guard");
      case 3:
        return setOnboardingRoute("/onboarding/assign-beats");
      case 4:
        return setOnboardingRoute("/onboarding/complete");
      default:
        return;
    }
  }, [onboardingLevel]);

  useEffect(() => {
    if (token && !user?.onboardingcomplete) {
      dispatch(suspenseShow());

      try {
        get(`users/getuser/${user.userid}`, token).then((response) => {
          if (response) {
            console.log(response);
            if (response?.subscriptions?.length > 0) {
              if (response.beats.length > 0) {
                if (response?.guards?.length > 0) {
                  if (
                    response?.beats?.some((beat) => beat?.guards?.length > 0)
                  ) {
                    dispatch(setOnboardingLevel(4));
                  } else {
                    dispatch(setOnboardingLevel(3));
                  }
                } else {
                  dispatch(setOnboardingLevel(2));
                }
              } else {
                dispatch(setOnboardingLevel(1));
              }
            } else {
              dispatch(setOnboardingLevel(0));
            }
          }
        });
      } catch (error) {
        console.log(error);
      }

      dispatch(suspenseHide());
    }
  }, [token]);

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if (onboardingLevel === 0) {
  //   console.log("onboardingLevel");
  //   return <Navigate to="/onboarding/membership" />;
  // }
  // if (onboardingLevel === 1) {
  //   return (
  //     <Navigate
  //       to="/onboarding/configure-beats"
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }
  // if (onboardingLevel === 2) {
  //   return (
  //     <Navigate
  //       to="/onboarding/onboard-guard"
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }

  // if (onboardingLevel === 3) {
  //   return (
  //     <Navigate
  //       to="/onboarding/assign-beats"
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }
  // if (onboardingLevel === 4) {
  //   return (
  //     <Navigate to="/onboarding/complete" state={{ from: location }} replace />
  //   );
  // }
  if (user?.onboardingcomplete && location.pathname === "/auth") {
    return <Navigate to={"/client"} state={{ from: "/" }} replace />;
  }
  if (
    onboarding &&
    location.pathname !== onboardingRoute &&
    !subRoutes.some((item) => location.pathname.includes(item))
  ) {
    return <Navigate to={onboardingRoute} />;
  }

  if (
    !user?.onboardingcomplete &&
    !subRoutes2.some((item) => location.pathname.includes(item))
  ) {
    return <Navigate to={"/onboarding"} state={{ from: "/" }} replace />;
  }
  return <Component {...rest} />;
};

export default PrivateRoute;

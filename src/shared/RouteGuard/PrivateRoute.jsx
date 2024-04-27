import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../redux/selectors/auth";
import { selectOnboardingLevel } from "../../redux/selectors/onboarding";
import { suspenseHide } from "../../redux/slice/suspenseSlice";
import { setOnboardingLevel } from "../../redux/slice/onboardingSlice";
import { useGetBeatsQuery } from "../../redux/services/beats";

const PrivateRoute = ({
  component: Component,
  onboarding = false,
  ...rest
}) => {
  const onboardingLevel = useSelector(selectOnboardingLevel);

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [onboardingRoute, setOnboardingRoute] = useState(
    "/onboarding/membership"
  );
  const location = useLocation();

  const {
    data: beats,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
  });

  useEffect(() => {
    console.log(isUninitialized && token);

    if (!isUninitialized && token) {
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
        return setOnboardingRoute("/onboarding/membership");
    }
  }, [onboardingLevel]);

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

  // if (onboardingComplete) {
  //   return <Navigate to={"/client/dashboard"} />;
  // }

  return <Component {...rest} />;
};

export default PrivateRoute;

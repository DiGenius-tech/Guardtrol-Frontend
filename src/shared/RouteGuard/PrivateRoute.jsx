import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";

const PrivateRoute = ({
  component: Component,
  onboarding = false,
  ...rest
}) => {
  const user = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingRoute, setOnboardingRoute] = useState(
    "/onboarding/membership"
  );
  const location = useLocation();

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
    console.log(user);
    setOnboardingComplete(user?.onboardingcomplete);

    const onboardingLevel = localStorage.getItem("onBoardingLevel") || "0";
    console.log(onboardingLevel);

    switch (onboardingLevel) {
      case "0":
        setOnboardingRoute("/onboarding/membership");
        break;
      case "1":
        setOnboardingRoute("/onboarding/configure-beats");
        break;
      case "2":
        setOnboardingRoute("/onboarding/onboard-guard");
        break;
      case "3":
        setOnboardingRoute("/onboarding/assign-beats");
        break;
      case "4":
        setOnboardingRoute("/onboarding/complete");
        break;
      default:
        setOnboardingRoute("/onboarding/membership");
        break;
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (
    onboarding &&
    location.pathname !== onboardingRoute &&
    !subRoutes.some((item) => location.pathname.includes(item))
  ) {
    return <Navigate to={onboardingRoute} />;
  }

  if (
    !onboardingComplete &&
    !subRoutes2.some((item) => location.pathname.includes(item))
  ) {
    return <Navigate to={"/onboarding"} state={{ from: "/" }} replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;

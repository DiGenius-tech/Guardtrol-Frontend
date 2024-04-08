import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ component: Component, onboarding = false, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [onboardingRoute, setOnboardingRoute] = useState("/onboarding/membership")
  const location = useLocation()

  const subRoutes = ["add-beat", "add-guard", 
  "checkout", "shop", "successful", "failed", "assign-new-beat"
  ]
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('userData');
    setIsLoggedIn(!!storedIsLoggedIn);


    const onboardingLevel = localStorage.getItem("onBoardingLevel") || "0"
    console.log(onboardingLevel)
    switch (onboardingLevel) {
      case "0":
        setOnboardingRoute("/onboarding/membership")
        break;
      case "1":
        setOnboardingRoute("/onboarding/configure-beats")
        break;
      case "2":
        setOnboardingRoute("/onboarding/onboard-guard")
        break;
      case "3":
        setOnboardingRoute("/onboarding/assign-beats")
        break;
      case "4":
        setOnboardingRoute("/onboarding/complete")
        break;
      default:
        setOnboardingRoute("/onboarding/membership")
        break;
    }

  }, []);

  if (!isLoggedIn) {
    //  return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (onboarding && location.pathname !== onboardingRoute && !subRoutes.some(item => location.pathname.includes(item))) {
     return <Navigate to={onboardingRoute} />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
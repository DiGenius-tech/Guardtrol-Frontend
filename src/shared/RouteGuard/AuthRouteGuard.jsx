import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const AuthRouteGuard = ({ component: Component, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('userData');
    console.log(!!storedIsLoggedIn)
    setIsLoggedIn(!!storedIsLoggedIn); 

   // console.log(isLoggedIn)
  }, []);
  const location = useLocation();
  //console.log(isLoggedIn)
  return !isLoggedIn ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/client" state={{ from: location }} replace />
  );
};

export default AuthRouteGuard;
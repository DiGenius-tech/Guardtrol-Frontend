import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";

const AuthRouteGuard = ({ component: Component, ...rest }) => {
  const user = useSelector(selectUser);

  const location = useLocation();
  //console.log(isLoggedIn)
  console.log(user);
  return !user ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/client" state={{ from: location }} replace />
  );
};

export default AuthRouteGuard;

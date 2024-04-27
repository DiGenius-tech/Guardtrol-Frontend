import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";

const AuthRouteGuard = ({ component: Component, ...rest }) => {
  const user = useSelector(selectUser);

  const location = useLocation();
  console.log(user)
  //console.log(isLoggedIn)
  console.log(user);
  return user && user.emailverified ? (
    <Navigate to="/client" state={{ from: location }} replace />
    
  ) : (

    <Component {...rest} />
  );
};

export default AuthRouteGuard;

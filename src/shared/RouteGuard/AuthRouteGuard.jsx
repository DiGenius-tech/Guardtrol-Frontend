import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";

const AuthRouteGuard = ({ component: Component, ...rest }) => {
  const user = useSelector(selectUser);

  const location = useLocation();
  
  return (
    <>
      {user?.emailverified && user && user?.onboardingcomplete && (
        <Navigate to="/client" state={{ from: location }} replace />
      )}
      {user?.emailverified && user && !user?.onboardingcomplete && (
        <Navigate to="/onboarding" state={{ from: location }} replace />
      )}

      {!user?.emailverified &&
        user &&
        location.pathname !== "/auth/verify-email" && (
          <Navigate
            to="/auth/verify-email"
            state={{ from: location }}
            replace
          />
        )}

      {!user?.emailverified && <Component {...rest} />}
    </>
  );
};

export default AuthRouteGuard;

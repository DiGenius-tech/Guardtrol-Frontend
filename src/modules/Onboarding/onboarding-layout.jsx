import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { selectOnboardingLevel } from "../../redux/selectors/onboarding";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { setOnboardingLevel } from "../../redux/slice/onboardingSlice";
import { useGetBeatsQuery } from "../../redux/services/beats";
import { get } from "../../lib/methods";
import OnboardingToolbar from "./components/OnboardingToolbar/OnboardingToolbar";
import OnboardingProgressBar from "./components/OnboardingProgressBar/OnboardingProgressBar";
import { useGetUserQuery } from "../../redux/services/user";

const OnboardingLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);
  const onboardingLevel = useSelector(selectOnboardingLevel);

  const [onboardingRoute, setOnboardingRoute] = useState("");
  const { data: userData, refetch } = useGetUserQuery(user._id, {
    skip: user?._id ? false : true,
  });

  useEffect(() => {
    dispatch(suspenseHide());
  }, [dispatch]);

  useEffect(() => {
    switch (onboardingLevel) {
      case 0:
        setOnboardingRoute("/onboarding/membership");
        break;
      case 1:
        setOnboardingRoute("/onboarding/configure-beats");
        break;
      case 2:
        setOnboardingRoute("/onboarding/onboard-guard");
        break;
      case 3:
        setOnboardingRoute("/onboarding/assign-beats");
        break;
      case 4:
        setOnboardingRoute("/onboarding/complete");
        break;
      default:
        break;
    }
  }, [onboardingLevel]);

  useEffect(() => {
    if (token && !user?.onboardingcomplete && !user?.subAccount) {
      dispatch(suspenseShow());

      if (userData) {
        if (userData?.subscriptions?.length > 0) {
          if (userData.beats.length > 0) {
            if (userData?.guards?.length > 0) {
              if (userData?.beats?.some((beat) => beat?.guards?.length > 0)) {
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
      dispatch(suspenseHide());
      // get(`users/getuser/${user.userid}`, token)
      //   .then((response) => {
      //     if (response) {
      //       if (response?.subscriptions?.length > 0) {
      //         if (response.beats.length > 0) {
      //           if (response?.guards?.length > 0) {
      //             if (
      //               response?.beats?.some((beat) => beat?.guards?.length > 0)
      //             ) {
      //               dispatch(setOnboardingLevel(4));
      //             } else {
      //               dispatch(setOnboardingLevel(3));
      //             }
      //           } else {
      //             dispatch(setOnboardingLevel(2));
      //           }
      //         } else {
      //           dispatch(setOnboardingLevel(1));
      //         }
      //       } else {
      //         dispatch(setOnboardingLevel(0));
      //       }
      //     }
      //   })
      //   .catch(console.error)
      //   .finally(() => dispatch(suspenseHide()));
    }
  }, [token, user, dispatch, userData]);

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user?.onboardingcomplete && location.pathname === "/auth") {
    return <Navigate to="/client" state={{ from: "/" }} replace />;
  }

  if (
    location.pathname !== onboardingRoute &&
    ![
      "add-beat",
      "add-guard",
      "checkout",
      "shop",
      "successful",
      "failed",
      "assign-new-beat",
    ].some((item) => location.pathname.includes(item)) &&
    !user?.subAccount
  ) {
    return <Navigate to={onboardingRoute} />;
  }

  if (
    !user?.onboardingcomplete &&
    !["onboarding", "successful"].some((item) =>
      location.pathname.includes(item)
    ) &&
    !user?.subAccount
  ) {
    return <Navigate to="/onboarding" state={{ from: "/" }} replace />;
  }

  return (
    <>
      <OnboardingToolbar />
      <OnboardingProgressBar />
      <div className="my-8"></div>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <Outlet />
      </div>
    </>
  );
};

export default OnboardingLayout;

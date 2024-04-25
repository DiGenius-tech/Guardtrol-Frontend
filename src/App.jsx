import PageNotFound from "./PageNotFound/PageNotFound";
import auth_routes from "./modules/Auth/Auth.routes";
import onboarding_routes from "./modules/Onboarding/Onboarding.routes";
import "./App.scss";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { useCallback, useContext, useEffect, useState } from "react";

import sandbox_routes from "./modules/Sandbox/sandbox.routes";
import LoadingSpinner from "./shared/LoadingSpinner/LoadingSpinner";
import patrol_route_configuration from "./modules/PatrolRouteConfiguration/patrol-route-configuration.routes";
import PrivateRoute from "./shared/RouteGuard/PrivateRoute";
import client_routes from "./modules/Client/client.routes";
import { toast } from "react-toastify";
import { SubscriptionContext } from "./shared/Context/SubscriptionContext";
import useHttpRequest from "./shared/Hooks/HttpRequestHook";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { useGetSubscriptionQuery } from "./redux/services/subscriptions";
import { selectToken, selectUser } from "./redux/selectors/auth";
import { selectSuspenseShow } from "./redux/selectors/suspense";

function App() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const suspense = useSelector(selectSuspenseShow);
  const { error, responseData, sendRequest } = useHttpRequest();

  // const login = useCallback((data) => {
  //   setToken(data.token);
  //   setUser(data);

  //   localStorage.setItem("userData", JSON.stringify(data));

  //   return true;
  // }, []);

  // const loading = useCallback((load) => {
  //   setTimeout(() => {
  //     setIsLoading(load);
  //   }, 200);
  // }, []);

  // const logout = useCallback(() => {
  //   // setToken(null)
  //   // setUser(null)
  //   localStorage.clear();
  //   window.location.href = "/";
  // }, []);

  // useEffect(() => {
  //   const savedData = JSON.parse(localStorage.getItem("userData"));
  //   if (savedData && savedData.token) {
  //     login(savedData);
  //   }
  //   loading(false);
  // }, [login, loading]);

  const router = createBrowserRouter([
    {
      path: "",
      Component: () => <Navigate to={"/auth"} />,
    },
    sandbox_routes,
    onboarding_routes,
    client_routes,
    patrol_route_configuration,
    auth_routes,
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  const {
    data: subcription,
    isError,
    isLoading,
    refetch,
  } = useGetSubscriptionQuery(user?.userid, {
    skip: token ? false : true,
  });

  if (isError && token) {
    toast.warn("You are not currently Subscribed to any Plan");
  }

  useEffect(() => {
    // const getSub = async () => {
    //   const data = await u(
    //     `users/getsubscription/${user.userid}`,
    //     "GET",
    //     null,
    //     {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     }
    //   );
    //   if (data && data.status) {
    //     await setCurrentSubscription(data.subscription);
    //   } else {
    //   }
    // };
    if (token) {
      refetch();
    }
  }, [token]);

  // const setCurrentSubscription = async (data) => {
  //   return setSubscription(data);
  // };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {suspense && <LoadingSpinner />}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;

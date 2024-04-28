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

  const [psConfig, setPsConfig] = useState({});
  const [fwConfig, setFwConfig] = useState({});

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

  const init = (selectedPlan) => {
    const psConfig = {
      email: user.email,
      amount: parseInt(selectedPlan?.amount) * 100,
      metadata: {
        name: user.name,
        phone: user.phone || null,
      },
      publicKey: process.env.REACT_APP_PAYSTACK_KEY,
    };

    const fwConfig = {
      public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
      tx_ref: Date.now(),
      amount: parseInt(selectedPlan?.amount),
      currency: "NGN",
      payment_options: "all",
      payment_plan: selectedPlan?.type,
      customer: {
        email: user.email,
        phone_number: user.phone || null,
        name: user.name,
      },
      meta: { counsumer_id: user.userid, consumer_mac: user.clientid },
      customizations: {
        title: "Guardtrol Lite Subscription",
        description: `${selectedPlan?.type} subscription to guardtrol lite`,
        logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
      },
    };

    setFwConfig(fwConfig);
    setPsConfig(psConfig);
  };

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
    isUninitialized,
  } = useGetSubscriptionQuery({
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
    if (token && !isUninitialized) {
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

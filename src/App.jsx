import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { toast } from "react-toastify";
import "./App.scss";

import PageNotFound from "./PageNotFound/PageNotFound";
import LoadingSpinner from "./shared/LoadingSpinner/LoadingSpinner";
import useHttpRequest from "./shared/Hooks/HttpRequestHook";
import { persistor, store } from "./redux/store";
import { selectUser } from "./redux/selectors/auth";
import { selectSuspenseShow } from "./redux/selectors/suspense";
import Auth from "./modules/Auth/Auth";
import { OnboardingRouter } from "./modules/Onboarding/onboarding-router";
import { AuthRouter } from "./modules/Auth/auth-router";
import ClientRouter from "./modules/Client/client-router";
import useInactivityTimeout from "./utils/inactivity-timeout";
import VerifyEmail from "./modules/Auth/pages/VerifyEmail";
import AuthLayout from "./modules/Auth/auth-layout";
import OnboardingLayout from "./modules/Onboarding/onboarding-layout";
import OnboardingComplete from "./modules/Onboarding/CompleteOnboarding";
import OnboardingToolbar from "./modules/Onboarding/components/OnboardingToolbar/OnboardingToolbar";
import OnboardingProgressBar from "./modules/Onboarding/components/OnboardingProgressBar/OnboardingProgressBar";

function App() {
  const user = useSelector(selectUser);
  const suspense = useSelector(selectSuspenseShow);
  const { error } = useHttpRequest();

  const [suspenseState, setSuspenseState] = useState(suspense);

  useInactivityTimeout();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    setSuspenseState(suspense);
  }, [suspense]);

  useEffect(() => {
    setSuspenseState(false);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {suspenseState && <LoadingSpinner />}
        <Router>
          <Routes>
            {user ? (
              <>
                {!user.emailverified ? (
                  <>
                    <Route path="verify-email" element={<AuthLayout />}>
                      <Route index element={<VerifyEmail />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/verify-email" />} />
                  </>
                ) : user.onboardingcomplete ? (
                  <>
                    <Route path="/client/*" element={<ClientRouter />} />

                    <Route path="*" element={<Navigate to="/client" />} />
                  </>
                ) : (
                  <>
                    {user.isOwner && (
                      <>
                        <Route
                          path="onboarding/*"
                          element={<OnboardingRouter />}
                        />
                        <Route
                          path="onboardingcomplete"
                          element={<OnboardingCompleteLayout />}
                        />
                        <Route
                          path="*"
                          element={<Navigate to="/onboarding" />}
                        />
                      </>
                    )}
                    {!user.isOwner && (
                      <Route path="*" element={<Navigate to="/client" />} />
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Route path="/auth/*" element={<AuthRouter />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            )}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

const OnboardingCompleteLayout = () => (
  <>
    <OnboardingToolbar />
    {/* <OnboardingProgressBar complete={true} /> */}
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <OnboardingComplete />
    </div>
  </>
);
export default App;

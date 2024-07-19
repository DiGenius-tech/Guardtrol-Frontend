import React, { useContext, useEffect } from "react";
import OnboardingToolbar from "./components/OnboardingToolbar/OnboardingToolbar";
import { Outlet, useNavigate } from "react-router-dom";
import OnboardingProgressBar from "./components/OnboardingProgressBar/OnboardingProgressBar";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <>
      <OnboardingToolbar />
      <OnboardingProgressBar />
      <div className="my-8"></div>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default Onboarding;

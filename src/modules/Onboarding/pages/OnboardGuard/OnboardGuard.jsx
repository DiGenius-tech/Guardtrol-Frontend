import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./OnboardGuard.scss";
import { useDispatch } from "react-redux";
import { setOnboardingGuards } from "../../../../redux/slice/onboardingSlice";

const OnboardGuard = () => {
  const dispatch = useDispatch();

  return (
    <div id="onboard-guard">
      {/* onboard-guard-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Onboard guard
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        Add At Least One Guard To Continue
      </p>
      <div className="mt-8"></div>

      <Outlet />
      {/*  */}
    </div>
  );
};

export default OnboardGuard;

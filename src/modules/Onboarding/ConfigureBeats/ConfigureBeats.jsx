import React, { useState } from "react";
import "./styles/ConfigureBeats.scss";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ConfigureBeats = () => {
  const location = useLocation();
  const [text, setText] = useState(window.location.origin + location.pathname);
  const [saveBeatData, setSaveBeatData] = useState(false);

  return (
    <>
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Configure Beat
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        Add at least one Beat to continue
      </p>
      <div className="mt-8"></div>

      <Outlet />
      <div className="my-16"></div>
    </>
  );
};

export default ConfigureBeats;

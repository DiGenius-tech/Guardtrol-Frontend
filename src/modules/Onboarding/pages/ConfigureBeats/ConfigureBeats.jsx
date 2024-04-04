import React, { useState } from "react";
import QRGenerator from "./QRGenerator/QRGenerator";
// import QRCode from "react-qr-code";
import PointModal from "./PointModal/PointModal";
import "./ConfigureBeats.scss";
import PatrolRouteSelectionForMobile from "./PatrolRouteSelectionForMobile/PatrolRouteSelectionForMobile";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import QRHandler from "./QRHandler/QRHandler";
import { Outlet } from "react-router-dom";

const ConfigureBeats = () => {
  const [text, setText] = useState("default text for QRCode");
  const [saveBeatData, setSaveBeatData] = useState(false);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      {/* configure-beats-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Configure Beat
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        This is just a subtext to support the topic above
      </p>
      <div className="mt-8"></div>

      <Outlet />
      <div className="my-16"></div>

    </>
  );
};

export default ConfigureBeats;

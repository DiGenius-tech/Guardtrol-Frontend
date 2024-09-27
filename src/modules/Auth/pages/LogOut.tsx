import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIconImg from "../../../images/icons/google-social-icon.svg";
import left_pattern_boxes from "../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../images/right-pattern-boxes.svg";

import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { post } from "../../../lib/methods";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  updateUserOrganization,
} from "../../../redux/slice/authSlice";
import axios from "axios";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { errorHandler } from "../../../lib/errorHandler";
import {
  setOnboardingGuards,
  setOnboardingLevel,
} from "../../../redux/slice/onboardingSlice";
import { setCurrentSubscription } from "../../../redux/slice/subscriptionSlice";
import { persistor } from "../../../redux/store";
import { api } from "../../../redux/services/api";
import { clearNotifications } from "../../../redux/slice/notificationSlice";

const LogOut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    dispatch(clearNotifications());
  }, []);
  return <></>;
};

export default LogOut;

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
import { loginSuccess } from "../../../redux/slice/authSlice";
import axios from "axios";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { errorHandler } from "../../../lib/errorHandler";
import {
  setOnboardingGuards,
  setOnboardingLevel,
} from "../../../redux/slice/onboardingSlice";
import { setCurrentSubscription } from "../../../redux/slice/subscriptionSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /**toggle password field type */
  const password_field_ref = useRef();
  const [password_type, setPassword_type] = useState("password");

  const toggle_pwd_type = () => {
    password_type === "password"
      ? setPassword_type("text")
      : setPassword_type("password");
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: any) => {
    dispatch(suspenseShow());
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors: any = {};

    // Check each input field's validity and set errors accordingly
    for (const el of form.elements) {
      if (el.nodeName === "INPUT" && !el.validity.valid) {
        newErrors[el.name] = el.validationMessage;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      // If there are validation errors, update state and stop submission
      setValidationErrors(newErrors);
      e.stopPropagation();
    } else {
      // Form is valid, handle submission
      setIsLoading(true);
      try {
        const data: any = await post("users/signin", formData);

        if (data) {
          dispatch(setOnboardingLevel(null));
          dispatch(setOnboardingGuards([]));

          dispatch(loginSuccess(data));
          toast("Signin Successful");
          // navigate("/client/dashboard", { replace: true });
          // window.location.reload()
        }
      } catch (err: any) {
        errorHandler(err);
        toast.error(err);
      } finally {
        dispatch(suspenseHide());
        setIsLoading(false);
      }
    }
  };

  const signIn = useGoogleLogin({
    onSuccess: (response) => handleSignInSuccess(response),
  });

  const handleSignInSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      const accessToken = response.access_token;

      const userData = await getUserInfo(accessToken);

      const data: any = await post(
        "users/signinwithgoogle",
        JSON.stringify(userData)
      );

      if (null != data) {
        dispatch(setOnboardingLevel(null));
        dispatch(setOnboardingGuards([]));
        dispatch(setCurrentSubscription(null));
        dispatch(loginSuccess(data));
        toast("Signin Successful");
        // navigate("/client/dashboard", { replace: true }); //should be dashboard
        // window.location.reload();
      }

      //auth.login(data.token, data.userId)
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
          accessToken
      );
      return response;
    } catch (error: any) {
      console.error("Error fetching user info: ", error);
      toast.error(error);
    }
  };

  return (
    <>
      {/* login-app works! */}

      <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-12 gap-4 sm:gap-8 mx-auto px-2 sm:px-6 lg:px-8">
          <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-left">
            <div className="h-48"></div>
            <div className="h-full flex items-end justify-end">
              <img src={left_pattern_boxes} alt="" />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="mt-16"></div>
            <h1 className="font-bold text-2xl tracking-wide text-center">
              Log in to Guardtrol
            </h1>

            <div className="mt-8"></div>

            <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <form method="post" onSubmit={handleSubmit}>
                {/*  */}

                {/*  */}
                <TextInputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Example@example.com"
                  id="email"
                  error={validationErrors["email"]}
                  onChange={handleChange}
                  required="required"
                  value={formData.email}
                />

                <TextInputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder=""
                  id="password"
                  error={validationErrors["password"]}
                  onChange={handleChange}
                  required="required"
                  value={formData.password}
                  passwordToggler={true}
                  link_text={{ text: "I Forgot My Password", link: true }}
                  //
                  password_field_ref={password_field_ref}
                  password_type={password_type}
                  setPassword_type={setPassword_type}
                  toggle_pwd_type={toggle_pwd_type}
                />

                <RegularButton
                  isLoading={isLoading}
                  text="Log In"
                  type="submit"
                  onClick={() => console.log("first")}
                  disabled={isLoading}
                />
              </form>
            </div>

            <p className="horizontal-line-title fw-medium my-8 text-center">
              Or you can
            </p>

            <Link
              to="#"
              onClick={() => signIn()}
              className="mb-4 block w-full border border-primary-500 text-dark bg-white focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <span className="sm:text-lg flex items-center justify-center gap-2">
                <img src={googleIconImg} alt="Log In With Google" />
                Log In With Google
              </span>
            </Link>
          </div>
          <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-right">
            <div className="h-48 hidden lg:block"></div>
            <div className="h-full flex items-end justify-end">
              <img src={right_pattern_boxes} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

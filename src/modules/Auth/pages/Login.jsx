import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import {
  loginSuccess,
  updateSupportUser,
  updateUserOrganization,
} from "../../../redux/slice/authSlice";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { errorHandler } from "../../../lib/errorHandler";
import {
  setOnboardingGuards,
  setOnboardingLevel,
} from "../../../redux/slice/onboardingSlice";
import { setCurrentSubscription } from "../../../redux/slice/subscriptionSlice";
import { API_BASE_URL } from "../../../constants/api";
import googleIconImg from "../../../images/icons/google-social-icon.svg";
import { post } from "../../../lib/methods";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const tokenLoginInProgress = useRef(false); // Prevent multiple calls

  /**toggle password field type */
  const password_field_ref = useRef();
  const [password_type, setPassword_type] = useState("password");

  const toggle_pwd_type = () => {
    password_type === "password"
      ? setPassword_type("text")
      : setPassword_type("password");
  };

  useEffect(() => {
    const supportToken = searchParams.get("support_token");
    if (supportToken && !isTokenChecked && !tokenLoginInProgress.current) {
      setIsTokenChecked(true);
      tokenLoginInProgress.current = true;
      handleTokenLogin(supportToken);
    }
  }, [searchParams, isTokenChecked]);

  const handleTokenLogin = async (token) => {
    dispatch(suspenseShow());
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/authorise-client-console-access/${token}`
      );
      const data = response.data;
      if (data?.supportUserData && data?.clientUserData) {
        dispatch(updateSupportUser(data.supportUserData));
        dispatch(setOnboardingLevel(null));
        dispatch(setOnboardingGuards([]));
        dispatch(updateUserOrganization(data.clientUserData.organization));
        dispatch(loginSuccess(data.clientUserData));
        toast("Successfully signed in as support");
        navigate("/");
      }
    } catch (error) {
      errorHandler(error);
      toast.error(error.message);
    } finally {
      dispatch(suspenseHide());
      tokenLoginInProgress.current = false;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    dispatch(suspenseShow());
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors = {};

    try {
      for (const el of form.elements) {
        if (el.nodeName === "INPUT" && !el.validity.valid) {
          newErrors[el.name] = el.validationMessage;
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        e.stopPropagation();
      } else {
        setIsLoading(true);

        const data = await post("users/signin", {
          ...formData,
          email: formData.email.toLowerCase(),
        });

        if (data) {
          dispatch(setOnboardingLevel(null));
          dispatch(setOnboardingGuards([]));
          dispatch(updateUserOrganization(data.organization));
          dispatch(loginSuccess(data));
          toast("Sign In Successful");
          navigate("/");
        }
      }
    } catch (err) {
      errorHandler(err);
      toast.error(err.message);
    } finally {
      dispatch(suspenseHide());
      setIsLoading(false);
    }
  };

  const signIn = useGoogleLogin({
    onSuccess: (response) => handleSignInSuccess(response),
  });

  const handleSignInSuccess = async (response) => {
    try {
      setIsLoading(true);
      const accessToken = response.access_token;

      const userData = await getUserInfo(accessToken);

      const data = await post("users/signinwithgoogle", userData);

      if (data) {
        dispatch(setOnboardingLevel(null));
        dispatch(setOnboardingGuards([]));
        dispatch(setCurrentSubscription(null));
        dispatch(loginSuccess(data));
        dispatch(updateUserOrganization(data.organization));
        toast("Sign In successful");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + accessToken);
      return response; // Fixed the return statement to return response data
    } catch (error) {
      console.error("Error fetching user info: ", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mt-16"></div>
      <h1 className="font-bold text-2xl tracking-wide text-center">
        Login to Guardtrol
      </h1>
      <div className="mt-8"></div>
      <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={handleSubmit}>
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
            placeholder="Enter Password"
            id="password"
            error={validationErrors["password"]}
            onChange={handleChange}
            required="required"
            value={formData.password}
            passwordToggler={true}
            password_field_ref={password_field_ref}
            passwordType={password_type}
            setPassword_type={setPassword_type}
            togglePwdType={toggle_pwd_type}
          />
          <RegularButton
            isLoading={isLoading}
            text="Login"
            type="submit"
            onClick={() => console.log("first")}
            disabled={isLoading}
          />
        </form>
      </div>
      <Link to="/auth/forgot-password">
        <div className=" justify-center text-center mt-3">
          <span
            className={`rounded-md py-2 text-sm font-medium text-primary-500`}
          >
            Forgot Password
          </span>
        </div>
      </Link>
      <p className="horizontal-line-title fw-medium my-8 text-center">
        Or you can
      </p>
      <Link
        to="#"
        onClick={() => signIn()}
        className="mb-4 block border border-primary-500 text-dark bg-white focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        <span className="sm:text-lg flex items-center justify-center gap-2">
          <img src={googleIconImg} alt="Login With Google" />
          Login with Google
        </span>
      </Link>
    </>
  );
};

export default Login;

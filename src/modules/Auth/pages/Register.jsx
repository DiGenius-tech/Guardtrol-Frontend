import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIconImg from "../../../images/icons/google-social-icon.svg";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors/auth";
import { loginSuccess, updateUserOrganization } from "../../../redux/slice/authSlice";
import { setOnboardingGuards, setOnboardingLevel } from "../../../redux/slice/onboardingSlice";
import { setCurrentSubscription } from "../../../redux/slice/subscriptionSlice";
import { post } from "../../../lib/methods";
import axios from "axios";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";

const Register = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState({});
  const { error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+234", // Default country code for Nigeria
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const password_field_ref = useRef();
  const [password_type, setPassword_type] = useState("password");
  const [confirm_password_type, setConfirm_password_type] = useState("password");

  const toggle_pwd_type = () => {
    password_type === "password"
      ? setPassword_type("text")
      : setPassword_type("password");
  };

  const toggle_confirm_pwd_type = () => {
    confirm_password_type === "password"
      ? setConfirm_password_type("text")
      : setConfirm_password_type("password");
  };

  const validatePhoneNumber = (phone) => {
    // Remove all spaces for validation
    const cleanedPhone = phone.replace(/\s/g, "");

    // Ensure the phone number is exactly 11 digits
    return cleanedPhone.length === 11 && /^[0-9]+$/.test(cleanedPhone);
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    let cleanedPhone = phone.replace(/\D/g, "");

    // Limit the total length to 11 digits
    if (cleanedPhone.length > 11) {
      cleanedPhone = cleanedPhone.slice(0, 11);
    }

    // Add spaces for readability (e.g., 080 123 45678)
    let formattedPhone = "";
    for (let i = 0; i < cleanedPhone.length; i++) {
      if (i === 3 || i === 6) {
        formattedPhone += " "; // Add a space after the 3rd and 6th digits
      }
      formattedPhone += cleanedPhone[i];
    }

    return formattedPhone;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      // Format the phone number
      newValue = formatPhoneNumber(newValue);
    }

    setFormData({ ...formData, [name]: newValue });
    setValidationErrors({ ...validationErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    try {
      dispatch(suspenseShow());
      setIsLoading(true);
      e.preventDefault();
      const form = e.currentTarget;
      const newErrors = {};

      // Validate phone number
      if (!validatePhoneNumber(formData.phone)) {
        newErrors["phone"] = "Please enter a valid 11-digit phone number.";
      }

      if (formData.password.length < 8) {
        setValidationErrors({
          ...validationErrors,
          password: "Password must be have a mininmum of 8 chracters.",
        });
        return;
      }
      if (formData.password_confirmation.length < 8) {
        setValidationErrors({
          ...validationErrors,
          password_confirmation:
            "Password must be have a mininmum of 8 chracters.",
        });
        return;
      }
      for (const el of form.elements) {
        if (el.nodeName === "INPUT" && !el.validity.valid) {
          newErrors[el.name] = el.validationMessage;
        }

        if (
          el.name === "password" &&
          el.value !== formData.password_confirmation
        ) {
          newErrors["password_confirmation"] = "Passwords don't match";
        } else if (
          el.name === "password_confirmation" &&
          el.value !== formData.password
        ) {
          newErrors["password_confirmation"] = "Passwords don't match";
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        e.stopPropagation();
      } else {
        const data = await post("users/signup", {
          ...formData,
          email: formData?.email?.toLowerCase(),
        });

        if (null != data) {
          if (data) {
            dispatch(setOnboardingLevel(0));
            dispatch(setOnboardingGuards([]));
            dispatch(setCurrentSubscription(null));
            dispatch(loginSuccess(data));

            dispatch(updateUserOrganization(data.userid));
            toast("Sign Up Successful");
            navigate("/auth/verify-email", { replace: true }); //should be dashboard
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(suspenseHide());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const signUp = useGoogleLogin({
    onSuccess: (response) => handleSignupSuccess(response),
  });

  const handleSignupSuccess = async (response) => {
    try {
      setIsLoading(true);
      const accessToken = response.access_token;

      const userData = await getUserInfo(accessToken);
      const data = await post("users/signupwithgoogle", userData);

      if (null != data) {
        if (data) {
          dispatch(setOnboardingLevel(0));
          dispatch(setOnboardingGuards([]));
          dispatch(setCurrentSubscription(null));
          dispatch(updateUserOrganization(data.userid));
          dispatch(loginSuccess(data));
          toast("Sign Up Successful");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
          accessToken
      );
      return response;
    } catch (error) {
      console.error("Error fetching user info: ", error);
      toast.error(error);
    }
  };

  const handleSignupFailure = (error) => {
    // Handle failed login
    console.error("Login failure:", error);
  };

  return (
    <>
      <div className="mt-16"></div>
      <h1 className="font-bold text-2xl tracking-wide text-center">
        Create an Account
      </h1>

      <div className="mt-8"></div>

      <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={handleSubmit}>
          <TextInputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="Full Name"
            id="name"
            error={validationErrors["name"]}
            onChange={handleChange}
            required="required"
            value={formData.name}
          />

          <TextInputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Email Address"
            id="email"
            error={validationErrors["email"]}
            onChange={handleChange}
            required="required"
            value={formData.email}
          />

          <div className="flex gap-4">
            <TextInputField
              label="Country Code"
              name="countryCode"
              type="text"
              placeholder="Country Code"
              id="countryCode"
              value={formData.countryCode}
              disabled // Disable editing for the country code
            />
            <TextInputField
              label="Phone Number"
              name="phone"
              type="text"
              placeholder="Phone Number (e.g., 080 123 45678)"
              id="phone"
              error={validationErrors["phone"]}
              onChange={handleChange}
              required="required"
              value={formData.phone}
            />
          </div>

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
            //
            password_field_ref={password_field_ref}
            passwordType={password_type}
            setPassword_type={setPassword_type}
            togglePwdType={toggle_pwd_type}
          />

          <TextInputField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            id="password_confirmation"
            error={validationErrors["password_confirmation"]}
            onChange={handleChange}
            required="required"
            value={formData.password_confirmation}
            //
            passwordToggler={true}
            passwordType={confirm_password_type}
            setPassword_type={setConfirm_password_type}
            togglePwdType={toggle_confirm_pwd_type}
          />
          <RegularButton isLoading={isLoading} text="Create an Account" />
        </form>
      </div>

      <p className="horizontal-line-title fw-medium my-8 text-center">
        Or you can
      </p>

      <Link
        to="#"
        onClick={() => signUp()}
        className="mb-4 block w-full border border-primary-500 text-dark bg-white focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        <span className="sm:text-lg flex items-center justify-center gap-2">
          <img src={googleIconImg} alt="Sign Up With Google" />
          Sign up with Google
        </span>
      </Link>
    </>
  );
};

export default Register;
import React, { useContext, useEffect, useState } from "react";
import left_pattern_boxes from "../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../images/right-pattern-boxes.svg";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";

import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { post } from "../../../lib/methods";

const ForgotPassword = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [emailSent, setEmailSent] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors = {};

    // Check each input field's validity and set errors accordingly
    for (const el of form.elements) {
      if (el.nodeName === "INPUT" && !el.validity.valid) {
        newErrors[el.name] = el.validationMessage;
      }

      // Add the condition to check if passwords match

      if (Object.keys(newErrors).length > 0) {
        // If there are validation errors, update state and stop submission
        setValidationErrors(newErrors);
        e.stopPropagation();
      } else {
        // Form is valid, handle submission
      }
    }

    try {
      dispatch(suspenseShow());
      const data = await post(`users/forgotpassword`, formData);

      if (null != data) {
        setEmailSent(true);
        toast("Password reset link has been sent");
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(suspenseHide());
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {/* forgot-password-app works! */}

      {emailSent ? (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Reset Link Sent
          </h1>
          {/* <p className="text-center">Enter your phone number to recover your password</p> */}
          <p className="text-center">
            password reset link has been sent to your email{" "}
            <b>{formData.email}</b> check your inbox or junk folder, this link
            will expire in 60mins
          </p>

          <div className="mt-8"></div>
          <center>
            <Link
              to="https://mail.google.com/"
              target="_blank"
              className="text-primary-500 font-medium"
            >
              Open Email
            </Link>
          </center>
        </>
      ) : (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Forgot Password?
          </h1>
          {/* <p className="text-center">Enter your phone number to recover your password</p> */}
          <p className="text-center">
            Enter the email address associated with your account and we'll send
            you a link to reset your password
          </p>

          <div className="mt-8"></div>

          <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <form method="post" onSubmit={handleSubmit}>
              <TextInputField
                label="Email"
                name="email"
                type="email"
                placeholder="example@example.com"
                id="email"
                error={validationErrors["email"]}
                onChange={handleChange}
                required="required"
                value={formData.email}
              />
              <RegularButton text="continue" />
            </form>
          </div>
          <Link to="/auth/login">
            <div className=" justify-center text-center mt-3">
              <span
                className={`rounded-md py-2 text-sm font-medium text-primary-500`}
              >
                Login
              </span>
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default ForgotPassword;

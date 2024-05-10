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
        console.log(el.name);
        newErrors[el.name] = el.validationMessage;
      }

      // Add the condition to check if passwords match

      if (Object.keys(newErrors).length > 0) {
        // If there are validation errors, update state and stop submission
        setValidationErrors(newErrors);
        e.stopPropagation();
      } else {
        // Form is valid, handle submission
        dispatch(suspenseShow());

        try {
          const data = await post(
            `users/forgotpassword`,
            JSON.stringify(formData)
          );

          if (null != data) {
            setEmailSent(true);
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(suspenseHide());
        }
      }
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

      <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 sm:gap-8 mx-auto px-2 sm:px-6 lg:px-8">
          <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-left">
            <div className="h-48"></div>
            <div className="h-full flex items-end justify-end">
              <img src={left_pattern_boxes} alt="" />
            </div>
          </div>
          {emailSent ? (
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="mt-16"></div>
              <h1 className="font-bold text-2xl tracking-wide text-center">
                Reset Link Sent
              </h1>
              {/* <p className="text-center">Enter your phone number to recover your password</p> */}
              <p className="text-center">
                password reset link has been sent to your email{" "}
                <b>{formData.email}</b> check your inbox or junk folder, this
                link will expire in 60mins
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
            </div>
          ) : (
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="mt-16"></div>
              <h1 className="font-bold text-2xl tracking-wide text-center">
                Forgot Password?
              </h1>
              {/* <p className="text-center">Enter your phone number to recover your password</p> */}
              <p className="text-center">
                Enter the email address associated with your account and we'll
                send you a link to reset your password
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
            </div>
          )}
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

export default ForgotPassword;

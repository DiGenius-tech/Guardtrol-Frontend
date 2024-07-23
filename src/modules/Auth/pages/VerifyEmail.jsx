import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Spinner } from "flowbite-react";

import left_pattern_boxes from "../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../images/right-pattern-boxes.svg";

import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { selectAuth } from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { updateUser } from "../../../redux/slice/authSlice";
import { get, post } from "../../../lib/methods";

function VerifyEmail() {
  const { user, token } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasCheckedVerification = useRef(false);

  const [canResend, setCanResend] = useState(true);
  const [verified, setVerified] = useState(false);
  const [isSendingLoading, setSendingLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { error } = useHttpRequest();

  const [formData, setFormData] = useState({
    code: "",
  });

  const checkIfVerifiedAndSendCode = async (user) => {
    try {
      dispatch(suspenseShow());
      setSendingLoading(true);
      if (!canResend) return;
      const data = await get(`users/${user.userid}/checkverifyemail`, token);
      if (data.isverified) {
        setVerified(true);
        dispatch(updateUser({ ...user, emailverified: true }));
        toast("Email already verified");
        navigate("/client");
      } else {
        toast("Verification code sent");
        setCanResend(false);
        setTimeout(() => {
          setCanResend(true);
        }, 60000);
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      dispatch(suspenseHide());
      setSendingLoading(false);
    }
  };

  useEffect(() => {
    if (token && !hasCheckedVerification.current) {
      checkIfVerifiedAndSendCode(user);
      hasCheckedVerification.current = true;
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.code || formData.code.length < 6) {
      newErrors.code = "Invalid verification code";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    dispatch(suspenseShow());
    try {
      const data = await post(
        `users/${user?.userid}/verifyemail`,
        formData,
        token
      );
      if (data) {
        toast(data.message);
        dispatch(updateUser({ ...user, emailverified: true }));
        navigate("/client/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error("Verification failed");
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
    <div className="verify-email">
      {!verified ? (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Let's Verify Your Email
          </h1>
          <p className="text-center">
            Enter the 6-digit code that was sent to your email address{" "}
            <b>{user?.email}</b>
          </p>
          <div className="mt-8"></div>
          <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <form method="post" onSubmit={handleSubmit}>
              <TextInputField
                label="Enter Code"
                name="code"
                type="text"
                placeholder="******"
                id="code"
                error={validationErrors["code"]}
                onChange={handleChange}
                required
                value={formData.code}
              />
              <RegularButton text="Continue" />
              <div className="flex justify-end pt-9">
                <div
                  onClick={() => canResend && checkIfVerifiedAndSendCode(user)}
                  className={`${
                    canResend ? "text-primary-500" : "text-gray-300"
                  } font-semibold text-sm pr-0 cursor-pointer flex items-center`}
                >
                  Resend verification code
                  {isSendingLoading && (
                    <Spinner
                      color="success"
                      className="ml-3"
                      aria-label="Success spinner example"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Email Verified Successfully
          </h1>
          <p className="text-center">Your email has already been verified</p>
          <div className="mt-8"></div>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;

import { useContext, useEffect, useState } from "react";
import left_pattern_boxes from "../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../images/right-pattern-boxes.svg";

import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { updateUser } from "../../../redux/slice/authSlice";
import { get, post } from "../../../lib/methods";

function VerifyEmail() {
  const auth = useSelector(selectAuth);
  const { user, token } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    code: "",
  });

  const checkIfVerified = async (props) => {
    try {
      const data = await get(`users/${props.userid}/checkverifyemail`, token);

      if (data?.isverified) {
        setVerified(true);
        toast("already verified");

        navigate("/client");
      }

      if (data.isverified) {
        setVerified(true);
        dispatch(updateUser({ ...user, emailverified: true }));
        toast("already verified");

        navigate("/client");
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (token && user) {
      checkIfVerified(user);
    }
  }, [token]);

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
      if (el.name === "code" && el.value.length < 6) {
        newErrors["code"] = "invalid verification code";
      }

      if (Object.keys(newErrors).length > 0) {
        // If there are validation errors, update state and stop submission
        setValidationErrors(newErrors);
        e.stopPropagation();
      } else {
        // Form is valid, handle submission
        dispatch(suspenseShow());
        try {
          const data = await post(
            `users/${user?.userid}/verifyemail`,
            JSON.stringify(formData),
            token
          );

          if (null != data) {
            toast(data.message);
            dispatch(updateUser({ ...user, emailverified: true }));
            //navigate("/client/dashboard", { replace: true });
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
      {!verified ? (
        <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
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
                Lets Verify Your Email
              </h1>
              <p className="text-center">
                Enter the 6 Digits Code that was sent to your email address{" "}
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
                    required="required"
                    value={formData.code}
                  />
                  <RegularButton text="continue" />
                </form>
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-right">
              <div className="h-48 hidden lg:block"></div>
              <div className="h-full flex items-end justify-end">
                <img src={right_pattern_boxes} alt="" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
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
                Email Verified Successfuly
              </h1>
              <p className="text-center">
                your email has already been verified
              </p>

              <div className="mt-8"></div>
            </div>
            <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-right">
              <div className="h-48 hidden lg:block"></div>
              <div className="h-full flex items-end justify-end">
                <img src={right_pattern_boxes} alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyEmail;

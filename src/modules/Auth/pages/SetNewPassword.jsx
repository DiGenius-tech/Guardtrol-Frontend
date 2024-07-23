import { useParams } from "react-router-dom";
import left_pattern_boxes from "../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../images/right-pattern-boxes.svg";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";

import { useContext, useEffect, useRef, useState } from "react";
import { selectUser } from "../../../redux/selectors/auth";
import { useDispatch, useSelector } from "react-redux";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { patch, post } from "../../../lib/methods";

function SetNewPassword() {
  const { token } = useParams();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [passwordChanged, setPasswordChanged] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    resetToken: token,
  });

  const password_field_ref = useRef();
  const [password_type, setPassword_type] = useState("password");
  const [confirm_password_type, setConfirm_password_type] =
    useState("password");

  // const [isPassword_confirm, setIsPassword_confirm] = useState(true);
  // const [isPassword, setIsPassword] = useState(true);

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
      const data = await patch(`users/resetpassword`, formData);

      if (null != data) {
        toast(data.message);
        setPasswordChanged(true);
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
      {/* set-new-password-app woks! */}

      {passwordChanged ? (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Password Changed
          </h1>
          <p className="text-center">
            Your password was changed successfully Hurray!!!
          </p>
          <br />
          <center>
            <Link to={"/auth/login"} className="text-primary-500 font-medium">
              Continue To Login
            </Link>
          </center>

          <div className="mt-8"></div>
        </>
      ) : (
        <>
          <div className="mt-16"></div>
          <h1 className="font-bold text-2xl tracking-wide text-center">
            Set New Password
          </h1>

          <div className="mt-8"></div>

          <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <form method="post" onSubmit={handleSubmit}>
              <TextInputField
                label="Password"
                name="password"
                type="password"
                placeholder="New Password"
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
                label="Password Confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Retype Password"
                id="password_confirmation"
                error={validationErrors["password_confirmation"]}
                onChange={handleChange}
                required="required"
                value={formData.password_confirmation}
                passwordToggler={true}
                passwordType={confirm_password_type}
                setPassword_type={setConfirm_password_type}
                togglePwdType={toggle_confirm_pwd_type}
              />
              <RegularButton text="Update password" />
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default SetNewPassword;

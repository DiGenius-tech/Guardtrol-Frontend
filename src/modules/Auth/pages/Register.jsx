import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleIconImg from "../../../../images/icons/google-social-icon.svg";
import left_pattern_boxes from "../../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../../images/right-pattern-boxes.svg";
import { AuthContext } from "../../../shared/Context/AuthContext";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  /**toggle password field type */
  const password_field_ref = useRef();
  const [password_type, setPassword_type] = useState("password");

  const toggle_pwd_type = () => {
    password_type === "password"
      ? setPassword_type("text")
      : setPassword_type("password");
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
    }

    if (Object.keys(newErrors).length > 0) {
      // If there are validation errors, update state and stop submission
      setValidationErrors(newErrors);
      e.stopPropagation();
    } else {
      // Form is valid, handle submission
      auth.loading(true);
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify(formData),
          {
            "Content-Type": "application/json",
          }
        );

        if (null != data) {
          if (auth.login(data)) {
            navigate("../verify-email", { replace: true }); //should be dashboard
            window.location.reload();
          }
          // navigate('../verify-email', {replace: true})
          // window.location.reload();
        }
      } catch (err) {
        console.log(err);
      } finally {
        auth.loading(false);
      }
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
      auth.loading(true);
      const accessToken = response.access_token;

      const userData = await getUserInfo(accessToken);

      console.log(userData);
      const data = await sendRequest(
        "http://localhost:5000/api/users/signupwithgoogle",
        "POST",
        JSON.stringify(userData),
        {
          "Content-type": "application/json",
        }
      );
      if (null != data) {
        if (auth.login(data)) {
          toast("Signup Successful");
          navigate("/client/dashboard", { replace: true }); //should be dashboard
          window.location.reload();
        }
      }

      //auth.login(data.token, data.userId)
    } catch (err) {
      console.log(err);
    } finally {
      auth.loading(false);
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await sendRequest(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
          accessToken,
        "GET",
        null,
        {}
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
      {/* register-app works! */}

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
                <TextInputField
                  label="Phone Number"
                  name="phone"
                  type="number"
                  placeholder="Phone Number"
                  id="phone"
                  error={validationErrors["phone"]}
                  onChange={handleChange}
                  required="required"
                  value={formData.phone}
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
                  //
                  password_field_ref={password_field_ref}
                  password_type={password_type}
                  setPassword_type={setPassword_type}
                  toggle_pwd_type={toggle_pwd_type}
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
                />
                <RegularButton text="Create An Account" />
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
                Sign Up With Google
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

export default Register;

import { useRef, useState } from "react";

function PasswordEventTest() {
  return (
    <>
      PasswordEventTest-app works!
      <Form />
    </>
  );
}

function Form() {
  const password_field_ref = useRef();
  const [password, setPassword] = useState("");
  const [password_type, setPassword_type] = useState("password");

  const confirm_password_field_ref = useRef();
  const [confirm_password, setConfirm_password] = useState("");
  const [confirmpassword_type, setConfirmPassword_type] = useState("password");

  const handle_password_change = (e) => {
    setPassword(e.target.value);
  };
  const handle_confirm_password_change = (e) => {
    setConfirm_password(e.target.value);
  };

  const toggle_pwd_type = () => {
    password_type === "password"
      ? setPassword_type("text")
      : setPassword_type("password");
  };
  const toggle_confirm_pwd_type = () => {
    confirmpassword_type === "password"
      ? setConfirmPassword_type("text")
      : setConfirmPassword_type("password");
  };
  return (
    <form action="" className="max-w-[500px] mx-auto">
      <div className="mb-4">
        {/* <label
          htmlFor="password"
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          ref={password_field_ref}
          value={password}
          onChange={(e) => handle_password_change(e)}
          type={password_type}
          id="password"
          className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        />
        <button type="button" onClick={toggle_pwd_type}>
          Toggle
        </button> */}

        {/*  */}
        <PasswordField
          label="Password"
          password_field_ref={password_field_ref}
          password={password}
          handle_password_change={handle_password_change}
          password_type={password_type}
          toggle_pwd_type={toggle_pwd_type}
          id="password"
        />
      </div>
      <div>
        {/* <label
          htmlFor="confirm_password"
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          Confirm Password
        </label>
        <input
          ref={confirm_password_field_ref}
          value={confirm_password}
          onChange={(e) => handle_confirm_password_change(e)}
          type={confirmpassword_type}
          id="confirm_password"
          className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
        />
        <button type="button" onClick={toggle_confirm_pwd_type}>
          Toggle
        </button> */}

        <PasswordField
          label="Confirm Password"
          password_field_ref={confirm_password_field_ref}
          password={confirm_password}
          handle_password_change={handle_confirm_password_change}
          password_type={confirmpassword_type}
          toggle_pwd_type={toggle_confirm_pwd_type}
          id="confirm_password"
        />
      </div>
    </form>
  );
}

function PasswordField({
  label,
  password_field_ref,
  password,
  handle_password_change,
  password_type,
  toggle_pwd_type,
  id,
}) {
  return (
    <>
      {/* PasswordField-app works! */}

      <label
        htmlFor={id}
        className="block mb-2 font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        ref={password_field_ref}
        value={password}
        onChange={(e) => handle_password_change(e)}
        type={password_type}
        id={id}
        className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
      />
      <button type="button" onClick={toggle_pwd_type}>
        Toggle
      </button>
    </>
  );
}

export default PasswordEventTest;

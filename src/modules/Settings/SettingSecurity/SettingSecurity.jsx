import React, { useState } from "react";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { post, put } from "../../../lib/methods";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../redux/selectors/auth";
import { errorHandler } from "../../../lib/errorHandler";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";

const securityDataSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Current Password must be at least 8 characters"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "New Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const SettingSecurity = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: securityDataSchema,
    onSubmit: (values) => {
      setLoading(true);
      try {
        handleSecurityData(values);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSecurityData = async (values) => {
    dispatch(suspenseShow());
    const data = await put(
      "auth/update-password",
      values,
      token,
      true,
      "Password updated"
    );
    dispatch(suspenseHide());
  };

  return (
    <>
      {/* setting-security-app works! */}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Change password</h3>
              <p>Passwords must be at least 8 characters long.</p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <TextInputField
                    label="Current Password"
                    name="curentPassword"
                    type="text"
                    class="mb-1"
                    {...formik.getFieldProps("currentPassword")}
                    id="cuurentPassword"
                    semibold_label={true}
                    //   error={validationErrors["currentPassword"]}
                    //   onChange={handleChange}
                    //   required="required"
                    //   value={formData.currentPassword}
                  />
                  <div className="mb-3">
                    {formik.touched.currentPassword &&
                      formik.errors.currentPassword && (
                        <div className="">
                          <div className="  text-red-500">
                            {formik.errors.currentPassword}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-1">
                  <TextInputField
                    label="New Password"
                    name="newPassword"
                    {...formik.getFieldProps("newPassword")}
                    type="text"
                    class="mb-1"
                    id="newPassword"
                    semibold_label={true}
                    //   error={validationErrors["newPassword"]}
                    //   onChange={handleChange}
                    //   required="required"
                    //   value={formData.newPassword}
                  />
                  <div className="mb-3">
                    {formik.touched.newPassword &&
                      formik.errors.newPassword && (
                        <div className="">
                          <div className="  text-red-500">
                            {formik.errors.newPassword}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-1">
                  <TextInputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="text"
                    class="mb-1"
                    {...formik.getFieldProps("confirmPassword")}
                    id="confirmPassword"
                    semibold_label={true}
                    //   error={validationErrors["confirmPassword"]}
                    //   onChange={handleChange}
                    //   required="required"
                    //   value={formData.confirmPassword}
                  />{" "}
                  <div className="mb-3">
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="">
                          <div className="  text-red-500">
                            {formik.errors.confirmPassword}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:text-right">
            <RegularButton
              disable={loading}
              type={"submit"}
              text="Change Password"
              width="auto"
              padding="px-4 py-2"
              textSize="text-sm"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingSecurity;

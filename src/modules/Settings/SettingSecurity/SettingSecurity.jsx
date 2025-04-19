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
import { updateUser } from "../../../redux/slice/authSlice";
import { useGetUserQuery } from "../../../redux/services/user";

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

const privacyPolicySchema = Yup.object().shape({
  privacyPolicyAccepted: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
  termsOfUseAccepted: Yup.boolean().oneOf([true], "You must accept the terms of use"),
  dataPrivacyAccepted: Yup.boolean().oneOf([true], "You must accept the data privacy policy"),
});

const SettingSecurity = () => {
  const [loading, setLoading] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(true);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const { data: userData, refetch } = useGetUserQuery(user._id, {
    skip: user?._id ? false : true,
  });

  // Add logging when component mounts
  React.useEffect(() => {
    console.log('Current Redux User:', user);
    console.log('Fetched User Data:', userData);
    
    // Only update if we have userData and the privacy values are different from current user
    if (userData?.roles?.[0]?.organization && 
        (!user.privacyPolicyAccepted || !user.termsOfUseAccepted || !user.dataPrivacyAccepted)) {
      const orgData = userData.roles[0].organization;
      dispatch(updateUser({
        ...user,
        privacyPolicyAccepted: orgData.privacyPolicyAccepted,
        termsOfUseAccepted: orgData.termsOfUseAccepted,
        dataPrivacyAccepted: orgData.dataPrivacyAccepted
      }));
    }
  }, [userData]); // Only depend on userData changes

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

  const privacyFormik = useFormik({
    initialValues: {
      privacyPolicyAccepted: userData?.privacyPolicyAccepted || false,
      termsOfUseAccepted: userData?.termsOfUseAccepted || false,
      dataPrivacyAccepted: userData?.dataPrivacyAccepted || false,
    },
    validationSchema: privacyPolicySchema,
    onSubmit: async (values) => {
      setPrivacyLoading(true);
      try {
        await handlePrivacyPolicyAcceptance(values);
        setShowAcceptButton(false);
      } catch (error) {
        errorHandler(error);
      } finally {
        setPrivacyLoading(false);
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

  const handlePrivacyPolicyAcceptance = async (values) => {
    dispatch(suspenseShow());
    try {
      const data = await put(
        "users/privacy-policy",
        values,
        token,
        true,
        "Privacy policy acceptance updated"
      );
      
      if (data) {
        // Update the Redux store with the new values
        if (userData?.roles?.[0]?.organization) {
          const orgData = userData.roles[0].organization;
          dispatch(updateUser({
            ...user,
            privacyPolicyAccepted: values.privacyPolicyAccepted,
            termsOfUseAccepted: values.termsOfUseAccepted,
            dataPrivacyAccepted: values.dataPrivacyAccepted
          }));
        }
        
        // Then refetch to ensure we have the latest data
        await refetch();
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(suspenseHide());
    }
  };

  // Update formik values when userData changes
  React.useEffect(() => {
    if (userData) {
      privacyFormik.setValues({
        privacyPolicyAccepted: userData.privacyPolicyAccepted || false,
        termsOfUseAccepted: userData.termsOfUseAccepted || false,
        dataPrivacyAccepted: userData.dataPrivacyAccepted || false,
      });
    }
  }, [userData]);

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
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

      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={privacyFormik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Privacy Policy & Terms</h3>
              <p>Please review and accept our policies to continue using our services.</p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <div className="grid grid-cols-1 gap-4">
                {userData?.privacyPolicyAccepted ? (
                  <div className="col-span-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View our Privacy Policy</a>
                    </p>
                  </div>
                ) : (
                  <div className="col-span-1">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="privacyPolicyAccepted"
                        {...privacyFormik.getFieldProps("privacyPolicyAccepted")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="privacyPolicyAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I accept the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {privacyFormik.touched.privacyPolicyAccepted && privacyFormik.errors.privacyPolicyAccepted && (
                      <div className="text-red-500 text-sm mt-1">{privacyFormik.errors.privacyPolicyAccepted}</div>
                    )}
                  </div>
                )}

                {userData?.termsOfUseAccepted ? (
                  <div className="col-span-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View our Terms of Use</a>
                    </p>
                  </div>
                ) : (
                  <div className="col-span-1">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="termsOfUseAccepted"
                        {...privacyFormik.getFieldProps("termsOfUseAccepted")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="termsOfUseAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I accept the <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms of Use</a>
                      </label>
                    </div>
                    {privacyFormik.touched.termsOfUseAccepted && privacyFormik.errors.termsOfUseAccepted && (
                      <div className="text-red-500 text-sm mt-1">{privacyFormik.errors.termsOfUseAccepted}</div>
                    )}
                  </div>
                )}

                {userData?.dataPrivacyAccepted ? (
                  <div className="col-span-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      <a href="/data-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View our Data Privacy Policy</a>
                    </p>
                  </div>
                ) : (
                  <div className="col-span-1">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="dataPrivacyAccepted"
                        {...privacyFormik.getFieldProps("dataPrivacyAccepted")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="dataPrivacyAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I accept the <a href="/data-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Data Privacy Policy</a>
                      </label>
                    </div>
                    {privacyFormik.touched.dataPrivacyAccepted && privacyFormik.errors.dataPrivacyAccepted && (
                      <div className="text-red-500 text-sm mt-1">{privacyFormik.errors.dataPrivacyAccepted}</div>
                    )}
                  </div>
                )}

                {userData?.privacyPolicyAccepted && userData?.termsOfUseAccepted && userData?.dataPrivacyAccepted && (
                  <div className="col-span-1">
                    <p className="text-green-600 dark:text-green-400">All policies have been accepted.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {(!userData?.privacyPolicyAccepted || !userData?.termsOfUseAccepted || !userData?.dataPrivacyAccepted) && showAcceptButton && (
            <div className="sm:text-right mt-4">
              <RegularButton
                disable={privacyLoading}
                type={"submit"}
                text="Accept Policies"
                width="auto"
                padding="px-4 py-2"
                textSize="text-sm"
              />
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default SettingSecurity;

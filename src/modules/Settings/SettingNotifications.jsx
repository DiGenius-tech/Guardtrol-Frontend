import React, { useState } from "react";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import TextInputField from "../Sandbox/InputField/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { patch } from "../../lib/methods";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../redux/selectors/auth";
import { errorHandler } from "../../lib/errorHandler";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { updateUser } from "../../redux/slice/authSlice";

const notificationDataSchema = Yup.object().shape({
  whatsappNumber: Yup.string()
    .required("WhatsApp Number is required")
    .min(10, "WhatsApp Number must be at least 10 characters"),
});

const SettingNotifications = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const formik = useFormik({
    initialValues: {
      whatsappNumber: user?.whatsappNumber || "",
    },
    validationSchema: notificationDataSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleNotificationData(values);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNotificationData = async (values) => {
    dispatch(suspenseShow());
    const data = await patch(
      "users/notifications",
      values,
      token,
      true,
      "Notification Options updated"
    );

    if (data) {
      console.log(data);
      dispatch(updateUser(data));
    }
    dispatch(suspenseHide());
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">WhatsApp Number</h3>
              <p>
                This number will be used to receive notifications on WhatsApp.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <TextInputField
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    type="text"
                    placeholder="Enter WhatsApp Number"
                    class="mb-1"
                    {...formik.getFieldProps("whatsappNumber")}
                    id="whatsappNumber"
                    semibold_label={true}
                  />
                  <div className="mb-3">
                    {formik.touched.whatsappNumber &&
                      formik.errors.whatsappNumber && (
                        <div className="">
                          <div className="text-red-500">
                            {formik.errors.whatsappNumber}
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
              text="Update"
              width="auto"
              padding="px-4 py-2"
              textSize="text-sm"
            />
          </div>
          <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
            <h4 className="font-bold text-yellow-800">Important Notice</h4>
            <p className="text-yellow-700">
              To receive notifications on WhatsApp, please ensure that you have
              accepted the most recent WhatsApp policy and terms. Click the link
              below to review and accept the terms.
            </p>
            <a
              href="https://wa.me/tos/20210210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Review and Accept WhatsApp Terms
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingNotifications;

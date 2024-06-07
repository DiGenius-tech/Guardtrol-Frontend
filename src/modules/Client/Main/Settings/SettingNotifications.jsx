import React, { useState } from "react";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { patch, post, put } from "../../../../lib/methods";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import { errorHandler } from "../../../../lib/errorHandler";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../redux/slice/suspenseSlice";
import { updateUser } from "../../../../redux/slice/authSlice";

const notificationDataSchema = Yup.object().shape({
  whatsappNumber: Yup.string()
    .required("Current Password is required")
    .min(0, "Current Password must be at least 6 characters"),
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
      {/* setting-security-app works! */}

      <form onSubmit={formik.handleSubmit} className="max-w-3xl">
        <div className="grid grid-cols-12 gap-4 sm:gap-8">
          <div className="hidden sm:block col-span-12 sm:col-span-6">
            <h3 className="font-bold">Whatsapp Number</h3>
            <p>
              This number would be you to recieve notifications on whatsapp.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <div className="grid grid-cols-1">
              <div className="col-span-1">
                <TextInputField
                  label="Whatsapp Number"
                  name="whatsappNumber"
                  type="text"
                  placeholder="Enter Whatsapp Number"
                  class="mb-1"
                  {...formik.getFieldProps("whatsappNumber")}
                  id="whatsappNumber"
                  semibold_label={true}
                  //   error={validationErrors["whatsappNumber"]}
                  //   onChange={handleChange}
                  //   required="required"
                  //   value={formData.whatsappNumber}
                />
                <div className="mb-3">
                  {formik.touched.whatsappNumber &&
                    formik.errors.whatsappNumber && (
                      <div className="">
                        <div className="  text-red-500">
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
      </form>
    </>
  );
};

export default SettingNotifications;

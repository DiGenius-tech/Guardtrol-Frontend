import React, { useRef, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../redux/selectors/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { post, put } from "../../../lib/methods";
import { updateUser } from "../../../redux/slice/authSlice";
import imageCompression from "browser-image-compression";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { API_BASE_URL, ASSET_URL } from "../../../constants/api";
import axios from "axios";
import { useGetUserQuery } from "../../../redux/services/user";
import { toast } from "react-toastify";

const PersonalInformationSchema = Yup.object().shape({
  name: Yup.string().required("Fullname is required"),
  email: Yup.string().required("Email is required"),
  phone: Yup.string().required("PhoneNumber is required"),
  address: Yup.string().required("Address is required"),
});

const SettingPersonalInformation = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const profilePhotoControlRef = useRef();

  const { data: userData, refetch } = useGetUserQuery(user._id, {
    skip: user?._id ? false : true,
  });
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [base, setBase] = useState("");
  const [profile, setProfile] = useState();

  const getSelectedFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.5, // Maximum file size in MB
        maxWidthOrHeight: 800, // Maximum width or height in pixels
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        setFileName(compressedFile.name);
        setProfile(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setBase(reader.result.split(",")[1]);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    } else {
      setFileName("");
    }
  };

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { ...user },
    validationSchema: PersonalInformationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleUpdateProfile(values);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleUpdateProfile = async (values) => {
    dispatch(suspenseShow());

    const data = await put(
      "settings/personal-information",
      {
        email: values.email,
        phone: values.phone,
        address: values.address,
        name: values.name,
      },
      token,
      true,
      "Profile information updated"
    );

    if (data) {
      await refetch();

      if (userData) {
        dispatch(updateUser(userData));
      }
    }
    dispatch(suspenseHide());
  };

  const handleUpdateImage = async () => {
    dispatch(suspenseShow());
    try {
      const formData = new FormData();
      formData.append("profile", profile);

      const { data } = await axios.put(
        `${API_BASE_URL}settings/personal-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data: userRes, isLoading } = await refetch();

      if (userRes) {
        dispatch(updateUser(userRes));
        dispatch(suspenseHide());

        toast("Profile Updated");
      }
    } catch (error) {
      dispatch(suspenseHide());
    } finally {
    }
  };

  return (
    <>
      <div className="mb-10 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Profile Photo</h3>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <div className="flex items-start gap-4">
                <div>
                  <div className=" relative h-20 w-20 min-h-20 min-w-20 rounded-full overflow-hidden">
                    <label
                      style={{
                        position: "absolute",
                        top: 0,
                        fontSize: 2,
                        right: 1,
                        zIndex: 100,
                      }}
                      htmlFor="profile_image"
                      className="cursor-pointer h-full w-full text-primary-500 text-xs font-semibold whitespace-nowrap"
                    >
                      Change my photo
                    </label>
                    <input
                      type="file"
                      id="profile_image"
                      name="profile_image"
                      className="absolute h-full w-full"
                      style={{
                        position: "absolute",
                        top: 0,
                        fontSize: 2,
                        right: 1,
                        zIndex: 100,
                      }}
                      hidden
                      ref={profilePhotoControlRef}
                      onChange={(e) => getSelectedFile(e)}
                    />

                    {!user?.image && !preview ? (
                      <div className="bg-secondary-50 cursor-pointer rounded-full h-full w-full flex items-center justify-center text-2xl font-bold">
                        {`${user?.name.split(" ")?.[0]?.[0] || ""} ${
                          user?.name.split(" ")?.[1]?.[0] || ""
                        }`}
                      </div>
                    ) : (
                      <img
                        className="cursor-pointer h-full w-full"
                        src={preview ? preview : `${ASSET_URL + user?.image}`}
                        alt={fileName}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    We accept files in PNG or JPG format, with a maximum size of
                    512 KB.{" "}
                    {fileName && (
                      <>
                        <span
                          onClick={() => handleUpdateImage()}
                          className="cursor-pointer text-primary-500 font-semibold whitespace-nowrap"
                        >
                          Change my photo
                        </span>
                        <strong className="block text-xs mt-2">
                          {fileName}
                        </strong>{" "}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Name</h3>
              <p>Please enter your name as it should appear on your profile.</p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <TextInputField
                label="Full Name"
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                semibold_label={true}
              />
              <div className="mb-3">
                {formik.touched.name && formik.errors.name && (
                  <div className="">
                    <div className="  text-red-500">{formik.errors.name}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Email Address</h3>
              <p>
                All communications and activity notifications will be sent to
                your email address.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <TextInputField
                label="Email Address"
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                semibold_label={true}
              />
              <div className="mb-3">
                {formik.touched.email && formik.errors.email && (
                  <div className="">
                    <div className="  text-red-500">{formik.errors.email}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Phone Number</h3>
              <p>
                Your phone number can be used as a security measure to validate
                some actions on the account.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <TextInputField
                label="Phone Number"
                {...formik.getFieldProps("phone")}
                type="text"
                id="phone"
                semibold_label={true}
              />
              <div className="mb-3">
                {formik.touched.phone && formik.errors.phone && (
                  <div className="">
                    <div className=" text-red-500">{formik.errors.phone}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Address</h3>
              <p>
                Your contact address is used as a billing information on invoice
                and subscription.
              </p>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <TextInputField
                label="Address"
                {...formik.getFieldProps("address")}
                type="text"
                id="address"
                semibold_label={true}
              />
              <div className="mb-3">
                {formik.errors.address && (
                  <div className="">
                    <div className=" text-red-500">{formik.errors.address}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <RegularButton
              disable={loading}
              type={"submit"}
              text="Save Changes"
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

export default SettingPersonalInformation;

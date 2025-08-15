import React, { useRef, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../redux/selectors/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { put } from "../../../lib/methods";
import { updateUser } from "../../../redux/slice/authSlice";
import imageCompression from "browser-image-compression";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { API_BASE_URL, ASSET_URL } from "../../../constants/api";
import axios from "axios";
import { useGetUserQuery } from "../../../redux/services/user";
import { toast } from "react-toastify";
import { countryCodes } from "../../../constants/countryCodes";

const PersonalInformationSchema = Yup.object().shape({
  name: Yup.string().required("Fullname is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().nullable(),
  address: Yup.string().required("Address is required"),
  countryCode: Yup.string().nullable(),
});

const SettingPersonalInformation = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const profilePhotoControlRef = useRef();

  const { refetch } = useGetUserQuery(user._id, {
    skip: user?._id ? false : true,
  });
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

  const getSelectedFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setFileName(compressedFile.name);
        setProfile(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    } else {
      setFileName("");
      setPreview("");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      countryCode: user?.countryCode || "+234",
    },
    validationSchema: PersonalInformationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleUpdateProfile(values);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleUpdateProfile = async (values) => {
    dispatch(suspenseShow());
    try {
      const data = await put(
        "settings/personal-information",
        {
          email: values.email,
          phone: values.phone || null,
          address: values.address,
          name: values.name,
          countryCode: values.countryCode || null,
        },
        token,
        true,
        "Profile information updated"
      );

      if (data) {
        const { data: userRes } = await refetch();
        if (userRes) {
          dispatch(updateUser(userRes));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      dispatch(suspenseHide());
    }
  };

  const handleUpdateImage = async () => {
    if (!profile) return;
    dispatch(suspenseShow());
    try {
      const formData = new FormData();
      formData.append("profile", profile);

      await axios.put(`${API_BASE_URL}settings/personal-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { data: userRes } = await refetch();

      if (userRes) {
        dispatch(updateUser(userRes));
        toast.success("Profile photo updated successfully!");
        setFileName("");
        setPreview("");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error("Failed to update profile photo.");
    } finally {
      dispatch(suspenseHide());
    }
  };

  const hasImage = !!(user?.image || preview);
  const imageSource = preview || `${ASSET_URL + user?.image}`;

  return (
    <>
      <div className="mb-10 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            {/* Profile Photo */}
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Profile Photo</h3>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <div className="flex items-start gap-4">
                <div>
                  <div className="relative h-20 w-20 min-h-20 min-w-20 rounded-full overflow-hidden">
                    <label htmlFor="profile_image" className="cursor-pointer h-full w-full block">
                      <input
                        type="file"
                        id="profile_image"
                        name="profile_image"
                        className="absolute h-full w-full opacity-0 cursor-pointer"
                        ref={profilePhotoControlRef}
                        onChange={(e) => getSelectedFile(e)}
                      />
                      {hasImage ? (
                        <img
                          className="h-full w-full object-cover"
                          src={imageSource}
                          alt={fileName || "Profile avatar"}
                          onError={(e) => {
                            e.target.src = "/images/icons/user.svg";
                          }}
                        />
                      ) : (
                        <img
                          className="h-full w-full object-cover"
                          src="/images/icons/user.svg"
                          alt="Default avatar"
                        />
                      )}
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    We accept files in PNG or JPG format, with a maximum size of 512 KB.{" "}
                    <span
                      onClick={() => profilePhotoControlRef.current.click()}
                      className="cursor-pointer text-primary-500 font-semibold whitespace-nowrap"
                    >
                      Change my photo
                    </span>
                    {fileName && (
                      <>
                        <strong className="block text-xs mt-2">{fileName}</strong>{" "}
                        <span
                          onClick={handleUpdateImage}
                          className="cursor-pointer text-green-500 font-semibold whitespace-nowrap"
                        >
                          Save Photo
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
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
                  <div className="text-red-500">{formik.errors.name}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Email Address</h3>
              <p>All communications and activity notifications will be sent to your email address.</p>
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
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>
            </div>

          {/* Phone */}
<div className="hidden sm:block col-span-12 sm:col-span-6">
  <h3 className="font-bold">Phone Number</h3>
  <p>Your phone number can be used as a security measure to validate some actions on the account. (Optional)</p>
</div>
<div className="col-span-12 sm:col-span-6">
  <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
    Phone Number
  </label>

  <div className="flex gap-2 items-center">
    {/* Country Code */}
    <select
      id="countryCode"
      name="countryCode"
      value={formik.values.countryCode}
      onChange={formik.handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 h-[42px] px-2
      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
      dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option value="" disabled>Code</option>
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.code}
        </option>
      ))}
    </select>

    {/* Phone Input */}
    <input
      placeholder="e.g., 8012345678"
      type="tel"
      id="phone"
      {...formik.getFieldProps("phone")}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 h-[42px] px-2 w-full
      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
      dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>

  <div className="mb-3">
    {formik.touched.phone && formik.errors.phone && (
      <div className="text-red-500">{formik.errors.phone}</div>
    )}
  </div>
</div>



            {/* Address */}
            <div className="hidden sm:block col-span-12 sm:col-span-6">
              <h3 className="font-bold">Address</h3>
              <p>Your contact address is used as a billing information on invoice and subscription.</p>
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
                {formik.errors.address && <div className="text-red-500">{formik.errors.address}</div>}
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
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

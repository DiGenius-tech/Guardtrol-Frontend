import React, { useEffect, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import SelectField from "../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { patch } from "../../../lib/methods";
import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../redux/services/guards";
import { ASSET_URL } from "../../../constants/api";
import { FaFileAlt } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import { COMPRESSION_OPRIONS } from "../../../constants/statics";

const titleOptions = [
  { name: "Mr", value: "Mr" },
  { name: "Mrs", value: "Mrs" },
];
const sexOptions = [
  { name: "Male", value: "male" },
  { name: "Female", value: "female" },
];

const identificationTypeOptions = [
  { name: "National Identification Number (NIN)", value: "NIN" },
  { name: "Drivers License", value: "Drivers License" },
  { name: "International Passport", value: "International Passport" },
  { name: "Voter's Card", value: "Voter's Card" },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <ul className="progress | flex items-center justify-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
      <li
        className={`step ${
          currentStep >= 1
            ? "text-primary-600 dark:text-primary-500"
            : "text-gray-500 dark:text-gray-400"
        } flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
      >
        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
          <svg
            className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="me-2">1</span>
          Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
      </li>
      <li
        className={`step ${
          currentStep >= 2
            ? "text-primary-600 dark:text-primary-500"
            : "text-gray-500 dark:text-gray-400"
        } flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
      >
        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
          <svg
            className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="me-2">2</span>
          Work <span className="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
      </li>
      <li
        className={`step ${
          currentStep >= 3
            ? "text-primary-600 dark:text-primary-500"
            : "text-gray-500 dark:text-gray-400"
        } flex items-center`}
      >
        <svg
          className="check-icon w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <span className="me-2">3</span>
        Identification
      </li>
    </ul>
  );
};
const validationSchema = Yup.object({
  title: Yup.string().required("Title required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Lastname is required"),
  email: Yup.string().required("Email is required"),
  dob: Yup.string().required("Dob is required"),
  sex: Yup.string().required("Sex is required"),
  phone: Yup.string().required("Phone is required"),
  altPhone: Yup.string().required("Alternate Phone is required"),
  placeOfWork: Yup.string().required("Place of work is required"),
  rank: Yup.string().required("Rank is required"),
  identificationNumber: Yup.string().required("Account number is required"),
  identificationType: Yup.string().required("Identification Type is required"),
  identificationFile: Yup.mixed().required("Identification File is required"),
});

const EditGuarantorForm = (props) => {
  const { guardId } = useParams();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);
  const { data: guards, refetch: refetchGuards } = useGetGuardsQuery(
    { organization },
    { skip: organization ? false : true }
  );

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  // const [formData, setFormData] = useState({
  //   title: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   dob: "",
  //   sex: "",
  //   phone: "",
  //   altPhone: "",
  //   placeOfWork: "",
  //   rank: "",
  //   identificationNumber: "",
  //   identificationFile: null,
  //   identificationType: "",
  // });

  // useEffect(() => {
  //   if (props.guard) {
  //     setFormData({
  //       title: props.guard?.title || "",
  //       firstName: props.guard?.firstName || "",
  //       lastName: props.guard?.lastName || "",
  //       email: props.guard?.email || "",
  //       dob: props.guard?.dob || "",
  //       sex: props.guard?.sex || "",
  //       phone: props.guard?.phone || "",
  //       altPhone: props.guard?.altPhone || "",
  //       placeOfWork: props.guard?.placeOfWork || "",
  //       rank: props.guard?.rank || "",
  //       identificationNumber: props.guard?.identificationNumber || "",
  //       identificationFile: props.guard?.identificationFile || null,
  //       identificationType: props.guard?.identificationType || "",
  //     });
  //   }
  // }, [props.guard]);

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      try {
        // const compressedFile = await imageCompression(
        //   uploadedFile,
        //   COMPRESSION_OPRIONS
        // );
        formik.values.identificationFile = uploadedFile;
        // setFormData({ ...formData, identificationFile: compressedFile });
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      title: props.guard?.title || "",
      firstName: props.guard?.firstName || "",
      lastName: props.guard?.lastName || "",
      email: props.guard?.email || "",
      dob: props.guard?.dob || "",
      sex: props.guard?.sex || "",
      phone: props.guard?.phone || "",
      altPhone: props.guard?.altPhone || "",
      placeOfWork: props.guard?.placeOfWork || "",
      rank: props.guard?.rank || "",
      identificationNumber: props.guard?.identificationNumber || "",
      identificationFile: props.guard?.identificationFile || null,
      identificationType: props.guard?.identificationType || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let compressedFile = null;
        if (typeof values?.identificationFile === "object") {
          compressedFile = await imageCompression(
            values.identificationFile,
            COMPRESSION_OPRIONS
          );
        }
        const newFormData = new FormData();
        Object.keys({ ...values, identificationFile: compressedFile }).forEach(
          (key) => {
            newFormData.append(key, values[key]);
          }
        );
        // identificationFile
        const data = await patch(
          `guard/guarantor/${guardId}`,
          newFormData,
          token
        );

        if (data?.status) {
          toast("Guarantor Information Updated");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        await refetchGuards();
        setLoading(false);
      }
    },
  });

  // const save = async (e) => {
  //   setLoading(true);
  //   try {
  //     e.preventDefault();
  //     if (!formData.identificationType) {
  //       refetchGuards();
  //       toast.warn("Select a valid identification type");
  //       return;
  //     }
  //     const newFormData = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       newFormData.append(key, formData[key]);
  //     });

  //     const data = await patch(
  //       `guard/guarantor/${guardId}`,
  //       newFormData,
  //       token
  //     );

  //     if (data.status) {
  //       toast("Guarantor Information Updated");
  //     }
  //   } catch (error) {
  //     console.error("Failed to save guarantor information", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const renderStepContent = () => {
  //   switch (step) {
  //     case 1:
  //       return (
  //         <div className="grid grid-cols-2 w-full gap-3">
  //           <div className="">
  //             <TextInputField
  //               label="Title"
  //               semibold_label={true}
  //               type="text"
  //               id="title"
  //               required="required"
  //               name="title"
  //               value={formData.title}
  //               onChange={handleChange}
  //             />
  //           </div>
  //           <TextInputField
  //             label="First Name"
  //             semibold_label={true}
  //             type="text"
  //             id="firstName"
  //             required="required"
  //             name="firstName"
  //             value={formData.firstName}
  //             onChange={handleChange}
  //           />
  //           <TextInputField
  //             label="Last Name"
  //             semibold_label={true}
  //             type="text"
  //             id="lastName"
  //             required="required"
  //             name="lastName"
  //             value={formData.lastName}
  //             onChange={handleChange}
  //           />
  //           <TextInputField
  //             label="Email"
  //             semibold_label={true}
  //             type="email"
  //             id="email"
  //             required="required"
  //             name="email"
  //             value={formData.email}
  //             onChange={handleChange}
  //           />
  //           <TextInputField
  //             label="Date of Birth"
  //             semibold_label={true}
  //             type="date"
  //             id="dob"
  //             required="required"
  //             name="dob"
  //             value={formData.dob}
  //             onChange={handleChange}
  //           />
  //           <SelectField
  //             value={formData.sex}
  //             name="sex"
  //             id="sex"
  //             label="Sex"
  //             semibold_label={true}
  //            onChange={handleChange}
  //             optionList={sexOptions}
  //             multipleSelect={false}
  //           />
  //           <TextInputField
  //             label="Phone"
  //             semibold_label={true}
  //             type="text"
  //             id="phone"
  //             required="required"
  //             name="phone"
  //             value={formData.phone}
  //             onChange={handleChange}
  //           />
  //           <TextInputField
  //             label="Alternative Phone"
  //             semibold_label={true}
  //             type="text"
  //             id="altPhone"
  //             name="altPhone"
  //             value={formData.altPhone}
  //             onChange={handleChange}
  //           />
  //         </div>
  //       );
  //     case 2:
  //       return (
  //         <div className="grid grid-cols-2 w-full gap-3">
  //           <TextInputField
  //             label="Place of Work"
  //             semibold_label={true}
  //             type="text"
  //             id="placeOfWork"
  //             required="required"
  //             name="placeOfWork"
  //             value={formData.placeOfWork}
  //             onChange={handleChange}
  //           />
  //           <TextInputField
  //             label="Rank"
  //             semibold_label={true}
  //             type="text"
  //             id="rank"
  //             required="required"
  //             name="rank"
  //             value={formData.rank}
  //             onChange={handleChange}
  //           />
  //         </div>
  //       );
  //     case 3:
  //       return (
  //         <div className="grid grid-cols-2 w-full gap-3">
  //           <SelectField
  //             value={formData.identificationType}
  //             name="identificationType"
  //             id="identificationType"
  //             label="Identification Type"
  //             semibold_label={true}
  //            onChange={handleChange}
  //             optionList={identificationTypeOptions}
  //             multipleSelect={false}
  //           />
  //           <TextInputField
  //             label="Identification Number"
  //             semibold_label={true}
  //             type="text"
  //             id="identificationNumber"
  //             required="required"
  //             name="identificationNumber"
  //             value={formData.identificationNumber}
  //             onChange={handleChange}
  //           />
  //           <div className=" col-span-2 md:col-span-1">
  //             <label htmlFor="fileUpload" className="semibold_label">
  //               Upload Identification File
  //             </label>
  //             {props.guard?.identificationFile && (
  //               <a
  //                 target="_blank"
  //                 href={`${ASSET_URL + props.guard?.identificationFile}`}
  //               >
  //                 <div className="flex items-center mt-2 my-3">
  //                   <FaFileAlt className="mr-2" size={"3rem"} />
  //                   <div>
  //                     <span>
  //                       {props.guard?.identificationType ||
  //                         "Previously uploaded file"}
  //                     </span>{" "}
  //                     <br />
  //                     <span>
  //                       {props.guard?.identificationNumber ||
  //                         "Previously uploaded file"}
  //                     </span>
  //                   </div>
  //                 </div>
  //               </a>
  //             )}
  //             <FileInput
  //               id="file"
  //               onChange={handleFileChange}
  //               accept=".pdf, image/*"
  //               className=" placeholder-red-900"
  //               helperText="Select Upload Identification File"
  //             />
  //           </div>
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };
  return (
    <div className="max-w-5xl mx-auto flex justify-center items-center flex-col gap-6">
      {/* <StepIndicator currentStep={step} /> */}
      <form onSubmit={formik.handleSubmit} className="max-w-[600px] w-full ">
        {/* {renderStepContent()} */}
        <div className="flex flex-col items-center justify-between mt-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Title"
                type="text"
                {...formik.getFieldProps("title")}
              />
            </div>

            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="First Name"
                type="text"
                id="firstName"
                error={formik.errors.firstName}
                {...formik.getFieldProps("firstName")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Last Name"
                type="text"
                error={formik.errors.lastName}
                {...formik.getFieldProps("lastName")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Email"
                type="email"
                error={formik.errors.email}
                semibold_label={true}
                required="required"
                {...formik.getFieldProps("email")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Date of Birth"
                type="date"
                error={formik.errors.dob}
                id="dob"
                {...formik.getFieldProps("dob")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <SelectField
                name="sex"
                id="sex"
                defaultValue={props.guard?.sex}
                error={formik.errors.sex}
                label="Sex"
                {...formik.getFieldProps("sex")}
                optionList={sexOptions}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Phone"
                type="text"
                error={formik.errors.phone}
                {...formik.getFieldProps("phone")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Alternative Phone"
                error={formik.errors.altPhone}
                type="text"
                {...formik.getFieldProps("altPhone")}
                name="altPhone"
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Place of Work"
                required="required"
                error={formik.errors.placeOfWork}
                type="text"
                {...formik.getFieldProps("placeOfWork")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Rank"
                semibold_label={true}
                type="text"
                error={formik.errors.rank}
                {...formik.getFieldProps("rank")}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <SelectField
                name="identificationType"
                label="Identification Type"
                error={formik.errors.identificationType}
                {...formik.getFieldProps("identificationType")}
                optionList={identificationTypeOptions}
                multipleSelect={false}
                defaultValue={props?.guard?.identificationType}
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <TextInputField
                label="Identification Number"
                type="text"
                error={formik.errors.identificationNumber}
                {...formik.getFieldProps("identificationNumber")}
                name="identificationNumber"
              />
            </div>
            <div className=" col-span-2 md:col-span-1">
              <label htmlFor="fileUpload" className="semibold_label">
                Upload Identification File
              </label>
              {props.guard?.identificationFile && (
                <a
                  target="_blank"
                  href={`${ASSET_URL + props.guard?.identificationFile}`}
                >
                  <div className="flex items-center mt-2 my-3">
                    <FaFileAlt className="mr-2" size={"3rem"} />
                    <div>
                      <span>
                        {props.guard?.identificationType ||
                          "Previously uploaded file"}
                      </span>{" "}
                      <br />
                      <span>
                        {props.guard?.identificationNumber ||
                          "Previously uploaded file"}
                      </span>
                    </div>
                  </div>
                </a>
              )}
              <div className=" col-span-6">
                <input
                  // {...formik.getFieldProps("identificationFile")}
                  type="file"
                  onChange={(e) => handleFileChange(e)}
                  className="file-input"
                />
                {formik.errors.identificationFile && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {formik.errors.identificationFile}
                    </span>
                  </p>
                )}
              </div>
              {/* <FileInput
                id="file"
                onChange={handleFileChange}
                accept=".pdf, image/*"
                className=" placeholder-red-900"
                helperText="Select Upload Identification File"
              /> */}
            </div>
          </div>
          <div className="col-span-6 justify-start my-5 items-start flex">
            <RegularButton
              disabled={loading}
              isLoading={loading}
              text="Save"
              type="submit"
              width="100%"
              padding="px-8 py-2"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditGuarantorForm;

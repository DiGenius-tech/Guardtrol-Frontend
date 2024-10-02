import React, { useEffect, useState } from "react";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import SelectField from "../../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { patch } from "../../../../lib/methods";
import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../../redux/services/guards";
import { ASSET_URL } from "../../../../constants/api";
import { FaFileAlt } from "react-icons/fa";

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
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    sex: "",
    phone: "",
    altPhone: "",
    placeOfWork: "",
    rank: "",
    identificationNumber: "",
    identificationFile: null,
    identificationType: "",
  });

  useEffect(() => {
    if (props.guard) {
      setFormData({
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
      });
    }
  }, [props.guard]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(uploadedFile, options);
        setFormData({ ...formData, identificationFile: compressedFile });
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };

  const save = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!formData.identificationType) {
        refetchGuards();
        toast.warn("Select a valid identification type");
        return;
      }
      const newFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        newFormData.append(key, formData[key]);
      });

      const data = await patch(
        `guard/guarantor/${guardId}`,
        newFormData,
        token
      );

      console.log(data);

      if (data.status) {
        toast("Guarantor Information Updated");
      }
    } catch (error) {
      console.error("Failed to save guarantor information", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 w-full gap-3">
            <div className="">
              <TextInputField
                label="Title"
                semibold_label={true}
                type="text"
                id="title"
                required="required"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <TextInputField
              label="First Name"
              semibold_label={true}
              type="text"
              id="firstName"
              required="required"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextInputField
              label="Last Name"
              semibold_label={true}
              type="text"
              id="lastName"
              required="required"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextInputField
              label="Email"
              semibold_label={true}
              type="email"
              id="email"
              required="required"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextInputField
              label="Date of Birth"
              semibold_label={true}
              type="date"
              id="dob"
              required="required"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            <SelectField
              value={formData.sex}
              name="sex"
              id="sex"
              label="Sex"
              semibold_label={true}
              handleChangeOption={handleChange}
              optionList={sexOptions}
              multipleSelect={false}
            />
            <TextInputField
              label="Phone"
              semibold_label={true}
              type="text"
              id="phone"
              required="required"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextInputField
              label="Alternative Phone"
              semibold_label={true}
              type="text"
              id="altPhone"
              name="altPhone"
              value={formData.altPhone}
              onChange={handleChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 w-full gap-3">
            <TextInputField
              label="Place of Work"
              semibold_label={true}
              type="text"
              id="placeOfWork"
              required="required"
              name="placeOfWork"
              value={formData.placeOfWork}
              onChange={handleChange}
            />
            <TextInputField
              label="Rank"
              semibold_label={true}
              type="text"
              id="rank"
              required="required"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
            />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 w-full gap-3">
            <SelectField
              value={formData.identificationType}
              name="identificationType"
              id="identificationType"
              label="Identification Type"
              semibold_label={true}
              handleChangeOption={handleChange}
              optionList={identificationTypeOptions}
              multipleSelect={false}
            />
            <TextInputField
              label="Identification Number"
              semibold_label={true}
              type="text"
              id="identificationNumber"
              required="required"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
            />
            <div className=" col-span-2">
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
              <FileInput
                id="file"
                onChange={handleFileChange}
                accept=".pdf, image/*"
                className=" placeholder-red-900"
                helperText="Select Upload Identification File"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex justify-center items-center flex-col gap-6">
      <StepIndicator currentStep={step} />
      <form onSubmit={save} className="max-w-[600px] w-full ">
        {renderStepContent()}
        <div className="flex items-center justify-between mt-4 w-full">
          {step > 1 && (
            <RegularButton
              text="Previous"
              type="button"
              width="auto"
              padding="px-8 py-2"
              backgroundColor="gray-200 text-primary-500"
              onClick={() => setStep(step - 1)}
            />
          )}
          {step < 3 && (
            <RegularButton
              text="Next"
              type="button"
              width="auto"
              padding="px-8 py-2"
              onClick={() => setStep(step + 1)}
            />
          )}
          {step === 3 && (
            <RegularButton
              disabled={loading}
              isLoading={loading}
              text="Complete"
              type="submit"
              width="auto"
              padding="px-8 py-2"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default EditGuarantorForm;

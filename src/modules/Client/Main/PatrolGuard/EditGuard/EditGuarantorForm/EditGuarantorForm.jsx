import React, { useContext, useEffect, useRef, useState } from "react";
import Stepper from "../../../../../Sandbox/StepperWidget/stepper";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { patch } from "../../../../../../lib/methods";
import { Formik } from "formik";
import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../../../../redux/services/guards";
import { ASSET_URL } from "../../../../../../constants/api";
import { FaFileAlt } from "react-icons/fa";

const titleOptions = [
  {
    name: "Mr",
    value: "Mr",
  },
  {
    name: "Mrs",
    value: "Mrs",
  },
];
const sexOptions = [
  {
    name: "Male",
    value: "male",
  },
  {
    name: "Female",
    value: "female",
  },
];

const formContent = {
  PERSONAL_INFO: "PERSONAL_INFO",
  WORK_INFO: "WORK_INFO",
  IDENTIFICATION: "IDENTIFICATION",
};

const identificationTypeOptions = [
  {
    name: "National Identification Number (NIN)",
    value: "NIN",
  },
  {
    name: "Drivers License ",
    value: "Drivers License ",
  },
  {
    name: "International Passport",
    value: "International Passport",
  },

  {
    name: "Voter Card",
    value: "Voter Card",
  },
];

const EditGuarantorForm = (props) => {
  const { guardId } = useParams();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const stepperRef = useRef(); //stepperWrapper
  const pagesRef = useRef();
  const progressRef = useRef();
  const [pages, setPages] = useState();
  const [pagesWidth, setPagesWidth] = useState(0);
  const [progressBar, setProgressBar] = useState();
  const [stepper, setStepper] = useState();
  const [marginSize, setMarginSize] = useState(0);
  const [stepperError, setStepperError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [formCompleted, setFormCompleted] = useState(false);
  const [title, setTitle] = useState(titleOptions[0]);
  const [sex, setSex] = useState(sexOptions[0]);
  const [identificationType, setIdentificationType] = useState(
    identificationTypeOptions[0]
  );

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    sex: "",
    phone: "",
    //
    altPhone: "",
    placeOfWork: "",
    rank: "",
    //
    identificationNumber: "",
    identificationFile: null,
    identificationType: "",
  });
  const organization = useSelector(selectOrganization);
  const {
    data: guards,
    refetch: refetchGuards,
    isUninitialized,
  } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  useEffect(() => {
    setFormData({
      title: props.guard?.title,
      firstName: props.guard?.firstName,
      lastName: props.guard?.lastName,
      email: props.guard?.email,
      dob: props.guard?.dob,
      sex: props.guard?.sex,
      phone: props.guard?.phone,
      //
      altPhone: props.guard?.altPhone,
      placeOfWork: props.guard?.placeOfWork,
      rank: props.guard?.rank,
      //
      identificationNumber: props.guard?.identificationNumber,
      identificationFile: props.guard?.identificationFile,
      identificationType: props.guard?.identificationType,
    });
  }, [props]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setStepperError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSelectChange = (e) => {
    setStepperError("");
    let _title = e.target.value;

    setFormData({ ...formData, [e.target.name]: _title });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleNext = (content) => {
    switch (content) {
      case formContent.PERSONAL_INFO:
        console.log(formData);
        if (
          formData.title &&
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.dob &&
          formData.sex &&
          formData.phone
        ) {
          if (marginSize < 200) {
            stepper.stepForward();
            handleMarginSizeSetter();
          }
        } else {
          setStepperError("Complete personal information fields!");
          handleMarginSizeSetter();
        }
        break;

      case formContent.WORK_INFO:
        if (formData.placeOfWork && formData.rank) {
          if (marginSize < 200) {
            stepper.stepForward();
          }
        } else {
          setStepperError("Complete work information fields!");
        }
        break;

      case formContent.IDENTIFICATION:
        if (formData.identificationNumber) {
          if (marginSize < 200) {
            stepper.stepForward();
          }
        } else {
          setStepperError("Complete identification fields!");
        }
        break;

      default:
        break;
    }
  };

  const handlePrevious = () => {
    stepper.stepBackward();
  };

  const handleMarginSizeSetter = () => {
    const mg_size = stepper.getMarginSize();
    setMarginSize(mg_size);
  };

  useEffect(() => {
    setPages(pagesRef.current);
    setProgressBar(progressRef.current);
    const list = pages ? pages.getElementsByClassName("page") : null;
    const pageCount = list ? list.length : null;
    setPagesWidth(pageCount * 100);
    setStepper(new Stepper(pages, pageCount, progressBar));
    return () => {};
  }, [pages]);

  useEffect(() => {
    // setMarginSize(stepper.getMarginSize());
    // console.log("setMarginSize: ", marginSize);
  }, []);

  const save = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!formData.identificationType) {
        refetchGuards();
        toast.warn("select a valid identification type");
        return;
      }
      const newFormData = new FormData();

      newFormData.append("title", formData.title);
      newFormData.append("firstName", formData.firstName);
      newFormData.append("lastName", formData.lastName);
      newFormData.append("email", formData.email);
      newFormData.append("dob", formData.dob);
      newFormData.append("sex", formData.sex);
      newFormData.append("phone", formData.phone);
      newFormData.append("altPhone", formData.altPhone);
      newFormData.append("placeOfWork", formData.placeOfWork);
      newFormData.append("rank", formData.rank);
      newFormData.append("identificationFile", formData.identificationFile);
      newFormData.append("identificationNumber", formData.identificationNumber);
      newFormData.append("identificationType", formData.identificationType);

      const data = patch(`guard/guarantor/${guardId}`, newFormData, token).then(
        (data) => {
          if (data.status) {
            toast("Guarantor Information Updated");
            //props.setGuard({})
            handleNext(formContent.IDENTIFICATION);
          }
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    setFormData({ ...formData, identificationFile: uploadedFile });
  };

  return (
    <>
      {/* edit-new-guarantor-form-app works! */}

      <div className="stepper-widget">
        <div className="max-w-5xl mx-auto">
          <ol
            ref={progressRef}
            className="progress | flex items-center justify-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
          >
            <li className="step current flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
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
                Personal{" "}
                <span className="hidden sm:inline-flex sm:ms-2">Info</span>
              </span>
            </li>
            <li className="step flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
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
            <li className="step flex items-center">
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
          </ol>

          <form onSubmit={save}>
            <div
              ref={stepperRef}
              className="stepper py-8 min-h-max"
              id="free-online-appointment-form-stepper"
            >
              <ul
                ref={pagesRef}
                className="pages"
                style={{
                  width: `${pagesWidth}%`,
                }}
              >
                {/* <!-- Page1 --> */}
                <li className="page">
                  {/* Step 1 */}

                  <div className="mx-auto max-w-xl">
                    <fieldset>
                      <legend className="text-xl font-semibold mb-8 text-center">
                        Personal Information
                      </legend>

                      {stepperError ? (
                        <div
                          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center"
                          role="alert"
                        >
                          <span className="font-medium">Please!</span>{" "}
                          {stepperError}.
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="grid grid-cols-12 gap-x-4">
                        <div className="col-span-12">
                          <SelectField
                            value={title}
                            name="title"
                            defaultValue={props?.guard?.title || ""}
                            id="title"
                            label="Title"
                            semibold_label={true}
                            handleChangeOption={handleSelectChange}
                            optionList={titleOptions}
                            multipleSelect={false}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="First Name"
                            semibold_label={true}
                            type="text"
                            id="firstName"
                            required="required"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={validationErrors["firstName"]}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Last Name"
                            semibold_label={true}
                            type="text"
                            id="lastName"
                            required="required"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={validationErrors["lastName"]}
                          />
                        </div>
                        <div className="col-span-12">
                          <TextInputField
                            label="Email"
                            semibold_label={true}
                            type="text"
                            id="email"
                            required="required"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={validationErrors["email"]}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Date of Birth"
                            semibold_label={true}
                            type="date"
                            id="dob"
                            required="required"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            error={validationErrors["dob"]}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <SelectField
                            value={sex}
                            defaultValue={props?.guard?.sex || ""}
                            name="sex"
                            id="sex"
                            label="Sex"
                            semibold_label={true}
                            handleChangeOption={handleSelectChange}
                            optionList={sexOptions}
                            multipleSelect={false}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Phone"
                            semibold_label={true}
                            type="text"
                            id="phone"
                            required="required"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={validationErrors["phone"]}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Alternative Phone"
                            semibold_label={true}
                            type="text"
                            id="altPhone"
                            name="altPhone"
                            value={formData.altPhone}
                            onChange={handleChange}
                            error={validationErrors["altPhone"]}
                          />
                        </div>
                      </div>
                      <RegularButton
                        text="Next"
                        type="button"
                        width="auto"
                        padding="px-8 py-2"
                        onClick={() => handleNext(formContent.PERSONAL_INFO)}
                      />
                    </fieldset>
                  </div>
                </li>
                {/* <!-- Page 2 --> */}
                <li className="page">
                  <div className="mx-auto max-w-xl">
                    <fieldset>
                      <legend className="text-xl font-semibold mb-8 text-center">
                        Work Information
                      </legend>
                      {stepperError ? (
                        <div
                          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center"
                          role="alert"
                        >
                          <span className="font-medium">Please!</span>{" "}
                          {stepperError}.
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="grid grid-cols-12 gap-x-4">
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Place of Work"
                            semibold_label={true}
                            type="text"
                            id="placeOfWork"
                            required="required"
                            name="placeOfWork"
                            value={formData.placeOfWork}
                            onChange={handleChange}
                            error={validationErrors["placeOfWork"]}
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <TextInputField
                            label="Rank"
                            semibold_label={true}
                            type="text"
                            id="rank"
                            required="required"
                            name="rank"
                            value={formData.rank}
                            onChange={handleChange}
                            error={validationErrors["rank"]}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <RegularButton
                          text="Prev"
                          type="button"
                          width="auto"
                          padding="px-8 py-2"
                          backgroundColor="gray-200 text-primary-500"
                          onClick={() => handlePrevious()}
                        />
                        <RegularButton
                          text="Next"
                          type="button"
                          width="auto"
                          padding="px-8 py-2"
                          onClick={() => handleNext(formContent.WORK_INFO)}
                        />
                      </div>
                    </fieldset>
                  </div>
                </li>
                {/* <!-- Page 3 --> */}
                <li className="page">
                  <div className="mx-auto max-w-xl">
                    <fieldset>
                      <legend className="text-xl font-semibold mb-8 text-center">
                        Identification
                      </legend>
                      {stepperError ? (
                        <div
                          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center"
                          role="alert"
                        >
                          <span className="font-medium">Please!</span> Complete
                          required fields!.
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="grid grid-cols-12 gap-x-4">
                        <div className="col-span-12">
                          <SelectField
                            value={identificationType}
                            name="identificationType"
                            id="identificationType"
                            label="Identification type"
                            semibold_label={true}
                            handleChangeOption={handleSelectChange}
                            optionList={identificationTypeOptions}
                            multipleSelect={false}
                          />
                        </div>

                        <div className="col-span-12">
                          <TextInputField
                            label="Identification number"
                            semibold_label={true}
                            type="text"
                            id="identificationNumber"
                            required="required"
                            name="identificationNumber"
                            value={formData.identificationNumber}
                            onChange={handleChange}
                            error={validationErrors["identificationNumber"]}
                          />
                        </div>
                        <div className="col-span-12  mb-3">
                          <label
                            htmlFor="fileUpload"
                            className="semibold_label"
                          >
                            Upload Identification File
                          </label>
                          {props.guard?.identificationFile && (
                            <a
                              target="_blank"
                              href={`${
                                ASSET_URL + props.guard?.identificationFile
                              }`}
                            >
                              <div className="flex items-center mt-2 my-3">
                                <div>
                                  <FaFileAlt className="mr-2" size={"3rem"} />
                                </div>
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

                          {/* <input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                            className="file-input"
                          /> */}
                          {/* {identificationFile && (
                            <div className="file-preview">
                              <h2>Preview:</h2>
                              <FileViewer
                                fileType={file.type.split("/")[1]} // Extract the file extension
                                filePath={URL.createObjectURL(
                                  identificationFile
                                )}
                                onError={(e) =>
                                  console.log("Error while previewing file:", e)
                                }
                              />
                            </div>
                          )} */}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <RegularButton
                          text="Prev"
                          type="button"
                          width="auto"
                          padding="px-8 py-2"
                          backgroundColor="gray-200 text-primary-500"
                          onClick={() => handlePrevious()}
                        />
                        <RegularButton
                          disabled={loading}
                          isLoading={loading}
                          text="Complete"
                          type="submit"
                          width="auto"
                          padding="px-8 py-2"
                          // onClick={() => handleNext(formContent.IDENTIFICATION)}
                        />
                      </div>
                    </fieldset>
                  </div>
                </li>
                {/* <!-- Page 4 --> */}
                <li className="page">
                  <div className="flex items-center justify-center my-16">
                    <p className="text-2xl font-bold">Thank you!</p>
                  </div>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditGuarantorForm;

import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import SelectField from "../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";

import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuth, selectOrganization } from "../../../redux/selectors/auth";
import { patch } from "../../../lib/methods";
import imageCompression from "browser-image-compression";
import * as Yup from "yup";
import { useFormik } from "formik";

import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../redux/services/guards";
import { FaFileAlt } from "react-icons/fa";
import { ASSET_URL } from "../../../constants/api";

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
    name: "Voter's Card",
    value: "Voter's Card",
  },
];

const validationSchema = Yup.object({
  relationship: Yup.string().required("Relationship is required"),
  name: Yup.string().required("Full name is required"),
  idname: Yup.string().required("Identification file type is required"),
  idnumber: Yup.string().required("Identification Number is required"),
  phone: Yup.string().required("Identification file type is required"),
  nextofkinIdentificationFile: Yup.mixed().required(
    "Guard Identification File is required"
  ),
});
const EditNextOfKin = (props) => {
  const { guardId } = useParams();
  const auth = useSelector(selectAuth);
  const [isLoading, setIsLoading] = useState(false);

  const { user, token } = useSelector(selectAuth);
  const organization = useSelector(selectOrganization);
  const {
    data: guards,
    refetch: refetchGuards,
    isUninitialized,
  } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  // const [validationErrors, setValidationErrors] = useState({});
  // const [formData, setFormData] = useState({
  //   name: "",
  //   idnumber: "",
  //   phone: "",
  //   nextofkinIdentificationFile: null,
  //   idname: "",
  //   relationship: "",
  // });

  // useEffect(() => {
  //   setFormData({
  //     name: props.guard?.name,
  //     idnumber: props.guard?.idnumber,
  //     idname: props.guard?.idname,
  //     phone: props.guard?.phone,
  //     relationship: props.guard?.relationship,
  //     nextofkinIdentificationFile: props.guard?.nextofkinIdentificationFile,
  //   });
  // }, []);
  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      try {
        formik.values.nextofkinIdentificationFile = uploadedFile;
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: props.guard?.name || "",
      idnumber: props.guard?.idnumber || "",
      idname: props.guard?.idname || "",
      phone: props.guard?.phone || "",
      relationship: props.guard?.relationship || "",
      nextofkinIdentificationFile:
        props.guard?.nextofkinIdentificationFile || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const newFormData = new FormData();

        newFormData.append("idname", values.idname);
        newFormData.append("name", values.name);
        newFormData.append("phone", values.phone);
        newFormData.append("idnumber", values.idnumber);
        newFormData.append("relationship", values.relationship);
        newFormData.append(
          "nextofkinIdentificationFile",
          values.nextofkinIdentificationFile
        );

        const data = await patch(
          `guard/nextofkin/${guardId}`,
          newFormData,
          token
        )?.then((data) => {
          if (data?.status) {
            refetchGuards();
            toast("Next of Kin Information Updated");
            //props.setGuard({})
          } else {
          }
        });
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    },
  });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  // };

  // const handleFileChange = async (event) => {
  //   const uploadedFile = event.target.files[0];

  //   if (uploadedFile) {
  //     const options = {
  //       maxSizeMB: 0.5, // Maximum file size in MB
  //       maxWidthOrHeight: 800, // Maximum width or height in pixels
  //       useWebWorker: true,
  //     };

  //     try {
  //       const compressedFile = await imageCompression(uploadedFile, options);

  //       setFormData({
  //         ...formData,
  //         nextofkinIdentificationFile: compressedFile,
  //       });

  //       const reader = new FileReader();
  //       reader.onloadend = () => {};
  //       reader.readAsDataURL(compressedFile);
  //     } catch (error) {
  //       console.error("Error during image compression:", error);
  //     }
  //   } else {
  //   }
  // };

  // const [identificationType, setIdentificationType] = useState(null);
  // const handleSelectChange = (e) => {
  //   let type = e.target;
  //   setFormData({ ...formData, [e.target.name]: type.value });
  //   setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  // };

  // const save = async (e) => {
  //   e.preventDefault();
  //   if (!formData.idname) {
  //     toast.warn("select a valid identification type");
  //     return;
  //   }

  //   const newFormData = new FormData();

  //   newFormData.append("idname", formData.idname);
  //   newFormData.append("name", formData.name);
  //   newFormData.append("phone", formData.phone);
  //   newFormData.append("idnumber", formData.idnumber);
  //   newFormData.append("relationship", formData.relationship);
  //   newFormData.append(
  //     "nextofkinIdentificationFile",
  //     formData.nextofkinIdentificationFile
  //   );

  //   const data = patch(`guard/nextofkin/${guardId}`, newFormData, token)?.then(
  //     (data) => {
  //       if (data?.status) {
  //         refetchGuards();
  //         toast("Next of Kin Information Updated");
  //         //props.setGuard({})
  //       } else {
  //       }
  //     }
  //   );
  // };

  return (
    <>
      {/* edit-next-of-kin-app works! */}

      <form onSubmit={formik.handleSubmit}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Next of Kin
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12">
                <SelectField
                  defaultValue={props?.guard?.idname}
                  label="Identification Type"
                  optionList={identificationTypeOptions}
                  multipleSelect={false}
                  error={formik.errors.idname}
                  {...formik.getFieldProps("idname")}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Next of Kin Name"
                  type="text"
                  error={formik.errors.name}
                  {...formik.getFieldProps("name")}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Identification Number"
                  type="text"
                  error={formik.errors.idnumber}
                  {...formik.getFieldProps("idnumber")}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Phone Number"
                  name="phone"
                  type="text"
                  error={formik.errors.phone}
                  {...formik.getFieldProps("phone")}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Relationship"
                  type="text"
                  error={formik.errors.relationship}
                  {...formik.getFieldProps("relationship")}
                />
              </div>
              <div className="col-span-12 mb-3">
                <label htmlFor="fileUpload" className="semibold_label">
                  Upload Identification File
                </label>
                {props.guard?.nextofkinIdentificationFile && (
                  <a
                    target="_blank"
                    href={`${
                      ASSET_URL + props.guard?.nextofkinIdentificationFile
                    }`}
                  >
                    <div className="flex items-center mt-2 my-3">
                      <div>
                        <FaFileAlt className="mr-2" size={"3rem"} />
                      </div>
                      <div>
                        <span>
                          {props.guard?.idname || "Previously uploaded file"}
                        </span>{" "}
                        <br />
                        <span>
                          {props.guard?.idnumber || "Previously uploaded file"}
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
                  {formik.errors.nextofkinIdentificationFile && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">
                        {formik.errors.nextofkinIdentificationFile}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <RegularButton
              text="Update"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default EditNextOfKin;

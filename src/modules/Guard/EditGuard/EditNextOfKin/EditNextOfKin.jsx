import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import SelectField from "../../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";

import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectOrganization,
} from "../../../../redux/selectors/auth";
import { patch } from "../../../../lib/methods";
import imageCompression from "browser-image-compression";

import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../../redux/services/guards";
import { FaFileAlt } from "react-icons/fa";
import { ASSET_URL } from "../../../../constants/api";

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

const EditNextOfKin = (props) => {
  const { guardId } = useParams();
  const auth = useSelector(selectAuth);

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

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    idnumber: "",
    phone: "",
    nextofkinIdentificationFile: null,
    idname: "",
    relationship: "",
  });

  useEffect(() => {
    setFormData({
      name: props.guard?.name,
      idnumber: props.guard?.idnumber,
      idname: props.guard?.idname,
      phone: props.guard?.phone,
      relationship: props.guard?.relationship,
      nextofkinIdentificationFile: props.guard?.nextofkinIdentificationFile,
    });
  }, [props]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const options = {
        maxSizeMB: 0.5, // Maximum file size in MB
        maxWidthOrHeight: 800, // Maximum width or height in pixels
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(uploadedFile, options);
        console.log("Original file size:", uploadedFile.size);
        console.log("Compressed file size:", compressedFile.size);

        setFormData({
          ...formData,
          nextofkinIdentificationFile: compressedFile,
        });

        const reader = new FileReader();
        reader.onloadend = () => {};
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error during image compression:", error);
      }
    } else {
    }
  };

  const [identificationType, setIdentificationType] = useState(null);
  const handleSelectChange = (e) => {
    let type = e.target;
    setFormData({ ...formData, [e.target.name]: type.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!formData.idname) {
      toast.warn("select a valid identification type");
      return;
    }

    const newFormData = new FormData();

    newFormData.append("idname", formData.idname);
    newFormData.append("name", formData.name);
    newFormData.append("phone", formData.phone);
    newFormData.append("idnumber", formData.idnumber);
    newFormData.append("relationship", formData.relationship);
    newFormData.append(
      "nextofkinIdentificationFile",
      formData.nextofkinIdentificationFile
    );

    const data = patch(`guard/nextofkin/${guardId}`, newFormData, token).then(
      (data) => {
        if (data.status) {
          refetchGuards();
          toast("Next of Kin Information Updated");
          //props.setGuard({})
        }
      }
    );
  };

  return (
    <>
      {/* edit-next-of-kin-app works! */}

      <form onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Next of Kin
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12">
                <SelectField
                  value={identificationType}
                  defaultValue={props?.guard?.idname}
                  name="idname"
                  id="idname"
                  label="Next of Kin Identification Type"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={identificationTypeOptions}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Next of Kin Name"
                  semibold_label={true}
                  type="text"
                  id="name"
                  required="required"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={validationErrors["name"]}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Identification Number"
                  semibold_label={true}
                  type="text"
                  id="idnumber"
                  required="required"
                  name="idnumber"
                  value={formData.idnumber}
                  onChange={handleChange}
                  error={validationErrors["idnumber"]}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Phone Number"
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
              <div className="col-span-12">
                <TextInputField
                  label="Relationship"
                  semibold_label={true}
                  type="text"
                  id="relationship"
                  required="required"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  error={validationErrors["relationship"]}
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
                <FileInput
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf, image/*"
                  className=" placeholder-red-900"
                  helperText="Select Upload Identification File"
                />
              </div>
            </div>
            <RegularButton text="Update" />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default EditNextOfKin;

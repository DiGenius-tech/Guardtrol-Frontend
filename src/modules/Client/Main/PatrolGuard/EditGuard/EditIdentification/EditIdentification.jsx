import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import { useParams } from "react-router-dom";

import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import { patch } from "../../../../../../lib/methods";
import { FileInput } from "flowbite-react";
import { useGetGuardsQuery } from "../../../../../../redux/services/guards";
import { FaFileAlt } from "react-icons/fa";
import { ASSET_URL } from "../../../../../../constants/api";

const identificationTypeOptions = [
  {
    name: "National Identification Number (NIN)",
    value: "NIN",
  },
  {
    name: "Drivers License",
    value: "Drivers License",
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
const EditIdentification = (props) => {
  const { guardId } = useParams();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [updateloading, setLoading] = useState(false);
  const organization = useSelector(selectOrganization);

  const {
    data: guards,
    refetch: refetchGuards,
    isUninitialized,
  } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    idnumber: props.guard?.idnumber,
    idname: props.guard?.idname,
    guardIdentificationFile: null,
  });

  useEffect(() => {
    setFormData({
      idnumber: props.guard?.idnumber,
      idname: props.guard?.idname,
      guardIdentificationFile: props.guard?.identificationsFile,
    });
  }, [props]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [identificationType, setIdentificationType] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  const handleSelectChange = (e) => {
    let type = e.target;
    setFormData({ ...formData, [e.target.name]: type.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFormData({ ...formData, guardIdentificationFile: uploadedFile });
  };

  const save = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      console.log(formData);

      if (!formData.idname) {
        toast.warn("select a valid identification type");
        return;
      }

      const newFormData = new FormData();
      newFormData.append("idname", formData.idname);
      newFormData.append("idnumber", formData.idnumber);
      newFormData.append(
        "guardIdentificationFile",
        formData.guardIdentificationFile
      );

      const data = patch(
        `guard/identification/${guardId}`,

        newFormData,
        token
      ).then((data) => {
        if (data?.status) {
          toast("Identification Information Updated");
          //props.setGuard({})
          refetchGuards();
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* edit-identification-app works! */}

      <form onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Identification
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12">
                <SelectField
                  value={formData?.idname}
                  defaultValue={formData?.idname}
                  name="idname"
                  id="idname"
                  label="Identification Type"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={identificationTypeOptions}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Identification Number"
                  semibold_label={true}
                  type="text"
                  id="idnumber"
                  required="required"
                  name="idnumber"
                  value={formData?.idnumber || ""}
                  onChange={handleChange}
                  error={validationErrors["idnumber"]}
                />
              </div>
            </div>
            <div className="col-span-12  mb-3">
              <label htmlFor="fileUpload" className="semibold_label">
                Upload Identification File
              </label>
              {props.guard?.identificationsFile && (
                <a
                  target="_blank"
                  href={`${ASSET_URL + props.guard?.identificationsFile}`}
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
            <RegularButton
              disabled={updateloading}
              isLoading={updateloading}
              text="Update"
              rounded="full"
            />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default EditIdentification;

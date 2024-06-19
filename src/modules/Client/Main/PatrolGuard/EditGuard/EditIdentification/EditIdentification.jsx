import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import { useParams } from "react-router-dom";

import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import { patch } from "../../../../../../lib/methods";
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
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    idnumber: "",
    idname: "",
  });
  useEffect(() => {
    setFormData({
      idnumber: props.guard?.idnumber,
      idname: props.guard?.idname,
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

  const save = async (e) => {
    e.preventDefault();
    if (!formData.idname) {
      toast.warn("select a valid identification type");
      return;
    }

    const guardData = {
      idname: formData.idname,
      idnumber: formData.idnumber,
    };

    const data = patch(
      `guard/identification/${guardId}`,

      guardData,
      token
    ).then((data) => {
      if (data.status) {
        toast("Identification Information Updated");
        //props.setGuard({})
      }
    });
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
                  value={identificationType}
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
                  value={formData.idnumber}
                  onChange={handleChange}
                  error={validationErrors["idnumber"]}
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

export default EditIdentification;

import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import { useParams } from "react-router-dom";

import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../../../../redux/selectors/auth";
import { patch } from "../../../../../../lib/methods";

const identificationTypeOptions = [
  {
    name: "National Identification Number (NIN)",
    value: "NIN",
  },
  {
    name: "Drivers Liscense",
    value: "Drivers Liscense",
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

const EditNextOfKin = (props) => {
  const { guardId } = useParams();
  const auth = useSelector(selectAuth);
  const { user, token } = useSelector(selectAuth);

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    idnumber: "",
    phone: "",
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

    const data = patch(
      `guard/nextofkin/${guardId}`,

      formData,
      token
    ).then((data) => {
      if (data.status) {
        toast("Next Of Kin Information Updated");
        //props.setGuard({})
      }
    });
  };

  return (
    <>
      {/* edit-next-of-kin-app works! */}

      <form onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Next of kin
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12">
                <SelectField
                  value={identificationType}
                  name="idname"
                  id="idname"
                  label="Next Of Kin Identification Type"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={identificationTypeOptions}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Next of kin name"
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
                  label="Identification number"
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
            </div>
            <RegularButton text="Update" />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default EditNextOfKin;

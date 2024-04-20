import React, { useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
const identificationTypeOptions = [
  {
    name: "Type one",
    value: "typeOne"
  },
  {
    name: "Type two",
    value: "typeTwo"
  }
];
const EditIdentification = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    nin: "",
    lastName: "",
    height: "",
    dob: "",
    sex: "",
    altPhone: ""
  });

  const [identificationType, setIdentificationType] = useState(
    identificationTypeOptions[0]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  const handleSelectChange = (e) => {
    let type = JSON.parse(e.target.value);
    setFormData({ ...formData, [e.target.name]: type.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };
  return (
    <>
      {/* edit-identification-app works! */}

      <form action="">
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-16 text-center">
              Identification
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="NIN"
                  semibold_label={true}
                  type="text"
                  id="nin"
                  required="required"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  error={validationErrors["nin"]}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
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
              <div className="col-span-12">
                <SelectField
                  value={identificationType}
                  name="IdentificationType"
                  id="identificationType"
                  label="Identification type"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={identificationTypeOptions}
                  multipleSelect={false}
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

import React, { useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";

const sexOptions = [
  {
    name: "Male",
    value: "male"
  },
  {
    name: "Female",
    value: "female"
  }
];
const EditPersonalInformation = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    height: "",
    dob: "",
    sex: "",
    altPhone: ""
  });
  const [stateOfOriginList, setStateOfOriginList] = useState([
    {
      name: "Lagos",
      value: "lagos"
    },
    {
      name: "Ogun",
      value: "ogun"
    }
  ]);

  const [sex, setSex] = useState(sexOptions[0]);
  const [state, setState] = useState(sexOptions[0]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  const handleSelectChange = (e) => {
    let sex = JSON.parse(e.target.value);
    setFormData({ ...formData, [e.target.name]: sex.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  return (
    <>
      {/* edit-personal-information-app works! */}

      <form action="">
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-16 text-center">
              Personal info
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="First name"
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
                  label="Last name"
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
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Date of birth"
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
                <TextInputField
                  label="Height"
                  semibold_label={true}
                  type="number"
                  id="height"
                  required="required"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  error={validationErrors["height"]}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <SelectField
                  value={sex}
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
                <SelectField
                  value={state}
                  name="state of origin"
                  id="stateOfOrigin"
                  label="State of origin"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={stateOfOriginList}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Alternate phone"
                  semibold_label={true}
                  type="tel"
                  id="altPhone"
                  required="required"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleChange}
                  error={validationErrors["altPhone"]}
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

export default EditPersonalInformation;

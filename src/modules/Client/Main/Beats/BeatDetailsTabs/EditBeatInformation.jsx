import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import SelectField from "../../../../Sandbox/SelectField/SelectField";
import AddGuard from "../../../../Onboarding/pages/OnboardGuard/AddGuard/AddGuard";

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
const EditBeatInformation = ({ setPage }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    beatName: "",
    beatAddress: "",
    height: "",
    dob: "",
    sex: "",
    altPhone: "",
  });
  const [stateOfOriginList, setStateOfOriginList] = useState([
    {
      name: "Lagos",
      value: "lagos",
    },
    {
      name: "Ogun",
      value: "ogun",
    },
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
      <div className="flex justify-between flex-row my-2">
        <h5 className="text-md font-bold text-primary-500 dark:text-white">
          Edit Beat
        </h5>

        <span
          onClick={() => setPage("ViewBeatInformation")}
          className="text-primary-500 font-semibold text-sm cursor-pointer"
        >
          {"<"} Back
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 ">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-lg font-bold text-primary-500 dark:text-white">
                Basic Info
              </h4>
            </div>
            <hr />
            <form action="" className="col-span-12">
              <fieldset>
                <div className="grid grid-cols-12 gap-x-4 mt-2">
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat name"
                      semibold_label={true}
                      type="text"
                      id="beatName"
                      required="required"
                      name="beatName"
                      value={formData.beatName}
                      onChange={handleChange}
                      error={validationErrors["beatName"]}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat Address"
                      semibold_label={true}
                      type="text"
                      id="beatAddress"
                      required="required"
                      name="beatAddress"
                      value={formData.beatAddress}
                      onChange={handleChange}
                      error={validationErrors["beatAddress"]}
                    />
                  </div>
                </div>
                <RegularButton width="w-50" text="Save" />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBeatInformation;

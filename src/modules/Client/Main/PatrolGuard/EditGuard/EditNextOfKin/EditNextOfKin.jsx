import React, { useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";

const EditNextOfKin = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    nextOfKinName: "",
    nextOfKinPhone: "",
    relationship: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  return (
    <>
      {/* edit-next-of-kin-app works! */}

      <form action="">
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-16 text-center">
              Next of kin
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Next of kin name"
                  semibold_label={true}
                  type="text"
                  id="nextOfKinName"
                  required="required"
                  name="nextOfKinName"
                  value={formData.nextOfKinName}
                  onChange={handleChange}
                  error={validationErrors["nextOfKinName"]}
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

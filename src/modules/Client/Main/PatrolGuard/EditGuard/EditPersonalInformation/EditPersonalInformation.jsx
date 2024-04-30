import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../../../../redux/selectors/auth";

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
const stateOfOriginList = [
  { name: "Abia", value: "abia" },
  { name: "Adamawa", value: "adamawa" },
  { name: "Akwa Ibom", value: "akwa_ibom" },
  { name: "Anambra", value: "anambra" },
  { name: "Bauchi", value: "bauchi" },
  { name: "Bayelsa", value: "bayelsa" },
  { name: "Benue", value: "benue" },
  { name: "Borno", value: "borno" },
  { name: "Cross River", value: "cross_river" },
  { name: "Delta", value: "delta" },
  { name: "Ebonyi", value: "ebonyi" },
  { name: "Edo", value: "edo" },
  { name: "Ekiti", value: "ekiti" },
  { name: "Enugu", value: "enugu" },
  { name: "Gombe", value: "gombe" },
  { name: "Imo", value: "imo" },
  { name: "Jigawa", value: "jigawa" },
  { name: "Kaduna", value: "kaduna" },
  { name: "Kano", value: "kano" },
  { name: "Katsina", value: "katsina" },
  { name: "Kebbi", value: "kebbi" },
  { name: "Kogi", value: "kogi" },
  { name: "Kwara", value: "kwara" },
  { name: "Lagos", value: "lagos" },
  { name: "Nasarawa", value: "nasarawa" },
  { name: "Niger", value: "niger" },
  { name: "Ogun", value: "ogun" },
  { name: "Ondo", value: "ondo" },
  { name: "Osun", value: "osun" },
  { name: "Oyo", value: "oyo" },
  { name: "Plateau", value: "plateau" },
  { name: "Rivers", value: "rivers" },
  { name: "Sokoto", value: "sokoto" },
  { name: "Taraba", value: "taraba" },
  { name: "Yobe", value: "yobe" },
  { name: "Zamfara", value: "zamfara" },
  { name: "FCT", value: "fct" }, // Federal Capital Territory
];
const EditPersonalInformation = (props) => {
  const { guardId } = useParams();

  const { user, token } = useSelector(selectAuth);

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstname: props.guard?.firstname,
    lastname: props.guard?.lastname,
    height: props.guard?.height,
    dob: props.guard?.dob,
    sex: props.guard?.sex,
    altphone: props.guard?.altphone,
    state: props.guard?.state,
  });

  useEffect(() => {
    setFormData({
      firstname: props.guard?.firstname,
      lastname: props.guard?.lastname,
      height: props.guard?.height,
      dob: props.guard?.dob,
      sex: props.guard?.sex,
      altphone: props.guard?.altphone,
      state: props.guard?.state,
    });
  }, [props]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [sex, setSex] = useState(props.guard?.sex);
  const [state, setState] = useState(props.guard?.state);

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

  const save = async (e) => {
    e.preventDefault();
    if (!formData.sex) {
      toast.warn("select a valid gender");
      return;
    }
    if (!formData.state) {
      toast.warn("select a valid state");
      return;
    }
    const guardData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      height: formData.height,
      dob: formData.dob,
      sex: formData.sex,
      altphone: formData.altphone,
      state: formData.state,
    };

    const data = sendRequest(
      `guard/personalinformation/${guardId}`,
      "PATCH",
      JSON.stringify(guardData),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    ).then((data) => {
      if (data.status) {
        toast("Personal Information Updated");
        props.setGuard({});
        props.handleSentRequest();
      }
    });
  };

  return (
    <>
      {/* edit-personal-information-app works! */}

      <form action="" onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Personal info
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="First Name"
                  semibold_label={true}
                  type="text"
                  id="firstname"
                  required="required"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  error={validationErrors["firstname"]}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Last Name"
                  semibold_label={true}
                  type="text"
                  id="lastname"
                  required="required"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  error={validationErrors["lastname"]}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Date Of Birth"
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
                  type="text"
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
                  name="state"
                  id="state"
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
                  id="altphone"
                  required="required"
                  name="altphone"
                  value={formData.altphone}
                  onChange={handleChange}
                  error={validationErrors["altphone"]}
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

import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectOrganization,
} from "../../../../../../redux/selectors/auth";
import { patch } from "../../../../../../lib/methods";
import { useGetGuardsQuery } from "../../../../../../redux/services/guards";

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
  const organization = useSelector(selectOrganization);
  const { data: guards, refetch } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  const { user, token } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: props.guard?.name || "",
    height: props.guard?.personalinformation?.height || "",
    dob: props.guard?.personalinformation?.dob || "",
    sex: props.guard?.personalinformation?.sex || "",
    altphone: props.guard?.personalinformation?.altphone || "",
    state: props.guard?.personalinformation?.state || "",
  });

  useEffect(() => {
    setFormData({
      name: props.guard?.name,
      height: props.guard?.personalinformation?.height,
      dob: props.guard?.personalinformation?.dob,
      sex: props.guard?.personalinformation?.sex,
      altphone: props.guard?.personalinformation?.altphone,
      state: props.guard?.personalinformation?.state,
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

  const handleSelectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const save = async (e) => {
    try {
      setLoading(true);
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
        name: formData.name,
        personalinformation: {
          height: formData?.height,
          dob: formData.dob,
          sex: formData.sex,
          altphone: formData.altphone,
          state: formData.state,
        },
      };

      const data = patch(
        `guard/personalinformation/${guardId}`,
        guardData,
        token
      ).then((data) => {
        if (data.status) {
          refetch();
          toast("Personal Information Updated");
          // props.setGuard({});
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
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
                  label="Name"
                  semibold_label={true}
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  required="required"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={validationErrors["name"]}
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
                  placeholder="Enter height"
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
                  name="sex"
                  id="sex"
                  defaultValue={props.guard?.personalinformation?.sex || ""}
                  value={formData?.sex || ""}
                  label="Sex"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={sexOptions}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <SelectField
                  value={formData?.state || ""}
                  name="state"
                  id="state"
                  defaultValue={props.guard?.personalinformation?.state || ""}
                  label="State of origin"
                  semibold_label={true}
                  handleChangeOption={handleSelectChange}
                  optionList={stateOfOriginList}
                  multipleSelect={false}
                />
              </div>
              <div className="col-span-6">
                <TextInputField
                  label="Alternate phone"
                  semibold_label={true}
                  type="tel"
                  placeholder="Enter alternate phone"
                  id="altphone"
                  name="altphone"
                  value={formData.altphone}
                  onChange={handleChange}
                  error={validationErrors["altphone"]}
                />
              </div>
            </div>
            <RegularButton
              disabled={loading}
              isLoading={loading}
              text="Update"
            />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default EditPersonalInformation;

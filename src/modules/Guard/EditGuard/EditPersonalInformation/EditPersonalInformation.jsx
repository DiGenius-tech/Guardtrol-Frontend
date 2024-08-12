import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import SelectField from "../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectOrganization,
} from "../../../../redux/selectors/auth";
import { patch } from "../../../../lib/methods";
import { useGetGuardsQuery } from "../../../../redux/services/guards";
import { POOLING_TIME } from "../../../../constants/static";

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
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  height: Yup.number()
    .required("Height is required")
    .min(1, "Height must be greater than 0"),
  sex: Yup.string().required("Sex is required"),
  state: Yup.string().required("State of Origin is required"),
  altphone: Yup.string().matches(
    /^[0-9]{10,14}$/,
    "Alternate Phone must be a valid phone number"
  ),
});

const EditPersonalInformation = (props) => {
  console.log(props.guard?.personalinformation);
  const { guardId } = useParams();
  const organization = useSelector(selectOrganization);
  const { data: guards, refetch } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
    pollingInterval: POOLING_TIME,
  });
  const { token } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: props.guard?.name || "",
      height: props.guard?.personalinformation?.height || "",
      dob: props.guard?.personalinformation?.dob || "",
      sex: props.guard?.personalinformation?.sex || "",
      altphone: props.guard?.personalinformation?.altphone || "",
      state: props.guard?.personalinformation?.state || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const guardData = {
          name: values.name,
          personalinformation: {
            height: values.height,
            dob: values.dob,
            sex: values.sex,
            altphone: values.altphone,
            state: values.state,
          },
        };

        const data = await patch(
          `guard/personalinformation/${guardId}`,
          guardData,
          token
        );

        if (data.status) {
          refetch();
          toast("Personal Information Updated");
        }
      } catch (error) {
        toast.error("Error updating personal information");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: props.guard?.name,
      height: props.guard?.personalinformation?.height,
      dob: props.guard?.personalinformation?.dob,
      sex: props.guard?.personalinformation?.sex,
      altphone: props.guard?.personalinformation?.altphone,
      state: props.guard?.personalinformation?.state,
    });
  }, [props.guard]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Personal Info
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
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && formik.errors.name}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Date of Birth"
                  semibold_label={true}
                  type="date"
                  id="dob"
                  required="required"
                  name="dob"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  error={formik.touched.dob && formik.errors.dob}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Height"
                  semibold_label={true}
                  type="number"
                  placeholder="Enter height"
                  id="height"
                  required="required"
                  name="height"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  error={formik.touched.height && formik.errors.height}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <SelectField
                  name="sex"
                  id="sex"
                  value={formik.values.sex}
                  defaultValue={formik.values.sex}
                  label="Sex"
                  semibold_label={true}
                  handleChangeOption={formik.handleChange}
                  optionList={sexOptions}
                  multipleSelect={false}
                  error={formik.touched.sex && formik.errors.sex}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <SelectField
                  name="state"
                  id="state"
                  defaultValue={formik.values.state}
                  value={formik.values.state}
                  label="State of Origin"
                  semibold_label={true}
                  handleChangeOption={formik.handleChange}
                  optionList={stateOfOriginList}
                  multipleSelect={false}
                  error={formik.touched.state && formik.errors.state}
                />
              </div>
              <div className="col-span-6">
                <TextInputField
                  label="Alternate Phone"
                  semibold_label={true}
                  type="number"
                  placeholder="Enter alternate phone"
                  id="altphone"
                  name="altphone"
                  value={formik.values.altphone}
                  onChange={formik.handleChange}
                  error={formik.touched.altphone && formik.errors.altphone}
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

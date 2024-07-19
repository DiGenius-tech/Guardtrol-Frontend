import React, { useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { FormatAlignCenter } from "@mui/icons-material";
import {
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../redux/services/beats";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { post, put } from "../../../lib/methods";
import { updateUser } from "../../../redux/slice/authSlice";
import { useParams } from "react-router-dom";
import { ToggleSwitch } from "flowbite-react";

const BeatInformationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
});

const EditBeatInformation = ({ setPage }) => {
  const { beatId } = useParams();
  const [updateBeat] = useUpdateBeatMutation();
  const organization = useSelector(selectOrganization);

  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const selectedBeat = beatsApiResponse?.beats?.find((b) => b._id === beatId);

  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      _id: selectedBeat._id,
      address: selectedBeat.address,
      name: selectedBeat.name,
      description: selectedBeat.description,
      isactive: selectedBeat.isactive,
    },

    validationSchema: BeatInformationSchema,
    onSubmit: (values) => {
      console.log(values);

      setLoading(true);
      try {
        handleUpdateBeat(values);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleUpdateBeat = async (data) => {
    dispatch(suspenseShow());
    await updateBeat({ body: data, userid: user?.userid, organization }).then(
      toast("Beat Updated")
    );
    await refetchBeats();
    dispatch(suspenseHide());
  };

  return (
    <>
      <div className="flex justify-between flex-row mb-3">
        <h5 className="text-md   font-medium text-primary-500 dark:text-white">
          Edit Beat
        </h5>

        <span
          onClick={() => setPage("ViewBeatInformation")}
          className="text-primary-500 text-md   font-medium cursor-pointer"
        >
          Back
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 ">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-md font-medium text-primary-500 dark:text-white">
                Basic Info
              </h4>
            </div>
            <hr />
            <form onSubmit={formik.handleSubmit}>
              <fieldset>
                <div className="grid grid-cols-12 gap-x-4 mt-2">
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat name"
                      semibold_label={true}
                      type="text"
                      {...formik.getFieldProps("name")}
                    />
                    <div className="mb-3">
                      {formik.touched.name && formik.errors.name && (
                        <div className="">
                          <div className=" text-red-500">
                            {formik.errors.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat Address"
                      semibold_label={true}
                      type="text"
                      {...formik.getFieldProps("address")}
                    />

                    <div className="mb-3">
                      {formik.touched.address && formik.errors.address && (
                        <div className="">
                          <div className=" text-red-500">
                            {formik.errors.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat Description"
                      semibold_label={true}
                      type="text"
                      {...formik.getFieldProps("description")}
                    />
                    <div className="mb-3">
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div className="">
                            <div className=" text-red-500">
                              {formik.errors.description}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  {/* <div className="col-span-12 sm:col-span-6">
                    <label className="inline-flex items-center cursor-pointer mt-12">
                      <input
                        type="checkbox"
                        name="verification"
                        className="sr-only peer"
                        onChange={() => {
                          formik.values.isactive = !formik.values.isactive;
                          console.log(formik.values?.isactive);
                        }}
                        value={formik.values?.isactive}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      <span className="ms-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
                        {formik.values?.isactive
                          ? "Beat is active, Deactivate?"
                          : "Beat is'nt active, Activate?"}
                      </span>
                    </label>
                  </div> */}
                </div>
                <RegularButton type={"submit"} width="w-50" text="Save" />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBeatInformation;

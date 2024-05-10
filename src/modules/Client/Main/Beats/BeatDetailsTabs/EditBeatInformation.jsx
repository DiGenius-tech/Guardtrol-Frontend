import React, { useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { FormatAlignCenter } from "@mui/icons-material";
import {
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../../../redux/services/beats";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import { selectUser } from "../../../../../redux/selectors/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { post, put } from "../../../../../lib/methods";
import { updateUser } from "../../../../../redux/slice/authSlice";
import { useParams } from "react-router-dom";

const BeatInformationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  description: Yup.string().required("Description is required"),
});

const EditBeatInformation = ({ setPage }) => {
  const { beatId } = useParams();
  const [updateBeat] = useUpdateBeatMutation();

  const { data: beats, refetch: refetchBeats } = useGetBeatsQuery();

  const selectedBeat = beats?.find((b) => b._id === beatId);

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
    },
    validationSchema: BeatInformationSchema,
    onSubmit: (values) => {
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
    await updateBeat({ body: data, userid: user?.userid }).then(
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

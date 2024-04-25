import React, { useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { FormatAlignCenter } from "@mui/icons-material";
import {
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../../../redux/services/beats";
import { useDispatch, useSelector } from "react-redux";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import { selectUser } from "../../../../../redux/selectors/auth";

const EditBeatInformation = ({ setPage, beat }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    id: beat?._id || "",
    beat_name: beat?.name || "",
    address: beat?.address || "",
    description: beat?.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const [updateBeat] = useUpdateBeatMutation();

  const { refetch: refetchBeats } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
  });

  const handleUpdateBeat = () => {
    dispatch(suspenseShow());
    updateBeat({ body: formData, userid: user?.userid });
    refetchBeats();
    dispatch(suspenseHide());
  };
  return (
    <>
      <div className="flex justify-between flex-row my-5">
        <h5 className="text-lg font-bold text-primary-500 dark:text-white">
          Edit Beat
        </h5>

        <span
          onClick={() => setPage("ViewBeatInformation")}
          className="text-primary-500 font-semibold text-md cursor-pointer"
        >
          Back
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
            <form className="col-span-12">
              <fieldset>
                <div className="grid grid-cols-12 gap-x-4 mt-2">
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat name"
                      semibold_label={true}
                      type="text"
                      id="beatName"
                      required="required"
                      name="beat_name"
                      value={formData.beat_name}
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
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={validationErrors["beatAddress"]}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <TextInputField
                      label="Beat Description"
                      semibold_label={true}
                      type="text"
                      id="beatDescription"
                      required="required"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      error={validationErrors["beatDescription"]}
                    />
                  </div>
                </div>
                <RegularButton
                  type={"button"}
                  onClick={() => handleUpdateBeat()}
                  width="w-50"
                  text="Save"
                />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBeatInformation;

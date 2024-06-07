import React, { useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import { put } from "../../../../../../lib/methods";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import {
  useCreateShiftsMutation,
  useGetShiftsQuery,
} from "../../../../../../redux/services/shifts";

const ShiftInformationSchema = Yup.object().shape({
  name: Yup.string().required("Shift title is required"),
  start: Yup.string().required("Shift start time is required"),
  end: Yup.string().required("Shift end time is required"),
});

const ShiftConfigForm = (props) => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const dispatch = useDispatch();
  const { data: shifts } = useGetShiftsQuery();
  const [shiftToEdit, setShiftToEdit] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedRange, setSelectedRange] = useState("");

  const [createShift] = useCreateShiftsMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      start: 0,
      end: 0,
    },
    validationSchema: ShiftInformationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      try {
        console.log(shifts);
        if (shifts?.find((s) => s.name === values.name)) {
          setValidationErrors({
            ...validationErrors,
            name: "Shift already exists with this name",
          });
          return;
        }
        createShift(values);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        formik.resetForm();
      }
    },
  });
  console.log(formik.errors);

  const handleUpdateProfile = async (values) => {
    dispatch(suspenseShow());
    const data = await put(
      "settings/personal-information",
      values,
      token,
      true,
      "Profile information updated"
    );
    if (data) {
      //   dispatch(updateUser(data));
    }
    dispatch(suspenseHide());
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    formik.values.start = e.target.value;
    handleSelectRange();
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    formik.values.end = e.target.value;
    handleSelectRange();
  };

  const handleSelectRange = () => {
    if (startTime && endTime) {
      setSelectedRange(`Selected Range: ${startTime} - ${endTime}`);
    } else {
      setSelectedRange("Please select a start and end time.");
    }
  };
  return (
    <>
      {/* shift-config-form-app works! */}

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <TextInputField
              label="Name of shift"
              {...formik.getFieldProps("name")}
              type="text"
              error={validationErrors["name"]}
              placeholder="Enter Shift Name"
              id="name"
              semibold_label={true}
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <fieldset>
              <legend className="block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold">
                Shift starts
              </legend>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    className="border-gray-300 rounded-md"
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <fieldset>
              <legend className="block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold">
                Shift ends
              </legend>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    className=" border-gray-300 rounded-md"
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div className="col-span-12">
            <div>{selectedRange}</div>
          </div>
          <div>
            {formik.touched.startHour && formik.errors.startHour && (
              <div className="">
                <div className="  text-red-500">{formik.errors.startHour}</div>
              </div>
            )}
            {formik.touched.startMinutes && formik.errors.startMinutes && (
              <div className="">
                <div className="  text-red-500">
                  {formik.errors.startMinutes}
                </div>
              </div>
            )}
            {formik.touched.endHour && formik.errors.endHour && (
              <div className="">
                <div className="  text-red-500">{formik.errors.endHour}</div>
              </div>
            )}
            {formik.touched.endMinutes && formik.errors.endMinutes && (
              <div className="">
                <div className="  text-red-500">{formik.errors.endMinutes}</div>
              </div>
            )}
          </div>
          <div className="col-span-12">
            <div className="sm:flex items-center justify-between flex-wrap">
              <RegularButton
                isProcessing={isloading}
                disable={isloading}
                type={"submit"}
                text="Create"
                width="auto"
                padding="px-4 py-2"
                textSize="text-sm"
              />
              <span className="flex flex-nowrap text-sm text-dark-200">
                <span>1</span>/<span>5</span>&nbsp;Shifts
              </span>
            </div>
          </div>
        </div>
      </form>
      <hr className="mt-5" />
    </>
  );
};

export default ShiftConfigForm;

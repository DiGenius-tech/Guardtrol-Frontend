import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import * as Yup from "yup";
import { useFormik } from "formik";

import { useUpdateShiftMutation } from "../../../redux/services/shifts";
import { useSelector } from "react-redux";
import { selectToken } from "../../../redux/selectors/auth";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ShiftInformationSchema = Yup.object().shape({
  name: Yup.string().required("Shift title is required"),
  start: Yup.string().required("Shift Start time is required"),
  end: Yup.string().required("Shift End time is required"),
});

const EditShiftModal = ({ openModal, closeEditShiftModal, shiftToEdit }) => {
  const [updateShift] = useUpdateShiftMutation();
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector(selectToken);

  const [startTime, setStartTime] = useState(shiftToEdit?.start);
  const [endTime, setEndTime] = useState(shiftToEdit?.end);
  const [selectedRange, setSelectedRange] = useState("");

  const formik = useFormik({
    initialValues: {
      name: shiftToEdit.name,
      start: shiftToEdit.start,
      end: shiftToEdit.end,
    },
    validationSchema: ShiftInformationSchema,

    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const { data } = await updateShift({
          ...values,
          _id: shiftToEdit?._id,
        });

        closeEditShiftModal();
        if (data.status) {
          Swal.fire({
            title: "Updated!",
            text: `${shiftToEdit?.name || "Shift"} has been updated.`,
            icon: "success",
            confirmButtonColor: "#008080",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.values.start = shiftToEdit.start;
    formik.values.end = shiftToEdit.end;
  }, []);

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
    <Modal dismissible show={openModal} onClose={() => closeEditShiftModal()}>
      <Modal.Header>Edit Shift</Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TextInputField
                label="Name of shift"
                {...formik.getFieldProps("name")}
                type="text"
                semibold_label={true}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="">
                  <div className="  text-red-500">{formik.errors.name}</div>
                </div>
              )}
            </div>
            <div className="col-span-6 grid grid-cols-2 gap-2">
              <div className="">
                <fieldset>
                  <legend className="block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold">
                    Shift Starts
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
              <div className="">
                <fieldset>
                  <legend className="block mb-2 text-gray-900 dark:text-white cursor-pointer font-semibold">
                    Shift Ends
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
            </div>
            <div className="col-span-12">
              <div>{selectedRange}</div>
            </div>
            <div>
              {formik.touched.start && formik.errors.start && (
                <div className="">
                  <div className="  text-red-500">{formik.errors.start}</div>
                </div>
              )}
              {formik.touched.end && formik.errors.end && (
                <div className="">
                  <div className="  text-red-500">{formik.errors.end}</div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          isProcessing={isLoading}
          disabled={isLoading}
          style={{ backgroundColor: "#008080" }}
          type="submit"
          onClick={() => formik.handleSubmit()}
        >
          Update
        </Button>
        <Button color="gray" onClick={() => closeEditShiftModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditShiftModal;

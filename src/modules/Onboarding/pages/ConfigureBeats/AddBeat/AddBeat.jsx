import { useState } from "react";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import TextareaField from "../../../../Sandbox/TextareaField/TextareaField";
import HistoryButton from "../../../../Sandbox/Buttons/HistoryButton";

function AddBeat() {
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    beat_name: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };
  return (
    <>
      {/* add-beat-app works! */}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form>
          <div className="mb-6">
            <TextInputField
              label="Beat Name"
              name="beat_name"
              type="text"
              placeholder="Beat Name"
              id="beat_name"
              error={validationErrors["beat_name"]}
              onChange={handleChange}
              required="required"
              value={formData.phone}
              semibold_label={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <TextareaField
                label="Description"
                id="beat_description"
                placeholder="Leave a description..."
                semibold_label={true}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <RegularButton
                text="Add Beat"
                rounded="full"
                width="auto"
                padding="px-8 py-2.5"
                textSize="sm"
              />
              <HistoryButton type="button" text="Cancel" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddBeat;

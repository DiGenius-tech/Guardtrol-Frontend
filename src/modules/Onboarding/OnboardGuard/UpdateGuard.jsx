import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectOnboardingGuards } from "../../../redux/selectors/onboarding";
import { setOnboardingGuards } from "../../../redux/slice/onboardingSlice";

function UpdateGuard(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const onboardingGuards = useSelector(selectOnboardingGuards);
  const [preGuard, setPreGuard] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  useEffect(() => {
    setFormData({
      full_name: props.selectedGuard.full_name,
      phone: props.selectedGuard.phone,
    });
    setPreGuard(props.selectedGuard.full_name);
  }, [props]);

  const save = async (e) => {
    e.preventDefault();

    if (formData.full_name === "" || formData.full_name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        full_name: "Use A Valid Guard Name",
      });
      return;
    }
    if (formData.phone === "" || formData.phone.length < 8) {
      setValidationErrors({
        ...validationErrors,
        phone: "Enter A Valid Phone Number",
      });
      return;
    }

    const index = onboardingGuards.findIndex(
      (guard) => guard.full_name === preGuard
    );

    if (index !== -1) {
      // Create a new array with the updated guard object
      const updatedGuards = [...onboardingGuards];
      updatedGuards[index] = {
        ...updatedGuards[index],
        full_name: formData.full_name,
        phone: formData.phone,
      };

      // Dispatch an action to update the state
      dispatch(setOnboardingGuards(updatedGuards));
      toast("Guard Updated");
      props.cancelEdit();
    } else {
      toast.error("Guard not found");
    }
  };
  return (
    <>
      {/* update-guard-app works! */}

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={save}>
          {/*  */}

          {/*  */}
          <div className="mb-6">
            <TextInputField
              label="Full Name"
              type="text"
              id="full_name"
              name="full_name"
              required="required"
              error={validationErrors["full_name"]}
              value={formData.full_name}
              onChange={handleChange}
            />
            <TextInputField
              label="Phone Number"
              name="phone"
              type="number"
              placeholder="Phone Number"
              id="phone"
              error={validationErrors["phone"]}
              onChange={handleChange}
              required="required"
              value={formData.phone}
            />
          </div>

          <div className="">
            <div className="flex items-center justify-between">
            <button type="button" onClick={props.cancelEdit}>
                Cancel
              </button>
              <RegularButton
                text="Update"
                rounded="full"
                width="auto"
                padding="px-8 py-2.5"
                textSize="sm"
              />

            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateGuard;

import { Modal, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import TextareaField from "../../../Sandbox/TextareaField/TextareaField";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";
import { SubscriptionContext } from "../../../../shared/Context/SubscriptionContext";

import { toast } from "react-toastify";
import { useGetSubscriptionQuery } from "../../../../redux/services/subscriptions";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../redux/selectors/auth";

function EditBeat({ beatToEdit, openModal, handleUpdateBeat, setOpenModal }) {
  const [validationErrors, setValidationErrors] = useState({});
  const token = useSelector(selectToken);

  const {
    data: sub,
    isError,
    refetch,
    isUninitialized,
  } = useGetSubscriptionQuery(null, { skip: token ? false : true });

  const [open, setOpen] = useState(false);

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [beat, setBeat] = useState({
    id: "",
    beat_name: "",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    setBeat({ ...beat, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const saveBeat = async (e) => {
    e.preventDefault();
    if (beat.beat_name === "" || beat.beat_name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        beat_name: "Use A Valid Beat Name",
      });

      return;
    }

    handleUpdateBeat(beat);
  };

  useEffect(() => {
    // console.log("useEffect: ", beatToEdit)
    if (beatToEdit) {
      setBeat({
        id: beatToEdit?._id,
        beat_name: beatToEdit?.name,
        address: beatToEdit?.address,
        description: beatToEdit?.description,
      });
    }
    return () => {};
  }, [beatToEdit]);
  return (
    <>
      {/* edit-beat-app works! */}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Edit beat</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* {beatToEdit?.title} */}

            <form method="post" onSubmit={saveBeat}>
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
                  value={beat.beat_name}
                  semibold_label={true}
                />
              </div>
              <div className="mb-6">
                <TextInputField
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="Beat Address"
                  id="address"
                  error={validationErrors["address"]}
                  onChange={handleChange}
                  required="required"
                  value={beat.address}
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
                    value={beat.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-between">
                  <RegularButton
                    text="Update Beat"
                    rounded="full"
                    width="auto"
                    padding="px-8 py-2.5"
                    textSize="sm"
                  />
                  <button type="button" onClick={() => setOpenModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditBeat;

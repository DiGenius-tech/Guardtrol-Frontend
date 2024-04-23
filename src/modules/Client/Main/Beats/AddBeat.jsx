import React, { useContext, useEffect, useState } from "react";
import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";
import { useNavigate } from "react-router-dom";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import HistoryButton from "../../../Sandbox/Buttons/HistoryButton";
import AlertDialog from "../../../../shared/Dialog/AlertDialog";
import { toast } from "react-toastify";
import { SubscriptionContext } from "../../../../shared/Context/SubscriptionContext";
import TextareaField from "../../../Sandbox/TextareaField/TextareaField";
import { AuthContext } from "../../../../shared/Context/AuthContext";

const AddBeat = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const sub = useContext(SubscriptionContext);
  const [open, setOpen] = useState(false);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [existingBeats, setExistingBeats] = useState([]);
  const [beat, setBeat] = useState({
    beat_name: "",
    address: "",
    description: "my location",
  });

  const getExistingBeats = async () => {
    const data = await sendRequest(
      `http://localhost:5000/api/beat/getbeats/${auth.user.userid}`,
      "GET",
      null,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      }
    );
    if (data) {
      const beats = data.beats;
      setExistingBeats(beats);
    }
  };
  useEffect(() => {
    getExistingBeats();
  }, [auth.token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
    } else {
      if (existingBeats.length === sub.currentSubscription?.maxbeats) {
        setOpen(true);
        return;
      }
      auth.loading(true);
      const data = await sendRequest(
        `http://localhost:5000/api/beat/addbeat/${auth.user.userid}`,
        "POST",
        JSON.stringify(beat),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      if (data && data.status) {
        toast("Beat Created Successfully");
        navigate("../");
        window.location.reload();
      }
    }
  };
  return (
    <>
      {/* add-beat-app works! */}

      <div className="max-w-lg block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
      <AlertDialog
        open={open}
        title="OOPS!! You've Ran Out Of Beats"
        description="Would You Like To Subscribe For Another Beat ?"
        setOpen={setOpen}
        actionText="Subscribe"
        action={() => {}}
      />
    </>
  );
};

export default AddBeat;

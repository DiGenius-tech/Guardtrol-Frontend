import { useContext, useState } from "react";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import TextareaField from "../../../../Sandbox/TextareaField/TextareaField";
import HistoryButton from "../../../../Sandbox/Buttons/HistoryButton";
import { useNavigate } from "react-router";
import { SubscriptionContext } from "../../../../../shared/Context/SubscriptionContext";
import AlertDialog from "../../../../../shared/Dialog/AlertDialog";
import {
  useAddBeatMutation,
  useGetBeatsQuery,
} from "../../../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../redux/selectors/auth";

function AddBeat() {
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const sub = useContext(SubscriptionContext);
  const [open, setOpen] = useState(false);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [beat, setBeat] = useState({
    beat_name: "",
    description: "my location",
  });

  const handleChange = (e) => {
    setBeat({ ...beat, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };
  const [addBeat] = useAddBeatMutation();
  const { date: beats, refetch: refetchBeats } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
  });

  const saveBeat = async (e) => {
    e.preventDefault();
    console.log(beats);
    if (beat.beat_name === "" || beat.beat_name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        beat_name: "Use A Valid Beat Name",
      });
    } else {
      console.log(beats);

      if (
        beats?.length &&
        sub.currentSubscription?.maxbeats &&
        beats?.length === sub.currentSubscription?.maxbeats
      ) {
        setOpen(true);
        return;
      }
      await addBeat({ body: beat, userid: user.userid });
      refetchBeats().then(navigate("../"));
    }
  };
  return (
    <>
      {/* add-beat-app works! */}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
}

export default AddBeat;

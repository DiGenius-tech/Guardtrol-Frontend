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
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../../redux/selectors/auth";
import { selectSubscriptionState } from "../../../../../redux/selectors/subscription";
import { useGetSubscriptionQuery } from "../../../../../redux/services/subscriptions";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import Swal from "sweetalert2";

function AddBeat() {
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const {
    data: sub,
    isError,

    refetch,
  } = useGetSubscriptionQuery();

  const [open, setOpen] = useState(false);

  const [beat, setBeat] = useState({
    name: "",
    address: "",
    description: "my location",
  });

  const handleChange = (e) => {
    setBeat({ ...beat, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const [addBeat] = useAddBeatMutation();

  const {
    data: beats,
    isLoading,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery();

  const saveBeat = async (e) => {
    e.preventDefault();
    console.log(beats);

    if (beats.find((b) => b.name === beat.name)) {
      Swal.fire({
        icon: "warning",
        confirmButtonColor: "#008080",
        title: "A beat exists with the same name!",
      });
      return;
    }
    if (beat.name === "" || beat.name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        name: "Use A Valid Beat Name",
      });
    } else {
      if (beats?.length && sub?.maxbeats && beats?.length >= sub?.maxbeats) {
        Swal.fire({
          icon: "warning",
          confirmButtonColor: "#008080",
          title: "You've Run out of beats?",
          text: "Complete onboarding process and subscribe for more?",
        });
        return;
      }
      dispatch(suspenseShow);
      await addBeat(beat);
      console.log(user);
      await refetchBeats();
      dispatch(suspenseHide);
      navigate("../");
    }
  };
  return (
    <>
      {/* add-beat-app works! */}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form onSubmit={saveBeat}>
          <div className="mb-6">
            <TextInputField
              label="Beat Name"
              name="name"
              type="text"
              placeholder="Beat Name"
              id="name"
              error={validationErrors["name"]}
              onChange={handleChange}
              required="required"
              value={beat.name}
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
                id="description"
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

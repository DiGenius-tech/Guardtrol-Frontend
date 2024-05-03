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

import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../redux/slice/suspenseSlice";
import { useGetSubscriptionQuery } from "../../../../redux/services/subscriptions";
import {
  useAddBeatMutation,
  useGetBeatsQuery,
} from "../../../../redux/services/beats";
import Swal from "sweetalert2";

const AddBeat = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const navigate = useNavigate();
  const { data: sub } = useGetSubscriptionQuery();

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [beat, setBeat] = useState({
    name: "",
    address: "",
    description: "my location",
  });

  const {
    data: beats,
    isLoading,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery();

  useEffect(() => {
    refetchBeats();
  }, [token]);

  const handleChange = (e) => {
    setBeat({ ...beat, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const [addBeat] = useAddBeatMutation();

  const saveBeat = async (e) => {
    e.preventDefault();
    if (beat.name === "" || beat.name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        name: "Use A Valid Beat Name",
      });
    } else {
      if (beats?.length >= sub?.maxbeats) {
        setOpen(true);
        Swal.fire({
          title: "OOPS!! You've Ran Out Of Beats",
          text: "Would you like to subscribe for more beats ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#008080",
          confirmButtonText: "Subscribe for more!",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            // Swal.fire({
            //   title: "Deleted!",
            //   text: "Your file has been deleted.",
            //   icon: "success",
            // });
          }
        });

        return;
      }
      console.log("creating.......");
      dispatch(suspenseShow());

      const { data } = await addBeat(beat);

      if (data && data.status) {
        toast("Beat Created Successfully");
        navigate("/client/beats");
        dispatch(suspenseHide());
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
              name="name"
              type="text"
              placeholder="Beat Name"
              id="name"
              error={validationErrors["name"]}
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
      {/* <AlertDialog
        open={open}
        title="OOPS!! You've Ran Out Of Beats"
        description="Would You Like To Subscribe For Another Beat ?"
        setOpen={setOpen}
        actionText="Subscribe"
        action={() => {}}
      /> */}
    </>
  );
};

export default AddBeat;

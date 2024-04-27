import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import SelectField from "../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import MultiSelectField from "../../../../Sandbox/SelectField/MultiSelectField";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import {
  useAssignGuardToBeatMutation,
  useGetBeatsQuery,
} from "../../../../../redux/services/beats";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import { setOnboardingLevel } from "../../../../../redux/slice/onboardingSlice";
import { selectOnboardingLevel } from "../../../../../redux/selectors/onboarding";

function AssignNewBeat({ isOnboarding = true, beat: selectedBeat }) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const {
    data: beats,
    isLoading,
    error,
    refetch: refetchBeats,
  } = useGetBeatsQuery(user.userid, { skip: user.userid ? false : true });
  const {
    data: guards,
    isLoading: isGuardsLoading,
    error: guardsError,
  } = useGetGuardsQuery(user.userid, { skip: user.userid ? false : true });

  const [assignToBeat] = useAssignGuardToBeatMutation();

  const { responseData, sendRequest } = useHttpRequest();
  console.log(selectedBeat);

  const initialFrequencyState = useState([]);
  const [beat, setBeat] = useState(beats?.[0]);

  const [guard, setGuard] = useState([]);
  const [frequency, setFrequency] = useState(initialFrequencyState);

  const handleBeatSelection = (e) => {
    setBeat(JSON.parse(e.target.value));
  };

  const handleGuardSelection = (e) => {
    console.log(e.target.value);
    setGuard([...guard, JSON.parse(e.target.value)]);
  };

  const handleFrequencySelection = (e) => {
    setFrequency(JSON.parse(e.target.value));
  };

  // useEffect(() => {
  //   dispatch(suspenseShow);
  //   const getBeats = async () => {
  //     const data = await sendRequest(
  //       `beat/getbeats/${user.userid}`,
  //       "GET",
  //       null,
  //       {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user.token}`,
  //       }
  //     );
  //     if (!!data) {
  //       setInitialBeatState(data.beats);
  //       setInitialGuardState(data.guards);
  //       console.log(data.beats);
  //     } else {
  //       toast.error("Failed To Fetch Beats");
  //     }
  //   };
  //   user.token && getBeats();
  //   //setBeats(guardList);
  // }, [user.token, user.userid]);

  const checkIfGuardIsAssigned = (guard) => {
    dispatch(suspenseShow);
    let isGuardAssigned = { status: false, message: "" };

    beats?.forEach((beat) => {
      if (
        beat.guards.some((assignedGuard) => assignedGuard._id === guard._id)
      ) {
        dispatch(suspenseHide);
        const message = `${guard.name} has already been assigned to ${beat.name}`;
        isGuardAssigned = { status: true, message: message };
        //throw new Error(`${guard.name} has already been assigned to ${beat.name}`);
      }
    });

    dispatch(suspenseHide);
    return isGuardAssigned;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!beat && !selectedBeat) {
      toast.info("Select a Beat to Assign Guards");
      return;
    }
    if (guard.length < 1) {
      toast.info("Select Guards to be Assigned to Beats");
      return;
    }
    const check = guard.map((item) => {
      return checkIfGuardIsAssigned(item);
    });

    const c = check.some((value) => {
      if (value.status) {
        toast.warning(value.message);
        return true;
      }
    });

    if (c) return;

    console.log(check);

    dispatch(suspenseShow);

    const formData = {
      beat: selectedBeat ? selectedBeat : beat,
      guards: guard,
    };

    // const data = await sendRequest(
    //   `guard/assignbeat/${user.userid}`,
    //   "POST",
    //   JSON.stringify(formData),
    //   {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${user.token}`,
    //   }
    // );
    const data = await assignToBeat({ userid: user.userid, body: formData });
    refetchBeats();
    console.log(data);

    if (data) {
      toast("Assinged");
    }
    if (isOnboarding) {
      navigate("/onboarding/assign-beats");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      {/* assign-new-beat-app works! */}
      {isOnboarding && (
        <>
          <h1 className="font-bold text-center text-2xl text-dark-450">
            Assign Beats
          </h1>
          <p className="text-center mx-auto max-w-[400px] text-dark-400">
            Select A beat And Guards To be Assigned(You Can Select Multiple
            Guards)
          </p>
        </>
      )}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-16">
        <form onSubmit={save}>
          {/*  */}
          {!selectedBeat && (
            <div className="mb-6">
              <SelectField
                value={beat}
                name="beat"
                id="beat"
                label="Select beat"
                semibold_label={true}
                handleChangeOption={handleBeatSelection}
                optionList={beats}
                multipleSelect={false}
              />{" "}
            </div>
          )}

          <div className="mb-6">
            <MultiSelectField
              selectedOptions={guard}
              setSelectedOptions={setGuard}
              value={guard}
              name="guard"
              multiple={true}
              multiSelect={
                beats?.length >= 10 ? beats?.length - 5 : beats?.length
              }
              id="guard"
              multipleSelect={true}
              label="Select guard"
              semibold_label={true}
              handleChangeOption={handleGuardSelection}
              optionList={guards}
            />
          </div>

          {/* <div className="mb-6">
            <SelectField
              value={frequency}
              name="frequency"
              id="frequency"
              label="Select frequency"
              semibold_label={true}
              handleChangeOption={handleFrequencySelection}
              optionList={initialFrequencyState}
            />
          </div> */}

          <RegularButton text="Save Changes" />
        </form>
      </div>
    </>
  );
}

export default AssignNewBeat;

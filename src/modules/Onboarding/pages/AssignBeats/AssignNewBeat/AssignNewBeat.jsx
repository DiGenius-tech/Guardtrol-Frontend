import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import SelectField from "../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import MultiSelectField from "../../../../Sandbox/SelectField/MultiSelectField";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../../redux/selectors/auth";
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

function AssignNewBeat({ isOnboarding = true }) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { beatId } = useParams();
  const organization = useSelector(selectOrganization);

  const {
    data: beats,
    error,
    refetch: refetchBeats,
  } = useGetBeatsQuery(organization, {
    skip: organization ? false : true,
  });

  const selectedBeat = beats?.find((b) => b._id === beatId);

  const { data: guards, error: guardsError } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  const [assignToBeat] = useAssignGuardToBeatMutation();
  const { responseData, sendRequest } = useHttpRequest();

  const initialFrequencyState = useState([]);
  const [beat, setBeat] = useState(beats?.[0]);

  const [guard, setGuard] = useState([]);
  const [frequency, setFrequency] = useState(initialFrequencyState);

  const handleBeatSelection = (e) => {
    console.log(e.target.value);
    setBeat(beats.find((b) => b._id === e.target.value));
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
  //         Authorization: `Bearer ${token}`,
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
  //   token && getBeats();
  //   //setBeats(guardList);
  // }, [token, user.userid]);

  const checkIfGuardIsAssigned = (guard) => {
    dispatch(suspenseShow);
    let isGuardAssigned = { status: false, message: "" };

    beats?.forEach((beat) => {
      if (
        beat?.guards?.some((assignedGuard) => assignedGuard._id === guard._id)
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
    setIsLoading(true);
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
    //     Authorization: `Bearer ${token}`,
    //   }
    // );
    const data = await assignToBeat({ userid: user.userid, body: formData });
    const d = await refetchBeats();
    setIsLoading(false);

    if (data && d) {
      toast("Assinged");

      if (isOnboarding) {
        navigate("/onboarding/assign-beats");
      }
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
                value={beat._id}
                name="beat"
                id="beat"
                label="Select beat"
                semibold_label={true}
                handleChangeOption={handleBeatSelection}
                optionList={beats.map((b) => {
                  return { value: b._id, name: b.name };
                })}
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
              optionList={guards?.filter(
                (g) => !selectedBeat?.guards?.find((gu) => gu._id === g._id)
              )}
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
          <div className="flex justify-between items-center">
            <RegularButton
              disabled={isLoading}
              isLoading={isLoading}
              text="Save Changes"
              width="[150px]"
            />

            <span
              onClick={() => {
                navigate(-1);
              }}
              to="assign-new-beat"
              className="text-primary-500 font-semibold text-sm cursor-pointer"
            >
              Cancel
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default AssignNewBeat;

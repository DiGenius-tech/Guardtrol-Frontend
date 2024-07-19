import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Beat from "./Beat";
import EditBeat from "./EditBeat";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { setOnboardingLevel } from "../../../redux/slice/onboardingSlice";
import {
  useAddBeatMutation,
  useGetBeatsQuery,
} from "../../../redux/services/beats";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";

function BeatList() {
  const [isEdit, setIsEdit] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  //dispatch(suspenseHide());
  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);

  const navigate = useNavigate();
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isBeatsLoaded, setIsBeatsLoaded] = useState(false);

  const {
    data: sub,
    isError,
    refetch,
  } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });
  const {
    data: beatsApiResponse,
    isLoading,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const [beatsToedit, setBeatsToEdit] = useState(beatsApiResponse?.beats);
  const handle_edit_beat = (beat) => {
    if (beat) {
      setIsEdit(true);
      console.log(beat);
      setSelectedBeat(beat);
    }
  };

  // const addBeat = useCallback(
  //   (beat, index) => {
  //     beats[index] = beat;
  //     setBeats(beats);
  //     //setBeats((prevBeats) => [...prevBeats, beat]);
  //   },
  //   [beats, setBeats]
  // );

  const cancelEdit = () => {
    setIsEdit(false);
  };

  const [addBeats] = useAddBeatMutation();

  const saveBeat = async (beats) => {
    if (!beatsApiResponse?.totalBeats) {
      toast.info("Add at Least One Beat To Continue");
      return;
    }

    //dispatch(suspenseShow());

    // const data = await addBeats({ userId: user.userid, body: beats }).finally(
    //   dispatch(suspenseHide())
    // );

    dispatch(setOnboardingLevel(2));
    navigate("/onboarding/onboard-guard");
  };

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //   }
  // }, [error]);
  return (
    <>
      {/* beat-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8">
            <EditBeat
              selectedBeat={selectedBeat}
              setBeats={setBeatsToEdit}
              cancelEdit={cancelEdit}
            />
          </div>
        ) : (
          <>
            <div className=" flex justify-center items-center text-gray-400 mb-3">
              <h3 className="">
                {beatsApiResponse?.totalBeats} out of {sub?.maxbeats} Beats
                created
              </h3>
            </div>
            <ul className="mb-4 flex flex-col gap-4">
              {beatsApiResponse?.beats?.map((beat) => (
                <li key={beat._id}>
                  <Beat
                    beat={beat}
                    setBeats={setBeatsToEdit}
                    handle_edit_beat={handle_edit_beat}
                  />
                </li>
              ))}
            </ul>
            <Link
              to="add-beat"
              className="text-primary-500 font-semibold text-sm"
            >
              + Add New Beat
            </Link>
            <div className="my-8"></div>
            <RegularButton
              text="Continue To Onboard Guards"
              onClick={() => saveBeat(beatsApiResponse?.beats)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default BeatList;

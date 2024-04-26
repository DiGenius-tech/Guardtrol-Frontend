import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Beat from "./Beat/Beat";
import EditBeat from "../EditBeat/EditBeat";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import { setOnboardingLevel } from "../../../../../redux/slice/onboardingSlice";
import {
  useAddBeatMutation,
  useGetBeatsQuery,
} from "../../../../../redux/services/beats";

function BeatList() {
  const [isEdit, setIsEdit] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  //dispatch(suspenseHide());
  const token = useSelector(selectToken);

  const navigate = useNavigate();
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isBeatsLoaded, setIsBeatsLoaded] = useState(false);

  const {
    data: beats,
    isLoading,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
  });

  const [beatsToedit, setBeatsToEdit] = useState(beats);
  const handle_edit_beat = (guard) => {
    if (guard) {
      setIsEdit(true);
      setSelectedBeat(guard);
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
    // if (beats == [] || beats.lenght < 1) { //wrong condition
    //}

    if (!beats.length) {
      toast.info("Add at Least One Beat To Continue");
      return;
    }

    dispatch(suspenseShow());

    const data = await addBeats({ userId: user.userid, body: beats }).finally(
      dispatch(suspenseHide())
    );

    if (data) {
      dispatch(setOnboardingLevel(2));
      navigate("/onboarding/onboard-guard");
    }
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
            <ul className="mb-4 flex flex-col gap-4">
              {beats.map((beat) => (
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
              text="Continue To On-Board Guards"
              onClick={() => saveBeat(beats)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default BeatList;

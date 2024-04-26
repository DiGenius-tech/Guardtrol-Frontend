import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import Beat from "../../ConfigureBeats/BeatList/Beat/Beat";
import AssignedBeat from "./AssignedBeat/AssignedBeat";
import { Button, ListGroup, Modal, Toast } from "flowbite-react";
import { randomHexColor } from "../../../../../shared/functions/random-hex-color";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import AlertDialog from "../../../../../shared/Dialog/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../../redux/selectors/auth";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { patch } from "../../../../../lib/methods";
import { loginSuccess } from "../../../../../redux/slice/authSlice";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import axios from "axios";
import { API_BASE_URL } from "../../../../../constants/api";


function AssignedBeatList(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignedBeat, setSelectedAssignedBeat] = useState(null);

  const handle_edit_beat = (guard) => {
    if (guard) {
      setIsEdit(true);
      //   setSelectedBeat(guard);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };

  const select_assigned_beat = (data) => {
    setOpenModal(true);
    setSelectedAssignedBeat(data);
    // alert(JSON.stringify(data));
  };

  const {
    data: beats,
    isLoading,
    refetch: refetchBeats,
  } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
    
  });

  const finish = async () => {
    const check = beats.some((beat) => {
      return beat.guards.length > 0;
    });

    if (!check) {
      toast.info("Assign at Least One Guard to a Beat to Continue");
      return;
    }

    const data = await patch(
      `users/finishonboarding/${user.userid}`,
      {},
      user.token
    );

    if (!data) {
      toast.error("An Error Occured");
      return;
    }
    dispatch(loginSuccess(data));
    localStorage.setItem("onBoardingLevel", 4);
    navigate("/onboarding/complete");
  };

  const deleteGuard = async (beat) => {
    if (beat) {
      dispatch(suspenseShow());
      const bt = { beat: beat };
      try {
        const data = await axios.delete(
          API_BASE_URL + `beat/deletguardsassigned/${user.userid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            data: bt, // Assuming 'bt' is the data you want to send in the request body
          }
        );
        if (data) {
          toast(data.messsage);
          setOpen(false);
          setOpenModal(false);
        }
        // Handle successful response if needed
      } catch (error) {
        // Handle errors
      } finally {
        refetchBeats();
        dispatch(suspenseHide());
      }
    }
  };
  dispatch(suspenseHide());
  return (
    <>
      {/* assigned-beat-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8">
            {/* <EditBeat
              selectedBeat={selectedBeat}
              setBeats={setBeats}
              cancelEdit={cancelEdit}
            /> */}
          </div>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-4">
              {beats?.map((assigned_beat) => (
                <li
                  key={assigned_beat._id}
                  onClick={() => select_assigned_beat(assigned_beat)}
                >
                  <AssignedBeat assigned_beat={assigned_beat} />
                </li>
              ))}
            </ul>
            {/* <ul className="mb-4 flex flex-col gap-4">
              {beats.map((guard) => (
                <li key={guard.beat_name}>
                  <Beat
                    guard={guard}
                    setBeats={setBeats}
                    handle_edit_beat={handle_edit_beat}
                  />
                </li>
              ))}
            </ul> */}
            {props.isOnboarding && (
              <Link
                to="assign-new-beat"
                className="text-primary-500 font-semibold text-sm"
              >
                + Assign Guard To Beat
              </Link>
            )}
            {!props.isOnboarding && (
              <Link
                to="#"
                onClick={() => props.setPage("AssignNewBeat")}
                className="text-primary-500 font-semibold text-sm"
              >
                + Assign Guard To Beat
              </Link>
            )}

            <div className="my-8"></div>
            {props.isOnboarding && (
              <RegularButton text="Finish Onboarding" onClick={finish} />
            )}
            <Dialog
              openModal={openModal}
              setOpenModal={setOpenModal}
              selectedAssignedBeat={selectedAssignedBeat}
              setOpen={setOpen}
            />
            <AlertDialog
              open={open}
              title={`Delete Guards ?`}
              description={`Are You Sure You Want To Delete This All Guards Assigned to ${selectedAssignedBeat?.name} ?`}
              setOpen={setOpen}
              actionText="Delete"
              action={() => deleteGuard(selectedAssignedBeat)}
            />
          </>
        )}
      </div>
    </>
  );
}

const Dialog = (props) => {
  const { name, description, _id, guards } = props.selectedAssignedBeat
    ? props.selectedAssignedBeat
    : {
        beat: {},
        frequency: "",
        guards: [],
        name: "",
        description: "",
        _id: "",
      };
  return (
    <Modal
      show={props.openModal}
      size={"4xl"}
      onClose={() => props.setOpenModal(false)}
    >
      <Modal.Header>{name}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <section>
            <h2 className="font-bold text-md mb-2">Guards</h2>
            <ListGroup className="">
              {guards.length > 0
                ? guards.map((guard) => {
                    return (
                      <ListGroup.Item>
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              backgroundColor: randomHexColor(),
                              color: "white",
                            }}
                            className={
                              "h-7 w-7 rounded-full overflow-hidden border-2 flex items-center justify-center"
                            }
                          >
                            {guard.profile_image ? (
                              <img
                                src={guard.profile_image}
                                alt="profile image"
                              />
                            ) : (
                              <p className="m-0 font-semibold">
                                {guard.name.slice(0, 1).toUpperCase()}
                              </p>
                            )}
                          </div>

                          <span className="text-xs">
                            {guard.name.toUpperCase()}
                          </span>
                        </div>
                      </ListGroup.Item>
                    );
                  })
                : "No Guards Assigned Yet"}
            </ListGroup>
          </section>

          {/* <section>
            <h3 className="font-bold text-md mb-2">Frequency</h3>
            <p className="first-letter:uppercase">{frequency}</p>
          </section> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="text-red-400"
          onClick={() => props.setOpen(true)}
        >
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignedBeatList;

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
import { selectToken, selectUser } from "../../../../../redux/selectors/auth";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { patch } from "../../../../../lib/methods";
import { loginSuccess } from "../../../../../redux/slice/authSlice";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import axios from "axios";
import { API_BASE_URL } from "../../../../../constants/api";
import { setOnboardingLevel } from "../../../../../redux/slice/onboardingSlice";
// const guardList = [
//   {
//     id: 1,
//     beat_name: "Laborum possimus voluptatum",
//     description:
//       "Reiciendis at aperiam repellat sunt illum autem non laborum possimus voluptatum distinctio optio, libero quo hic quos veniam."
//   },
//   {
//     id: 2,
//     beat_name: "Repudiandae ipsam libero deserunt",
//     description:
//       "Vero commodi ea laboriosam voluptas enim temporibus nostrum, repudiandae ipsam libero deserunt velit porro quaerat autem"
//   }
// ];
// const assign_beat_list = [
//   {
//     id: 1,
//     beat: {
//       id: 1,
//       title: "Laborum possimus voluptatum",
//       description:
//         "Reiciendis at aperiam repellat sunt illum autem non laborum possimus voluptatum distinctio optio, libero quo hic quos veniam."
//     },
//     guardList: [
//       {
//         id: 1,
//         name: "adewale quadri",
//         profile_image:
//           "data:image/jpeg;base64,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"
//       },
//       {
//         id: 2,
//         name: "abisola josiah",
//         profile_image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkgKuj802GmUe9v9bwXMRd0wY94fRy_bbhXg&s"
//       },
//       {
//         id: 3,
//         name: "john doe",
//         profile_image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-SCAyEOQVCBLmU60ITRMvK8_on9o63mmDg&s"
//       },
//       {
//         id: 4,
//         name: "cole pfeiffer",
//         profile_image: ""
//       },
//       {
//         id: 5,
//         name: "tunde michael",
//         profile_image: ""
//       }
//     ],
//     frequency: "every 30 mins"
//   },
//   {
//     id: 2,
//     beat: {
//       id: 1,
//       title: "Repudiandae ipsam libero deserunt",
//       description:
//         "Vero commodi ea laboriosam voluptas enim temporibus nostrum, repudiandae ipsam libero deserunt velit porro quaerat autem"
//     },
//     guardList: [
//       {
//         id: 1,
//         name: "johana asake",
//         profile_image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR76mTbymO28nS4Gdj3M1NsHzYjxY0CK0hWTA&s"
//       },
//       {
//         id: 2,
//         name: "marsh shady",
//         profile_image: ""
//       },
//       {
//         id: 3,
//         name: "best temidire",
//         profile_image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5XbI-8qas-0gmy2qBwarGQ9h3A1QgnCXcrg&s"
//       },
//       {
//         id: 4,
//         name: "bola adeoye",
//         profile_image: ""
//       },
//       {
//         id: 5,
//         name: "timi joktola",
//         profile_image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7hceP_Hl-RJGgBpJ1NNcbqbdKAUs2u06Qiw&s"
//       }
//     ],
//     frequency: "every 30 mins"
//   }
// ];

function AssignedBeatList(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = useSelector(selectToken);

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
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(user.userid, {
    skip: user.userid ? false : true,
    
  });
  console.log(beats)

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
    dispatch(setOnboardingLevel(4));
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

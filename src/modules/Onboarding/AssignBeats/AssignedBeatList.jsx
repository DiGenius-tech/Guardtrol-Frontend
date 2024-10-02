import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import AssignedBeat from "./AssignedBeat";
import { Button, ListGroup, Modal, Toast } from "flowbite-react";
import { randomHexColor } from "../../../shared/functions/random-hex-color";
import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import AlertDialog from "../../../shared/Dialog/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { patch } from "../../../lib/methods";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { setOnboardingLevel } from "../../../redux/slice/onboardingSlice";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";
import { POOLING_TIME } from "../../../constants/static";

function AssignedBeatList(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isFinishLoading, setisFinishLoading] = useState(false);
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
    data: beatsApiResponse,
    isLoading,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const {
    data: sub,
    isError,
    refetch,
  } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  const finish = async () => {
    try {
      dispatch(suspenseShow());

      setisFinishLoading(true);
      const check = beatsApiResponse?.beats?.some((beat) => {
        return beat.guards.length > 0;
      });

      if (!check) {
        toast.info("Assign at Least One Guard to a Beat to Continue");
        return;
      }

      const data = await patch(
        `users/finishonboarding/${user.userid}`,
        {},
        token
      );

      if (!data) {
        toast.error("An Error Occured");
        return;
      }
      if (data) {
        navigate("/onboardingcomplete");
      }
    } catch (error) {
    } finally {
      dispatch(suspenseHide());

      setisFinishLoading(false);
    }
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
              Authorization: `Bearer ${token}`,
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
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8"></div>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-4">
              {beatsApiResponse?.beats?.map((assigned_beat) => (
                <li
                  key={assigned_beat._id}
                  onClick={() => select_assigned_beat(assigned_beat)}
                >
                  <AssignedBeat assigned_beat={assigned_beat} />
                </li>
              ))}
            </ul>

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
              <RegularButton
                disabled={isFinishLoading}
                isLoading={isFinishLoading}
                text="Finish Onboarding"
                onClick={finish}
              />
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

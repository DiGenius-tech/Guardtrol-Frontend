import { Button, Card, Tabs } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import EditPersonalInformation from "../EditGuard/EditPersonalInformation/EditPersonalInformation";
import EditIdentification from "../EditGuard/EditIdentification/EditIdentification";
import BankDetails from "../EditGuard/BankDetails/BankDetails";
import EditNextOfKin from "../EditGuard/EditNextOfKin/EditNextOfKin";
import EditGuarantorForm from "../EditGuard/EditGuarantorForm/EditGuarantorForm";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../../redux/selectors/auth";
import {
  useActivateGuardMutation,
  useGetGuardsQuery,
  useUpdateGuardMutation,
} from "../../../../../redux/services/guards";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { get, put } from "../../../../../lib/methods";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import { API_BASE_URL, ASSET_URL } from "../../../../../constants/api";
import axios from "axios";
import { updateUser } from "../../../../../redux/slice/authSlice";

const PatrolGuardDetails = () => {
  const dispatch = useDispatch();
  const [isComment, setIsComment] = useState(false);
  const auth = useSelector(selectUser);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();

  const profilePhotoControlRef = useRef();
  const token = useSelector(selectToken);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [base, setBase] = useState("");
  const [profile, setProfile] = useState();

  const { guardId } = useParams();
  const [guard, setGuard] = useState({});

  const [comment, setComment] = useState("");
  const [activateGuard] = useActivateGuardMutation();
  const { data: beats, refetch: refetchBeats } = useGetBeatsQuery();
  const {
    data: guards,
    refetch: refetchGuards,
    isUninitialized,
  } = useGetGuardsQuery();

  const handleSentRequest = () => {
    const data = get(`guard/getguard/${guardId}`, token).then((data) => {
      console.log(data);
      setGuard(data);
    });
  };

  const handleUpdateImage = async () => {
    try {
      dispatch(suspenseShow());

      const formData = new FormData();
      console.log(profile);

      formData.append("profile", profile);
      formData.append("guardId", guardId);

      const { data } = await axios.put(
        `${API_BASE_URL}guard/${guardId}/image`,
        formData,
        {
          headers: {
            Authorization: `${"Bearer " + token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data) {
        refetchGuards();
      }
      dispatch(suspenseHide());
    } catch (error) {
      dispatch(suspenseHide());
    }
  };

  const getSelectedFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setProfile(event.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setBase(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
    }
  };

  // const handleUpdateImage = async (values) => {
  //   dispatch(suspenseShow());
  //   const data = await put(
  //     "guard/image",
  //     { guardId, image: `data:image/png;base64,${base}` },
  //     token,
  //     true,
  //     "Profile image updated"
  //   );
  //   console.log(data);
  //   if (data) {
  //   }
  // };
  useEffect(() => {
    handleSentRequest();
  }, [token, guardId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const AddComment = (e) => {
    e.preventDefault();
    const commentData = {
      comment: comment,
      updatedat: Date.now(),
    };

    const data = sendRequest(
      `guard/comment/${guardId}`,
      "PATCH",
      JSON.stringify(commentData),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    ).then((data) => {
      if (data?.status) {
        toast("Comment Updated");
        setIsComment(false);
        setGuard({});
        handleSentRequest();
      }
    });
  };

  // const getSelectedFile = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //     setProfile(event.target.files[0]);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //       setBase(reader.result.split(",")[1]);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFileName("");
  //   }
  // };

  const verify = async (e) => {
    const statusData = {
      status: !guard?.isactive,
    };

    await activateGuard({ guardId, statusData });
    toast("Guard Status Updated");
    await handleSentRequest();
    await refetchBeats();
    await refetchGuards();
    // const data = sendRequest(
    //   `guard/verify/${guardId}`,
    //   "PATCH",
    //   JSON.stringify(statusData),
    //   {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   }
    // ).then((data) => {
    //   if (data.status) {
    //     toast.clearWaitingQueue();
    //     toast("Guard Status Updated");
    //     handleSentRequest();
    //     return;
    //   }
    // });
  };
  console.log(guard);
  return (
    <>
      {/* patrol-guard-details-app works! */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 sm:col-span-4">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div>
              <div className="mb-2 relative h-20 w-20 min-h-20 min-w-20 rounded-full overflow-hidden">
                <label
                  style={{
                    position: "absolute",
                    top: 0,
                    fontSize: 2,
                    right: 1,
                    zIndex: 100,
                  }}
                  htmlFor="profile_image"
                  className="cursor-pointer h-full w-full text-primary-500 text-xs font-semibold whitespace-nowrap"
                >
                  Change my photo
                </label>
                <input
                  type="file"
                  id="profile_image"
                  accept="image/*"
                  name="profile_image"
                  className="absolute h-full w-full"
                  style={{
                    position: "absolute",
                    top: 0,
                    fontSize: 2,
                    right: 1,
                    zIndex: 100,
                  }}
                  hidden
                  ref={profilePhotoControlRef}
                  onChange={(e) => getSelectedFile(e)}
                />

                {!guard?.profileImage && !preview ? (
                  <div className="bg-secondary-50 cursor-pointer rounded-full h-full w-full flex items-center justify-center text-2xl font-bold">
                    {`${guard?.name?.split(" ")?.[0]?.[0] || ""} ${
                      guard?.name?.split(" ")?.[1]?.[0] || ""
                    }`}
                  </div>
                ) : (
                  <img
                    className="cursor-pointer h-full w-full "
                    src={preview ? preview : ASSET_URL + guard.profileImage}
                    alt={fileName}
                  />
                )}
              </div>
              <div>
                <p className="text-sm">
                  We accept files in PNG or JPG format, with a maximum size of 5
                  MB.{" "}
                  {fileName && (
                    <>
                      <span
                        onClick={() => handleUpdateImage()}
                        className="cursor-pointer text-primary-500 font-semibold whitespace-nowrap"
                      >
                        Update Profile
                      </span>
                      <strong className="block text-xs mt-2">{fileName}</strong>{" "}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="my-5">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                {guard?.name}
              </h5>
              <ul className="font-normal text-sm text-gray-700 dark:text-gray-400">
                <li>{guard?.phone}</li>
                {/* <li>doe_john@yahoo.com</li> */}
              </ul>
            </div>
            <form>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="verification"
                  className="sr-only peer"
                  onClick={() => verify()}
                  checked={guard?.isactive}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                <span className="ms-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Activate
                </span>
              </label>
            </form>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-8">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {!isComment ? (
              <>
                <h5 className="text-md font-bold text-gray-900 dark:text-white">
                  Comment
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {guard?.comment?.comment || "No Comment Here Yet"}
                </p>

                <div className="my-2"></div>
                <small className="text-dark-250 font-semibold">
                  - {auth?.user?.name},{" "}
                  {moment(guard?.comment?.updatedat).format("h:mm a ddd D MMM")}
                </small>
                <div className="my-4"></div>
                <button
                  onClick={() => setIsComment(true)}
                  className="text-secondary-500 font-semibold"
                >
                  Edit comment
                </button>
              </>
            ) : (
              <>
                {/* comment form */}
                <form onSubmit={AddComment}>
                  <div className="mb-5">
                    <label
                      for="message"
                      className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Your comment
                    </label>
                    <textarea
                      id="message"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="6"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Leave a comment..."
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="text-white bg-primary-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setIsComment(false)}
                      type="button"
                      className="text-white bg-gray-300 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-4"></div>
      <div className="tab flex-tabs flex-tab-nowrap">
        <Tabs aria-label="Tabs with underline" style="fullWidth">
          <Tabs.Item active title="Personal information">
            <EditPersonalInformation
              guard={guard}
              setGuard={setGuard}
              handleSentRequest={handleSentRequest}
            />
          </Tabs.Item>
          <Tabs.Item title="Guarantor form">
            <EditGuarantorForm
              guard={guard?.guarantor}
              setGuard={setGuard}
              handleSentRequest={handleSentRequest}
            />
          </Tabs.Item>
          <Tabs.Item title="Identification">
            <EditIdentification
              guard={guard?.identification}
              setGuard={setGuard}
              handleSentRequest={handleSentRequest}
            />
          </Tabs.Item>
          <Tabs.Item title="Next of kin">
            <EditNextOfKin
              guard={guard?.nextofkin}
              setGuard={setGuard}
              handleSentRequest={handleSentRequest}
            />
          </Tabs.Item>
          <Tabs.Item title="Bank details">
            <BankDetails
              guard={guard?.banking}
              setGuard={setGuard}
              handleSentRequest={handleSentRequest}
            />
          </Tabs.Item>
        </Tabs>
      </div>
    </>
  );
};

export default PatrolGuardDetails;

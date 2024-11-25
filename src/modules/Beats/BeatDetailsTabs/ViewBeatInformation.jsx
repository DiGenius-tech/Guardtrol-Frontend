import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../redux/services/beats";
import { useDispatch, useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { POOLING_TIME } from "../../../constants/static";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { toast } from "react-toastify";

const ViewBeatInformation = ({ setPage }) => {
  const user = useSelector(selectUser);
  const { beatId } = useParams();
  const [updateBeat] = useUpdateBeatMutation();

  const organization = useSelector(selectOrganization);
  const dispatch = useDispatch();
  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const handleUpdateBeat = async (state) => {
    dispatch(suspenseShow());
    await updateBeat({
      body: { ...selectedBeat, ...state },
      userid: user?.userid,
      organization,
    }).then();
    await refetchBeats();

    dispatch(suspenseHide());
    toast("Beat Updated");
  };

  const selectedBeat = beatsApiResponse?.beats?.find((b) => b._id === beatId);
  return (
    <>
      <div className="flex justify-between flex-row mb-3">
        <h4 className="text-md   font-medium text-primary-500 dark:text-white">
          View Beat Information
        </h4>

        <span
          onClick={() => setPage("EditBeatInformation")}
          className="text-primary-500 text-md   font-medium cursor-pointer"
        >
          Edit
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 xl:col-span-6">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Summary
              </h4>
            </div>
            <hr />
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Name</h3>

              <div className="">
                <p>{selectedBeat?.name || "No Name"}</p>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Location</h3>
              <div className="">
                <p>{selectedBeat?.address || "No Address"}</p>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Beat Guards</h3>

              <div className="">
                <p>{selectedBeat?.guards.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Activities
              </h4>
            </div>
            <hr />
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Most recent patrol</h3>
              <div className="">
                <p>Beat Name</p>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <label className="inline-flex items-center w-full justify-between cursor-pointer ">
                <span className=" font-semibold text-gray-900 dark:text-gray-300">
                  <h3>
                    {selectedBeat?.bypassRequest
                      ? "Beat bypass request is Active, Deactivate?"
                      : "Beat bypass request isn't active, Activate?"}
                  </h3>
                </span>
                <input
                  type="checkbox"
                  name="verification"
                  className="sr-only peer"
                  onChange={async () => {
                    dispatch(suspenseShow());
                    await handleUpdateBeat({
                      bypassRequest: !selectedBeat?.bypassRequest,
                    });
                    dispatch(suspenseHide());
                  }}
                  defaultChecked={selectedBeat?.bypassRequest}
                />

                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <label className="inline-flex items-center w-full justify-between cursor-pointer ">
                <span className=" font-semibold text-gray-900 dark:text-gray-300">
                  <h3>
                    Trigger alert when the beat is offline for more than 2 hours
                    {", "}
                    {selectedBeat?.beatTrigger ? "Deactivate?" : "Activate?"}
                  </h3>
                </span>
                <input
                  type="checkbox"
                  name="verification"
                  className="sr-only peer"
                  onChange={async () => {
                    dispatch(suspenseShow());
                    await handleUpdateBeat({
                      beatTrigger: !selectedBeat?.beatTrigger,
                    });
                    dispatch(suspenseHide());
                  }}
                  defaultChecked={selectedBeat?.beatTrigger}
                />

                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Beat Guards</h3>
              <div className="">
                <p>8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBeatInformation;

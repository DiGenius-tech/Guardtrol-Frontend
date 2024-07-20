import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";

const ViewBeatInformation = ({ setPage }) => {
  const { beatId } = useParams();
  const organization = useSelector(selectOrganization);

  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

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
            <div className="flex justify-between flex-row">
              <h3 className="font-bold">Location</h3>
              <div className="">
                <p>Beat Location</p>
              </div>
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

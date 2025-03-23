import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { IoIosCafe } from "react-icons/io"; 
import { MdDashboard } from "react-icons/md";
import { Button, Tabs, TabsRef } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import BeatInformation from "./BeatInformation";
import BeatGuards from "./BeatGuards";
import BeatPatrol from "./BeatPatrol";
import BeatReport from "./BeatReport";
import { BiAlbum } from "react-icons/bi";
import BeatPoint from "./BeatPoint";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import BeatBreaks from "./BeatBreaks";
import { POOLING_TIME } from "../../../constants/static";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function BeatDetailsHeader() {
  const location = useLocation();
  const tabsRef = useRef();
  const { beatId } = useParams();
  const organization = useSelector(selectOrganization);

  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const selectedBeat = beatsApiResponse?.beats?.find((b) => b._id === beatId);
  return (
    <>
      <div className="flex justify-between flex-row my-2">
        <h5 className="text-lg   font-medium text-primary-500 dark:text-white">
          {selectedBeat?.name}
        </h5>
      </div>
      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item
            active={
              location.pathname ===
              "/client/beats/details/662c3a59e8263c96b16de18d/0"
            }
            tabIndex={"Profile"}
            title="Information"
            icon={HiUserCircle}
          >
            <BeatInformation />
          </Tabs.Item>
          <Tabs.Item title="Guards" icon={MdDashboard}>
            <BeatGuards />
          </Tabs.Item>
          <Tabs.Item title="Patrol" icon={HiAdjustments}>
            <BeatPatrol />
          </Tabs.Item>
          <Tabs.Item title="Points" icon={BiAlbum}>
            <BeatPoint />
          </Tabs.Item>
          <Tabs.Item title="Breaks" icon={IoIosCafe}>
            <BeatBreaks />
          </Tabs.Item>
        </Tabs>
      </div>
      {/* <nav>
        <ul className="flex gap-2 text-center -mb-px flex-wrap  border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={``}
              className={
                (location.pathname == `/client/beats/details/${beatId}`
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beat Info
            </Link>
          </li>
          <li>
            <Link
              to={`beat-guards`}
              className={
                (location.pathname.includes(
                  `/client/beats/details/${beatId}/beat-guards`
                )
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beat Guards
            </Link>
          </li>
          <li>
            <Link
              to={`beat-patrol`}
              className={
                (location.pathname ==
                `/client/beats/details/${beatId}/beat-patrol`
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beat Patrol
            </Link>
          </li>
          <li>
            <Link
              to={`beat-report`}
              className={
                (location.pathname ==
                `/client/beats/details/${beatId}/beat-report`
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beat Reports
            </Link>
          </li>
        </ul>
      </nav> */}
    </>
  );
}

export default BeatDetailsHeader;

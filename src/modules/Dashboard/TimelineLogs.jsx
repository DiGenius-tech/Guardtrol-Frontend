import { Card, Select, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Patrols from "./Patrols";
import "./styles/Dashboard.scss";
import MobileDisplay from "./MobileDisplay";
import { FaUser, FaMap } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";

import { format } from "date-fns";
import { useFetchTimelineLogsQuery } from "../../redux/services/timelinelogs";
import { useGetBeatsQuery } from "../../redux/services/beats";
import { useGetGuardsQuery } from "../../redux/services/guards";
import { formatDateTime } from "../../utils/dateUtils";

export const TimelineLogs = () => {
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data: guards } = useGetGuardsQuery(organization, {
    skip: !organization,
  });

  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization: organization },
    {
      skip: !organization,
    }
  );

  const getDateFilter = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (filterDate) {
      case "Today":
        return {
          startDate: today.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
        };
      case "Yesterday":
        return {
          startDate: yesterday.toISOString().split("T")[0],
          endDate: yesterday.toISOString().split("T")[0],
        };
      default:
        return {};
    }
  };

  const {
    data: logsAPiResponse,
    refetch,
    isFetching: isFetchingLogs,
  } = useFetchTimelineLogsQuery(
    {
      organizationId: organization,
      page: currentPage,
      limit: entriesPerPage,
      ...getDateFilter(),
      type: filterStatus !== "All" ? filterStatus : undefined,
    },
    {
      skip: !organization,
    }
  );
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");

  const renderLogs = () => {
    if (!logsAPiResponse?.logs?.length) {
      return (
        <li className="w-full text-center py-28">
          <p className="body text-gray-600">No Activity</p>
        </li>
      );
    }

    return logsAPiResponse.logs.map((log) => (
      <li key={log._id} className="horizontal-liner">
        <div className="activity">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-3 md:p-[15px]">
              <div className="text-sm font-semibold">
                {formatDateTime(log.createdAt)}
              </div>
            </div>
            <div className="hidden md:block dot-wrap | col-span-2 p-[20px]">
              <div className="dot"></div>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="body">
                <div
                  style={{ borderWidth: "1px" }}
                  className={`text-xs me-2 px-3 py-1.5 rounded-lg dark:bg-gray-700 ${
                    log.type === "Clock Action"
                      ? "bg-blue-50 text-blue-800 border-blue-900"
                      : "bg-gray-50 text-gray-800"
                  }`}
                  role="alert"
                >
                  <h3 className="title font-semibold">
                    {log.message.includes("clocked in")
                      ? "Clock in"
                      : log.message.includes("clocked out")
                      ? "Clock out"
                      : log.type}
                  </h3>
                  <p className="body">{log.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className="col-span-12 lg:col-span-6">
      <Card className="h-[415px]">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Timeline of Activities
        </h1>
        <div className="flex items-center gap-2">
          <div className="max-w-md">
            <Select
              id="dates"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              {/* Add other date options as needed */}
            </Select>
          </div>
          <div className="max-w-md">
            <Select
              id="statuses"
              required
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Account Action">Account</option>
              <option value="Clock Action">Clock</option>
              <option value="Guard Action">Guard</option>
              <option value="Patrol Action">Patrol</option>
              <option value="User Action">User</option>
            </Select>
          </div>
        </div>
        <ul className="activities | text-sm max-h-64 overflow-y-scroll min-h-64">
          {isFetchingLogs ? (
            <div className="w-full h-full justify-center flex items-center">
              <Spinner color="success" aria-label="Success spinner example" />
            </div>
          ) : (
            renderLogs()
          )}
        </ul>
      </Card>
    </div>
  );
};

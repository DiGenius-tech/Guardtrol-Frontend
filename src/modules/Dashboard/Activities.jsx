import React, { useEffect, useState } from "react";
import "./styles/Activities.scss";
import { useSelector } from "react-redux";
import { selectOrganization, selectToken } from "../../redux/selectors/auth";
import { format } from "date-fns";
import { useFetchTimelineLogsQuery } from "../../redux/services/timelinelogs";
import { Spinner } from "flowbite-react";
import { formatDateTime } from "../../utils/dateUtils";

const activity_status = {
  CLOCKED_ACTION: "Clock Action",
  PATROL_ACTION: "Patrol Action",
  GUARD_ACTION: "Guard Action",
  SHIFT_ACTION: "Shift Action",
};

const Activities = () => {
  const organization = useSelector(selectOrganization);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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

  // useEffect(() => {
  //   if (organization) {
  //     refetch();
  //   }
  // }, [organization, filterStatus, filterDate, refetch]);

  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");

  const getActivityStyle = (type) => {
    switch (type) {
      case activity_status.CLOCKED_ACTION:
        return "bg-blue-50 text-blue-800 border-blue-900";
      case activity_status.PATROL_ACTION:
        return "bg-green-50 text-green-800 border-green-900";
      case activity_status.GUARD_ACTION:
        return "bg-yellow-50 text-yellow-800 border-yellow-900";
      case activity_status.SHIFT_ACTION:
        return "bg-purple-50 text-purple-800 border-purple-900";
      default:
        return "bg-gray-50 text-gray-800 border-gray-900";
    }
  };

  return (
    <>
      {/* activities-app works! */}
      <ul className="activities | text-sm max-h-96 overflow-y-scroll">
        {logsAPiResponse?.logs?.map((activity) => {
          return (
            <li key={activity.id} className="horizontal-liner">
              <div className="activity">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 md:p-[15px]">
                    <div className="text-sm font-semibold">
                      {formatDateTime(activity.createdAt)}
                    </div>
                  </div>
                  <div className="hidden md:block dot-wrap | col-span-2 p-[20px]">
                    <div className="dot"></div>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <div className="body">
                      <div
                        style={{ borderWidth: "1px" }}
                        className={`text-xs me-2 px-3 py-1.5 rounded-lg dark:bg-gray-700 ${getActivityStyle(
                          activity.type
                        )}`}
                        role="alert"
                      >
                        <h3 className="title font-semibold">
                          {`${activity.type}
                          ${
                            activity.message.includes("Bypass")
                              ? "(Bypass)"
                              : ""
                          }`}
                        </h3>
                        <p className="body">{activity.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {!logsAPiResponse?.logs?.length && !isFetchingLogs && (
          <li className="w-full text-center py-28">
            <p className="body text-gray-600">No Activity</p>
          </li>
        )}
        {isFetchingLogs && (
          <li className="w-full text-center py-28">
            <Spinner color="success" aria-label="Success spinner example" />
          </li>
        )}
      </ul>
    </>
  );
};

export default Activities;

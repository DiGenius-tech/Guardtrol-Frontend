import React, { useEffect, useState } from "react";
import "./Activities.scss";
import { useSelector } from "react-redux";
import { selectToken } from "../../../../../redux/selectors/auth";
import { get } from "../../../../../lib/methods";
import { API_BASE_URL } from "../../../../../constants/api";
import { format } from "date-fns";

const activity_status = {
  CLOCKED_ACTION: "Clock Action",
};

const Activities = () => {
  const [timelineLogs, setLogs] = useState([]);
  const token = useSelector(selectToken);

  const getLogs = async () => {
    const res = await get(API_BASE_URL + "logs", token);
    setLogs(res);
  };
  useEffect(() => {
    getLogs();
  }, []);
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");
  return (
    <>
      {/* activities-app works! */}

      <ul className="activities | text-sm max-h-96 overflow-y-scroll">
        {timelineLogs?.map((activity) => {
          return (
            <li key={activity.id} className="horizontal-liner">
              <div className="activity">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-3 md:p-[15px]">
                    <div className="text-sm font-semibold">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                  <div className="hidden md:block dot-wrap | col-span-2 p-[20px]">
                    <div className="dot"></div>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <div className="body">
                      {/* <div className="p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert"> */}
                      <div
                        style={{ borderWidth: "1px" }}
                        className={`text-xs me-2 
                    px-3 py-1.5 rounded-lg dark:bg-gray-700 
                    ${
                      activity.type === "Clock Action"
                        ? "bg-blue-50 text-blue-800  border-blue-900"
                        : "bg-gray-50 text-gray-800"
                    }`}
                        role="alert"
                      >
                        <h3 className="title font-semibold">{activity.type}</h3>
                        <p className="body">{activity.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {/* <li>
                    <div className="activity">
                        <div className="date">9:00 AM</div>
                        <div className="body">
                            <div className="dot"></div>
                            <div>
                                Thomas Prosper has <span>taken a break</span>
                            </div>
                        </div>
                    </div>
                </li> */}
      </ul>
    </>
  );
};

export default Activities;

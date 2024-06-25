import { Card, Label, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Activities from "./Activities/Activities";
import Patrols from "./Patrols/Patrols";
import "./Dashboard.scss";
import { Link, Outlet } from "react-router-dom";
import MobileDisplay from "./MobileDisplay/MobileDisplay";
import { FaUser, FaMap } from "react-icons/fa"; // Import the icons you want to use
import { useGetTimelineLogsQuery } from "../../../../redux/services/timelinelogs";
import { format } from "date-fns";
import { useGetGuardsQuery } from "../../../../redux/services/guards";
import { useGetBeatsQuery } from "../../../../redux/services/beats";
import userEvent from "@testing-library/user-event";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import { get } from "../../../../lib/methods";
import { API_BASE_URL } from "../../../../constants/api";

const Dashboard = () => {
  const user = useSelector(selectUser);
  // const {
  //   data: timelineLogs,
  //   isUninitialized,
  //   refetch: refetchLogs,
  // } = useGetTimelineLogsQuery();

  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  const [filterPatrolDate, setFilterPatrolDate] = useState("All");
  const { data: guards } = useGetGuardsQuery();
  const { data: beats } = useGetBeatsQuery();

  // Function to render timeline logs
  const [patrols, setPatrols] = useState();
  const [timelineLogs, setLogs] = useState();
  const token = useSelector(selectToken);
  const [filteredPatrols, setFilteredPatrols] = useState([]);

  const [filterPatrolsType, setFilterPatrolsType] = useState();

  const getPatrolInstances = async () => {
    const res = await get(API_BASE_URL + "patrols/get-instances", token);
    setPatrols(res);
  };

  const getLogs = async () => {
    const res = await get(API_BASE_URL + "logs", token);
    setLogs(res);
  };

  useEffect(() => {
    getPatrolInstances();
    getLogs();
  }, []);

  useEffect(() => {
    if (!patrols) return;
    console.log(patrols);

    let newfilteredPatrols = patrols;
    if (filterPatrolDate !== "All") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      newfilteredPatrols = patrols?.filter((p) => {
        const patrolDate = new Date(p.createdAt);
        if (filterPatrolDate === "Today") {
          return patrolDate.toDateString() === today.toDateString();
        } else if (filterPatrolDate === "Yesterday") {
          return patrolDate.toDateString() === yesterday.toDateString();
        } else {
          // Assuming filterPatrolDate is a specific date in "yyyy-MM-dd" format
          return (
            patrolDate.toDateString() ===
            new Date(filterPatrolDate).toDateString()
          );
        }
      });
    } else {
      newfilteredPatrols = patrols;
    }

    if (filterPatrolsType === "completed" || filterPatrolsType === "pending") {
      setFilteredPatrols(
        newfilteredPatrols?.filter((p) => p.status === filterPatrolsType)
      );
    } else {
      setFilteredPatrols(newfilteredPatrols);
    }
  }, [filterPatrolsType, filterPatrolDate, patrols]);

  const filteredLogs = () => {
    if (!timelineLogs) return [];

    let filtered = timelineLogs;

    if (filterStatus === "All") {
      filtered = timelineLogs;
    }

    if (filterStatus === "Clock Action") {
      filtered = filtered.filter((log) => {
        return filterStatus === "Clock Action"
          ? log.type === "Clock Action"
          : true;
      });
    }

    if (filterStatus === "Guard Action") {
      filtered = filtered.filter((log) => {
        return filterStatus === "Guard Action"
          ? log.type === "Guard Action"
          : true;
      });
    }

    if (filterStatus === "Patrol Action") {
      filtered = filtered.filter((log) => {
        return filterStatus === "Patrol Action"
          ? log.type === "Patrol Action"
          : true;
      });
    }

    if (filterStatus === "Shift Action") {
      filtered = filtered.filter((log) => {
        return filterStatus === "Shift Action"
          ? log.type === "Shift Action"
          : true;
      });
    }

    if (filterDate !== "All") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.createdAt);
        if (filterDate === "Today") {
          return logDate.toDateString() === today.toDateString();
        } else if (filterDate === "Yesterday") {
          return logDate.toDateString() === yesterday.toDateString();
        } else {
          // Assuming filterDate is a specific date in "yyyy-MM-dd" format
          return logDate.toDateString() === new Date(filterDate).toDateString();
        }
      });
    }

    return filtered;
  };

  // Function to render timeline logs
  const renderLogs = () => {
    const logs = filteredLogs();

    return (
      <>
        {logs?.length !== 0 ? (
          <>
            {logs.map((log) => (
              <li key={log._id} className="horizontal-liner">
                <div className="activity">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-3 md:p-[15px]">
                      <div className="text-sm font-semibold">
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                    <div className="hidden md:block dot-wrap | col-span-2 p-[20px]">
                      <div className="dot"></div>
                    </div>
                    <div className="col-span-12 md:col-span-7">
                      <div className="body">
                        <div
                          style={{ borderWidth: "1px" }}
                          className={`text-xs me-2 
                            px-3 py-1.5 rounded-lg dark:bg-gray-700 
                            ${
                              log.type === "Clock Action"
                                ? "bg-blue-50 text-blue-800  border-blue-900"
                                : "bg-gray-50 text-gray-800"
                            }`}
                          role="alert"
                        >
                          <h3 className="title font-semibold">
                            {log.message.includes("clocked in")
                              ? "Clock in"
                              : log.message.includes("clockedout")
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
            ))}
          </>
        ) : (
          <>
            <li className="w-full text-center py-28">
              <p className="body text-gray-600">No Activity</p>
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, {user?.name || "User"}!
        </h1>
      </div>
      <div className="md:hidden">
        <MobileDisplay />
      </div>
      <div className="hidden md:grid grid-cols-12 gap-4">
        <div className="grid grid-cols-4 col-span-12 gap-4">
          <div className="">
            <StatsCard>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Guards
              </h2>
              <div className="flex items-center mt-2">
                <FaUser className="text-gray-600 dark:text-gray-400 text-2xl mr-2 mb-1" />
                <p className="text-3xl  font-semibold text-gray-800 dark:text-gray-200">
                  {guards?.length || 0}
                </p>
              </div>
            </StatsCard>
          </div>
          <div className="">
            <StatsCard>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Number of Beats
              </h2>
              <div className="flex items-center mt-2">
                <FaMap className="text-gray-600 mb-1 dark:text-gray-400 text-2xl mr-2" />
                <p className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                  {beats?.length || 0}
                </p>
              </div>
            </StatsCard>
          </div>
        </div>
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
                  <option value="Clock Action">Clock Action</option>
                  <option value="Patrol Action">Patrol Action</option>
                  <option value="Guard Action">Guard Action</option>
                  <option value="Shift Action">Shift Action</option>
                  {/* Add other status options as needed */}
                </Select>
              </div>
            </div>
            <ul className="activities | text-sm max-h-64  overflow-y-scroll min-h-64">
              {renderLogs()}
            </ul>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Card className="">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Patrols
              </h2>

              <button className="bg-secondary-500 hover:bg-secondary-600 rounded-full text-white py-2 px-4 text-sm">
                See all
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="max-w-md">
                <Select
                  onChange={(e) => setFilterPatrolDate(e.target.value)}
                  id="dates"
                  required
                >
                  <option value="All">All</option>
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                </Select>
              </div>
              <div className="max-w-md">
                <Select
                  onChange={(e) => setFilterPatrolsType(e.target.value)}
                  id="dates"
                  required
                >
                  <option value={""} defaultValue>
                    All
                  </option>
                  <option value={"completed"}>Completed</option>
                  <option value={"pending"}>Pending</option>
                </Select>
              </div>
            </div>

            <div className="flex">
              <Patrols patrols={filteredPatrols} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

const StatsCard = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      {children}
    </div>
  );
};

export default Dashboard;

import axios from "axios";
import { Card, Select, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, ASSET_URL } from "../../../../../constants/api";
import { format } from "date-fns";
import { selectToken } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { get } from "../../../../../lib/methods";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";

const Patrols = () => {
  const [filterPatrolDate, setFilterPatrolDate] = useState("All");
  const { data: guards } = useGetGuardsQuery();
  const { data: beats } = useGetBeatsQuery();

  // Function to render timeline logs
  const [patrols, setPatrols] = useState();
  const [timelineLogs, setLogs] = useState();
  const token = useSelector(selectToken);
  const [filteredPatrols, setFilteredPatrols] = useState([]);

  const [filterPatrolsType, setFilterPatrolsType] = useState();

  const formattedTime = (date) => format(new Date(date), "hh:mm a");
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");
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

  const getPatrolInstances = async () => {
    const res = await get(API_BASE_URL + "patrols/get-instances", token);
    setPatrols(res);
  };

  useEffect(() => {
    getPatrolInstances();
  }, []);
  return (
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
        <div className="overflow-x-auto max-h-64 min-h-64 w-full">
          <Table>
            <Table.Head>
              <Table.HeadCell>Guard name</Table.HeadCell>
              <Table.HeadCell>Time</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y overflow-y-scroll">
              {patrols?.map((patrolInstance) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={patrolInstance._id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full">
                        <img
                          src={`${
                            ASSET_URL + patrolInstance?.guard?.profileImage
                          }`}
                          alt={patrolInstance?.guard?.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {patrolInstance?.guard?.name}
                      <span className="block">
                        {patrolInstance?.patrol?.starttime &&
                          formattedTime(patrolInstance?.patrol?.starttime)}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {patrolInstance?.starttime &&
                      formattedTime(patrolInstance?.starttime)}
                  </Table.Cell>
                  <Table.Cell>
                    {patrolInstance.status === "pending" && (
                      <span className="text-orange-400 uppercase">
                        {patrolInstance.status}
                      </span>
                    )}
                    {patrolInstance.status === "abandoned" && (
                      <span className="text-red-400 uppercase">
                        {patrolInstance.status}
                      </span>
                    )}
                    {patrolInstance.status === "completed" && (
                      <span className="text-green-400">Completed</span>
                    )}
                    <br />
                    <span className="whitespace-nowrap">
                      {patrolInstance?.beat?.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {patrolInstance?.createdAt &&
                      formatDate(patrolInstance?.createdAt)}
                  </Table.Cell>
                </Table.Row>
              ))}
              {(patrols?.length === 0 || !patrols) && (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell
                    colSpan={4}
                    className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
                  >
                    {"No Patrols"}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default Patrols;

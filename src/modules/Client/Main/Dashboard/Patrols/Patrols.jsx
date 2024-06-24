import axios from "axios";
import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, ASSET_URL } from "../../../../../constants/api";
import { format } from "date-fns";
import { selectToken } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { get } from "../../../../../lib/methods";

const Patrols = ({ patrols }) => {
  const formattedTime = (date) => format(new Date(date), "hh:mm a");
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");
  const [mpatrols, setPatrols] = useState();

  const token = useSelector(selectToken);

  const getPatrolInstances = async () => {
    const res = await get(API_BASE_URL + "patrols/get-instances", token);
    if (!patrols) {
      setPatrols(res);
    } else {
      setPatrols(patrols);
    }
  };

  useEffect(() => {
    getPatrolInstances();
  }, []);
  return (
    <>
      <div className="overflow-x-auto max-h-64 min-h-64 w-full">
        <Table>
          <Table.Head>
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y overflow-y-scroll">
            {mpatrols?.map((patrolInstance) => (
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
                  {patrolInstance?.patrol?.starttime &&
                    formattedTime(patrolInstance?.patrol?.starttime)}
                </Table.Cell>
                <Table.Cell>
                  {patrolInstance.status === "pending" && (
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
            {(mpatrols?.length === 0 || !mpatrols) && (
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
    </>
  );
};

export default Patrols;

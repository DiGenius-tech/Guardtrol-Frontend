import { Card, Select, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../redux/selectors/auth";
import { Link } from "react-router-dom";
import { ASSET_URL } from "../../constants/api";
import { useFetchPatrolInstancesQuery } from "../../redux/services/patrol";
import { formatDateTime } from "../../utils/dateUtils";
import { POOLING_TIME } from "../../constants/static";

const Patrols = () => {
  const organization = useSelector(selectOrganization);
  const [filterPatrolDate, setFilterPatrolDate] = useState("All");
  const [filterPatrolsType, setFilterPatrolsType] = useState("");

  const getDateFilter = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (filterPatrolDate) {
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
        return { startDate: undefined, endDate: undefined };
    }
  };

  const {
    data: patrolInstancesApiResponse,
    refetch,
    isFetching: isPatrolInstacesFetching,
    isLoading: isPatrolInstacesLoading,
  } = useFetchPatrolInstancesQuery(
    {
      organizationId: organization,
      ...getDateFilter(),
      ...(filterPatrolsType && { status: filterPatrolsType }),
    },
    {
      pollingInterval: POOLING_TIME,
      skip: !organization,
    }
  );

  // useEffect(() => {
  //   if (organization) {
  //     refetch();
  //   }
  // }, [organization, filterPatrolDate, filterPatrolsType, refetch]);

  const formattedTime = (date) => format(new Date(date), "hh:mm a");
  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");

  return (
    <div className="col-span-12 lg:col-span-6">
      <Card className="">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Patrols
          </h2>
          <Link
            to="/client/reports/history/patrols"
            className="bg-secondary-500 hover:bg-secondary-600 rounded-full text-white py-2 px-4 text-sm"
          >
            See all
          </Link>
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
              id="statuses"
              required
            >
              <option value={""} defaultValue>
                All
              </option>
              <option value={"completed"}>Completed</option>
              <option value={"pending"}>Pending</option>
              <option value={"abandoned"}>Abandoned</option>
            </Select>
          </div>
        </div>
        <div className="flex">
          <div className="overflow-x-auto w-full max-h-64 min-h-64 ">
            <Table>
              <Table.Head>
                <Table.HeadCell>Guard Name</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y overflow-y-scroll">
                {isPatrolInstacesLoading && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell
                      colSpan={4}
                      className="whitespace-nowrap  font-medium  text-center text-gray-900 dark:text-white"
                    >
                      <div className="w-full h-full justify-center flex items-center">
                        <Spinner
                          color="success"
                          aria-label="Success spinner example"
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isPatrolInstacesLoading &&
                  patrolInstancesApiResponse?.patrols?.map((patrolInstance) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={patrolInstance._id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full">
                            <img
                              src={`${
                                patrolInstance.status === "abandoned"
                                  ? ASSET_URL +
                                    patrolInstance?.abandonedby?.profileImage
                                  : ASSET_URL +
                                    patrolInstance?.guard?.profileImage
                              }`}
                              alt={patrolInstance?.guard?.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <span className=" capitalize">
                            {patrolInstance.status === "abandoned"
                              ? patrolInstance?.abandonedby?.name
                              : patrolInstance?.guard?.name}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-center w-20">
                        {patrolInstance?.starttime &&
                          formatDateTime(patrolInstance?.starttime)}
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
                      {/* <Table.Cell className="text-left">
                        {patrolInstance?.createdAt &&
                          formatDateTime(patrolInstance?.createdAt)}
                      </Table.Cell> */}
                    </Table.Row>
                  ))}
                {((!isPatrolInstacesLoading &&
                  patrolInstancesApiResponse?.patrols?.length === 0) ||
                  (!isPatrolInstacesLoading &&
                    !patrolInstancesApiResponse?.patrols)) && (
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
    </div>
  );
};

export default Patrols;

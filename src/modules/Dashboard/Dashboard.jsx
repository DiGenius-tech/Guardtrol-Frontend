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
import { TimelineLogs } from "./TimelineLogs";
import RenewSubscription from "../Settings/RenewSubscription";
import { useGetSubscriptionQuery } from "../../redux/services/subscriptions";
import AuthToolbar from "../Auth/AuthToolbar";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);
  const token = useSelector(selectToken);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data: guards } = useGetGuardsQuery(
    { organization },
    {
      skip: !organization,
    }
  );
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
  const {
    data: subscription,
    isError,
    isFetching: isFetchingActiveSubscription,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, { skip: token ? false : true });

  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss");

  return (
    <div className="px-4">
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
          <StatsCard>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Number of Guards
            </h2>
            <div className="flex items-center mt-2">
              <FaUser className="text-gray-600 dark:text-gray-400 text-2xl mr-2 mb-1" />
              <p className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                {guards?.length || 0}
              </p>
            </div>
          </StatsCard>
          <StatsCard>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Number of Beats
            </h2>
            <div className="flex items-center mt-2">
              <FaMap className="text-gray-600 mb-1 dark:text-gray-400 text-2xl mr-2" />
              <p className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                {beatsApiResponse?.totalBeats || 0}
              </p>
            </div>
          </StatsCard>
        </div>
        <TimelineLogs />
        <Patrols />
      </div>
    </div>
  );
};

const StatsCard = ({ children }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
    {children}
  </div>
);

export default Dashboard;

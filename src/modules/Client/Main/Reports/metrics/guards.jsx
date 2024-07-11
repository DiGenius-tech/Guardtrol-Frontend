import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import Pagination from "../../../../../shared/Pagination/Pagination";
import { selectOrganization } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";

const GuardsMetrics = () => {
  const organization = useSelector(selectOrganization);
  const { data: guards } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (entries) => {
    setEntriesPerPage(entries);
    setCurrentPage(1); // Reset to the first page when entries per page changes
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentGuards = guards?.slice(indexOfFirstEntry, indexOfLastEntry);

  const guardStatusChartOptions = {
    series: guards
      ? guards.reduce(
          (acc, guard) => {
            if (guard.isactive) acc[0] += 1;
            else acc[1] += 1;
            return acc;
          },
          [0, 0]
        )
      : [0, 0],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Active", "Inactive"],
      colors: ["#008080", "#E91E63"],
    },
  };

  const guardDutyChartOptions = {
    options: {
      chart: {
        id: "guard-duty-status",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: ["On Duty", "Off Duty"],
      },
      title: {
        text: "Guard Duty Status",
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#008080", "#E91E63"],
    },
    series: [
      {
        name: "Guards",
        data: [
          guards?.filter((guard) => guard.status === "on duty").length || 0,
          guards?.filter((guard) => guard.status === "off duty").length || 0,
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Key Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold">Total Guards</h3>
            <p className="text-2xl">{guards?.length || 0}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold">Active Guards</h3>
            <p className="text-2xl">
              {guards?.filter((guard) => guard.isactive)?.length || 0}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold">Guards On Duty</h3>
            <p className="text-2xl">
              {guards?.filter((guard) => guard.status === "on duty")?.length ||
                0}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold">Guards Off Duty</h3>
            <p className="text-2xl">
              {guards?.filter((guard) => guard.status === "off duty")?.length ||
                0}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Charts and Visuals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Guard Status</h3>
            <ReactApexChart
              options={guardStatusChartOptions.options}
              series={guardStatusChartOptions.series}
              type="pie"
            />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Guard Duty Status</h3>
            <ReactApexChart
              options={guardDutyChartOptions.options}
              series={guardDutyChartOptions.series}
              type="bar"
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Guard Details</h2>
        <div className="overflow-x-scroll remove-scrollbar relative pb-16 min-h-72">
          <table className="min-w-full bg-white rounded shadow overflow-x-scroll">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-start">Name</th>
                <th className="py-2 px-4 bg-gray-200 text-start">Status</th>
                <th className="py-2 px-4 bg-gray-200 text-start">Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentGuards?.map((guard) => (
                <tr key={guard.id}>
                  <td className="py-2 px-4">{guard.name}</td>
                  <td className="py-2 px-4">{guard.status}</td>
                  <td className="py-2 px-4">{guard.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalEntries={guards?.length || 0}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onEntriesPerPageChange={handleEntriesPerPageChange}
          />
        </div>
      </section>
    </div>
  );
};

export { GuardsMetrics };

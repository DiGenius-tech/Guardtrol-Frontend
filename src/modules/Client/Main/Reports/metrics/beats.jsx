import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import Pagination from "../../../../../shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../../../redux/selectors/auth";
import { Spinner } from "flowbite-react";

const BeatsMetrics = () => {
  const organization = useSelector(selectOrganization);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data: beatsApiResponse, isFetching } = useGetBeatsQuery(
    { organization: organization, page: currentPage, limit: entriesPerPage },
    {
      skip: organization ? false : true,
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (entries) => {
    setEntriesPerPage(entries);
    setCurrentPage(1); // Reset to the first page when entries per page changes
  };

  const beatStatusChartOptions = {
    series: beatsApiResponse
      ? beatsApiResponse?.beats?.reduce(
          (acc, beat) => {
            if (beat.isactive) acc[0] += 1;
            else acc[1] += 1;
            return acc;
          },
          [0, 0]
        )
      : [],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Active", "Inactive"],
      colors: ["#008080", "#E91E63"],
    },
  };

  return (
    <div className="container mx-auto">
      {!isFetching && beatsApiResponse.beats && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <section className="mb-6">
              <h2 className="text-xl font-semibold">Key Metrics</h2>
              <div className="bg-gray-100 p-4 rounded mb-5">
                <h3 className="text-lg font-bold">Total Beats</h3>
                <p className="text-2xl">
                  {beatsApiResponse?.beats?.length || 0}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded mb-5">
                <h3 className="text-lg font-bold">Active Beats</h3>
                <p className="text-2xl">
                  {beatsApiResponse?.beats?.filter((beat) => beat.isactive)
                    .length || 0}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded mb-5">
                <h3 className="text-lg font-bold">Inactive Beats</h3>
                <p className="text-2xl">
                  {beatsApiResponse?.beats?.filter((beat) => !beat.isactive)
                    .length || 0}
                </p>
              </div>
            </section>
            <section className="mb-6">
              <h2 className="text-xl font-semibold">Charts and Visuals</h2>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-2">Beat Status</h3>
                <ReactApexChart
                  options={beatStatusChartOptions.options}
                  series={beatStatusChartOptions.series}
                  type="pie"
                />
              </div>
            </section>
          </div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold">Beat Details</h2>
            <div className="overflow-x-scroll remove-scrollbar relative pb-36">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200 text-start">Name</th>
                    <th className="py-2 px-4 bg-gray-200 text-start">Status</th>
                    <th className="py-2 px-4 bg-gray-200 text-start">
                      Address
                    </th>
                    <th className="py-2 px-4 bg-gray-200 text-start">
                      Guards Assigned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {beatsApiResponse?.beats?.map((beat) => (
                    <tr key={beat._id}>
                      <td className="py-2 px-4">{beat.name}</td>
                      <td className="py-2 px-4">
                        {beat.isactive ? "Active" : "Inactive"}
                      </td>
                      <td className="py-2 px-4">{beat.address}</td>
                      <td className="py-2 px-4">{beat.guards?.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                totalEntries={beatsApiResponse?.totalBeats || 0}
                entriesPerPage={entriesPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEntriesPerPageChange={handleEntriesPerPageChange}
              />
            </div>
          </section>{" "}
        </>
      )}
      {isFetching && (
        <div className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="whitespace-nowrap  font-medium  text-center text-gray-900 dark:text-white">
            <div className="w-full h-full py-11 justify-center flex items-center">
              <Spinner color="success" aria-label="Success spinner example" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { BeatsMetrics };

import React from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";

// Sample data for beats
const beatsData = [
  {
    id: 1,
    name: "Beat A",
    status: "Active",
    address: "123 Main St",
    description: "Description of Beat A",
  },
  {
    id: 2,
    name: "Beat B",
    status: "Inactive",
    address: "456 Elm St",
    description: "Description of Beat B",
  },
  // More beats data here...
];

const BeatsMetrics = () => {
  const { data: beats } = useGetBeatsQuery();

  const beatStatusChartOptions = {
    series: beats?.reduce(
      (acc, beat) => {
        if (beat.isactive) acc[0] += 1;
        else acc[1] += 1;
        return acc;
      },
      [0, 0]
    ),
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Active", "Inactive"],
      colors: ["#008080", "#E91E63"],
    },
  };

  return (
    <div className="container mx-auto ">
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="mb-6">
          <h2 className="text-xl font-semibold">Key Metrics</h2>
          <div className="bg-gray-100 p-4 rounded mb-5">
            <h3 className="text-lg font-bold">Total Beats</h3>
            <p className="text-2xl">{beats?.length || 0}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded mb-5">
            <h3 className="text-lg font-bold">Active Beats</h3>
            <p className="text-2xl">
              {beats?.filter((beat) => beat.isactive).length || 0}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded mb-5">
            <h3 className="text-lg font-bold">Inactive Beats</h3>
            <p className="text-2xl">
              {beats?.filter((beat) => !beat.isactive).length || 0}
            </p>
          </div>
        </section>
        <section className="mb-6 ">
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

      <section className="mb-6 ">
        <h2 className="text-xl font-semibold">Beat Details</h2>
        <table className="min-w-full bg-white rounded shadow overflow-x-scroll">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-start">Name</th>
              <th className="py-2 px-4 bg-gray-200 text-start">Status</th>
              <th className="py-2 px-4 bg-gray-200 text-start">Address</th>
              <th className="py-2 px-4 bg-gray-200 text-start">
                Guards Assigned
              </th>
            </tr>
          </thead>
          <tbody>
            {beats?.map((beat) => (
              <tr key={beat._id}>
                <td className="py-2 px-4">{beat.name}</td>
                <td className="py-2 px-4">
                  {beat.isactive ? "Active" : "InActive"}
                </td>
                <td className="py-2 px-4">{beat.address}</td>
                <td className="py-2 px-4">{beat.guards?.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export { BeatsMetrics };

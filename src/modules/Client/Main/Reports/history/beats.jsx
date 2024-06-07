import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import { Datepicker, Table } from "flowbite-react";

const BeatsHistory = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const exportToExcel = () => {};

  const exportToPdf = async () => {};
  return (
    <div className="container mx-auto">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Guards History</h2>
        <div className="flex space-x-4 mt-4">
          <Datepicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
          />
          <Datepicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
          />
        </div>
      </section>
      <div>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Export to Excel
        </button>
        <button
          onClick={exportToPdf}
          className="bg-red-500 text-white py-2 px-4 rounded mt-4 ml-4"
        >
          Export to PDF
        </button>
      </div>
      <div className="overflow-x-auto mt-5">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Avg Patrols</Table.HeadCell>
            <Table.HeadCell>Avg Clockin</Table.HeadCell>
            <Table.HeadCell>Avg Clockout</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {"Ibrahim"}
              </Table.Cell>
              <Table.Cell>12</Table.Cell>
              <Table.Cell>6:30am</Table.Cell>
              <Table.Cell>6:39pm</Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {"Ibrahim"}
              </Table.Cell>
              <Table.Cell>12</Table.Cell>
              <Table.Cell>6:30am</Table.Cell>
              <Table.Cell>6:39pm</Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {"Ibrahim"}
              </Table.Cell>
              <Table.Cell>12</Table.Cell>
              <Table.Cell>6:30am</Table.Cell>
              <Table.Cell>6:39pm</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export { BeatsHistory };

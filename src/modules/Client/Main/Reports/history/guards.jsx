import React, { useState, useEffect } from "react";
import { Datepicker, Table } from "flowbite-react";
import ReactApexChart from "react-apexcharts";
import "tailwindcss/tailwind.css";
import { useGetGuardsQuery } from "../../../../../redux/services/guards";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";

const GuardsHistory = () => {
  const { data: guards } = useGetGuardsQuery();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredGuards, setFilteredGuards] = useState([]);

  useEffect(() => {
    if (guards) {
      const filtered = guards.filter((guard) => {
        const guardDate = new Date(guard.date); // Assuming guard object has a date field
        return (
          (!startDate || guardDate >= startDate) &&
          (!endDate || guardDate <= endDate)
        );
      });
      setFilteredGuards(filtered);
    }
  }, [guards, startDate, endDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGuards);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guards History");
    XLSX.writeFile(workbook, "guards_history.xlsx");
  };

  const exportToPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    let yPosition = height - fontSize * 2;

    page.drawText("Guards History Report", {
      x: 50,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    yPosition -= fontSize * 2;

    filteredGuards.forEach((guard, index) => {
      page.drawText(`${index + 1}. ${guard.name} - ${guard.phone}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "guards_history.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartOptions = {
    chart: {
      type: "line",
    },
    xaxis: {
      categories: filteredGuards.map((guard) => guard.name),
    },
    title: {
      text: "Guards Activity Over Time",
    },
  };

  const chartSeries = [
    {
      name: "Activity",
      data: filteredGuards.map((guard) => guard.activity || 0), // Assuming `guard` has an `activity` field
    },
  ];

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
      <div className=" max-h-80 mt-5">
        {/* <Table striped>
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
        </Table> */}
      </div>
    </div>
  );
};

export { GuardsHistory };

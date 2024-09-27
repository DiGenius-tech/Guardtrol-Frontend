import React from "react";
import { CSVLink } from "react-csv";

const sampleData = [
  { full_name: "John Doe", phone: "1234567890" },
  { full_name: "Jane Smith", phone: "0987654321" },
];

const headers = [
  { label: "Full Name", key: "full_name" },
  { label: "Phone Number", key: "phone" },
];

const SampleFileDownload = () => {
  return (
    <CSVLink data={sampleData} headers={headers} filename={"sample_guards.csv"}>
      Download Sample File
    </CSVLink>
  );
};

export default SampleFileDownload;

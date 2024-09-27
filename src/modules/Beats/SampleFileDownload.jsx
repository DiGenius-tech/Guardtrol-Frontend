import React from "react";
import { CSVLink } from "react-csv";

const sampleData = [
  { Name: "Beat 1", Address: "123 Main St", Description: "description" },
  { Name: "Beat 2", Address: "456 Elm St", Description: "description" },
];

const headers = [
  { label: "Name", key: "Name" },
  { label: "Address", key: "Address" },
  { label: "Description", key: "Description" },
];

const SampleFileDownload = () => {
  return (
    <CSVLink data={sampleData} headers={headers} filename={"sample_beats.csv"}>
      Download Sample File
    </CSVLink>
  );
};

export default SampleFileDownload;

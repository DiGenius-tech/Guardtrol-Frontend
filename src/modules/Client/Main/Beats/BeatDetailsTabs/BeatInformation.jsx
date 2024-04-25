import React, { useState } from "react";
import ViewBeatInformation from "./ViewBeatInformation";
import EditBeatInformation from "./EditBeatInformation";

const BeatInformation = ({ beat }) => {
  const [page, setPage] = useState("");
  return (
    <div>
      {(page === "ViewBeatInformation" || page === "") && (
        <ViewBeatInformation beat={beat} setPage={setPage} />
      )}
      {page === "EditBeatInformation" && (
        <EditBeatInformation beat={beat} setPage={setPage} />
      )}
    </div>
  );
};

export default BeatInformation;

import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";

const list_of_patrols = [
  {
    id: "1",
    name: "Route from gate to end of fence",
    startTime: "06:30 am",
    endTime: "09:30 am",
  },
  {
    id: "2",
    name: "Route within compound area",
    startTime: "09:00 pm",
    endTime: "06:00 am",
  },
];

const BeatPoint = () => {
  const [listOfPatrols, setlistOfPatrols] = useState(list_of_patrols);

  return (
    <div className="flex flex-row gap-6 my-5">
      <h2>Beats point page</h2>
    </div>
  );
};

export default BeatPoint;

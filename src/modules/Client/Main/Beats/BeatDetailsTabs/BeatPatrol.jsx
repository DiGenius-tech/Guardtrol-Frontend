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

const BeatPatrol = () => {
  const [listOfPatrols, setlistOfPatrols] = useState(list_of_patrols);

  return (
    <div className="flex flex-row gap-6 my-5">
      {listOfPatrols.map((shift) => {
        return (
          <li key={shift.id} className="col-span-3 list-none">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <h3 className="font-bold">{shift.name}</h3>
                  <h3 className="text-dark-400">By Ibrahim haruna</h3>
                  <p className="text-dark-200">
                    {shift.startTime}&nbsp;-&nbsp;{shift.endTime}
                  </p>
                </div>
                <Dropdown
                  label=""
                  placement="right"
                  dismissOnClick={false}
                  renderTrigger={() => (
                    <button type="button" className="flex w-8 justify-end">
                      <img src={icon_menu_dots} alt="menu" />
                    </button>
                  )}
                >
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default BeatPatrol;

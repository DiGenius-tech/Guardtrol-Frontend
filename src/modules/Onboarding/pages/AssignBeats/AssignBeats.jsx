import React, { useState } from "react";
import { Link } from "react-router-dom";
import SelectField from "../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";

const beatList = [
  {
    id: 1,
    title: "First floor"
  },
  {
    id: 2,
    title: "Second floor"
  },
  {
    id: 3,
    title: "Third floor"
  },

];

const guardList = [
  {
    id: 1,
    title: "Adewale Quadri",
    phone_number: "0803892890",
    status: 0
  },
  {
    id: 2,
    title: "Abisola Josiah",
    phone_number: "0807800822",
    status: 1
  }
];
const frequencyList = [
  {
    id: 1,
    title: "Every 30 mins"
  },
  {
    id: 2,
    title: "Every 60 mins"
  }
];

const AssignBeats = () => {
  const initialBeatState = beatList[0];
  const initialGuardState = guardList[0];
  const initialFrequencyState = frequencyList[0];
  const [beat, setBeat] = useState(initialBeatState);
  const [guard, setGuard] = useState(initialGuardState);
  const [frequency, setFrequency] = useState(initialFrequencyState);
  const handleBeatSelection = (e) => {
    setBeat(JSON.parse(e.target.value));
  };

  const handleGuardSelection = (e) => {
    setGuard(JSON.parse(e.target.value));
  };

  const handleFrequencySelection = (e) => {
    setFrequency(JSON.parse(e.target.value));
  };

  return (
    <>
      {/* assign-beats-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Assign Beats
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        This is just a subtext to support the topic above
      </p>

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-16">
        <form>
          {/*  */}
          <div className="mb-6">
            <SelectField
              id="beat"
              label="Select beat"
              semibold_label={true}
              handleChangeOption={handleBeatSelection}
              optionList={beatList}
              multipleSelect={true}
            />
          </div>

          <div className="mb-6">
            <SelectField
              multiSelect={
                beatList.length >= 10 ? beatList.length - 5 : beatList.length
              }
              id="guard"
              label="Select guard"
              semibold_label={true}
              handleChangeOption={handleGuardSelection}
              optionList={guardList}
            />
          </div>

          <div className="mb-6">
            <SelectField
              id="frequency"
              label="Select frequency"
              semibold_label={true}
              handleChangeOption={handleFrequencySelection}
              optionList={frequencyList}
            />
          </div>

          <RegularButton text="Finish Onboarding" />
        </form>
      </div>
    </>
  );
};

export default AssignBeats;

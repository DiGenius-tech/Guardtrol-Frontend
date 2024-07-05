import React, { useState, useEffect } from "react";
import { useGetBeatsQuery } from "../../../../../redux/services/beats";
import MultiSelectField from "../../../../Sandbox/SelectField/MultiSelectField";
import { toast } from "react-toastify";

const AssignBeatsToUser = ({ selectedBeats, setSelectedBeats }) => {
  const { data: beats, error } = useGetBeatsQuery();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch beats");
    }
  }, [error]);

  const handleBeatSelection = (selectedOptions) => {
    setSelectedBeats(selectedOptions);
  };

  return (
    <div className="mb-6">
      <MultiSelectField
        selectedOptions={selectedBeats}
        setSelectedOptions={setSelectedBeats}
        value={selectedBeats}
        name="beats"
        multiple={true}
        id="beats"
        multipleSelect={true}
        label="Select Beats"
        semibold_label={true}
        handleChangeOption={handleBeatSelection}
        optionList={beats?.map((beat) => ({
          value: beat._id,
          name: beat.name,
        }))}
      />
    </div>
  );
};

export default AssignBeatsToUser;

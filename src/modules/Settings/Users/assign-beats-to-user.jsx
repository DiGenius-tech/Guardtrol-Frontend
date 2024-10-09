import React, { useState, useEffect } from "react";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import MultiSelectField from "../../Sandbox/SelectField/MultiSelectField";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import { POOLING_TIME } from "../../../constants/static";

const AssignBeatsToUser = ({ selectedBeats, setSelectedBeats }) => {
  const organization = useSelector(selectOrganization);

  const { data: beatsApiResponse, error } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

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
        onChange={handleBeatSelection}
        optionList={beatsApiResponse?.beats?.map((beat) => ({
          value: beat?._id,
          _id: beat?._id,
          name: beat?.name,
        }))}
      />
    </div>
  );
};

export default AssignBeatsToUser;

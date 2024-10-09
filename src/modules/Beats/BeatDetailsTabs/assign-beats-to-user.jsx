import React, { useState, useEffect } from "react";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import MultiSelectField from "../../Sandbox/SelectField/MultiSelectField";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import { useGetGuardsQuery } from "../../../redux/services/guards";
import { useParams } from "react-router-dom";
import { POOLING_TIME } from "../../../constants/static";

const AssignGuardToPatrol = ({ selectedGuards, setSelectedGuards }) => {
  const organization = useSelector(selectOrganization);
  const { beatId } = useParams();
  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const [selectedBeat, setSelectedBeat] = useState({});

  useEffect(() => {
    setSelectedBeat(beatsApiResponse?.beats?.find((b) => b?._id === beatId));
  }, [beatsApiResponse]);

  const handleBeatSelection = (selectedOptions) => {
    setSelectedGuards(selectedOptions);
  };

  return (
    <div className="mb-6">
      <MultiSelectField
        selectedOptions={selectedGuards}
        setSelectedOptions={setSelectedGuards}
        value={selectedGuards}
        name="guars"
        multiple={true}
        id="beats"
        multipleSelect={true}
        label="Select Guards"
        semibold_label={true}
        onChange={handleBeatSelection}
        optionList={selectedBeat?.guards?.map((beat) => ({
          value: beat._id,
          _id: beat._id,
          name: beat.name,
        }))}
      />
    </div>
  );
};

export default AssignGuardToPatrol;

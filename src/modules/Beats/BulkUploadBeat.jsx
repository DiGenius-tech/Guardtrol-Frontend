import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { selectOrganization } from "../../redux/selectors/auth";
import {
  useAddBeatsMutation,
  useGetBeatsQuery,
} from "../../redux/services/beats";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import SampleFileDownload from "./SampleFileDownload";
import { useGetSubscriptionQuery } from "../../redux/services/subscriptions";

function BulkUploadBeats() {
  const [beats, setBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const organization = useSelector(selectOrganization);
  const [addBeats] = useAddBeatsMutation();
  const navigate = useNavigate();

  const { data: sub } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  const {
    data: beatsApiResponse,
    isUninitialized,
    refetch: refetchBeats,
  } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setBeats(
        jsonData.map((jd) => ({
          beat_name: jd.Name,
          description: jd.Description,
          address: jd.Address,
        }))
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const validateBeats = () => {
    const errors = [];
    const names = new Set();

    beats.forEach((beat, index) => {
      const { beat_name, address, description } = beat;

      if (!beat_name || `${beat_name}`.trim().length === 0) {
        errors.push(`Row ${index + 1}: Name is required.`);
      } else if (names.has(beat_name)) {
        errors.push(`Row ${index + 1}: Duplicate Name "${beat_name}".`);
      } else if (beatsApiResponse?.beats.find((b) => b.name === beat_name)) {
        errors.push(
          `Row ${
            index + 1
          }: Duplicate Name "${beat_name}" A Beat has been created with this name.`
        );
      } else {
        names.add(beat_name);
      }

      if (!address || `${address}`.trim().length === 0) {
        errors.push(`Row ${index + 1}: Address is required.`);
      }
    });

    return errors;
  };

  const handleUpload = async () => {
    if (beatsApiResponse?.beats?.length + beats?.length > sub?.maxbeats) {
      return Swal.fire({
        title: "OOPS!! You've ran out of Beat(s)",
        text: "You do not have enough Beat(s) to process bulk upload?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        confirmButtonText: "Subscribe for more!",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/client/settings/billing");
        }
      });
    }

    const validationErrors = validateBeats();

    if (validationErrors?.length > 0) {
      Swal.fire("Validation Errors", validationErrors?.join("\n"), "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to upload the beats.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upload them!",
    });

    if (confirm.isConfirmed) {
      setIsLoading(true);
      try {
        const { data } = await addBeats({ organization, beats });
        if (data) {
          toast("Beats uploaded successfully");
          navigate(-1);
        }
      } catch (error) {
        toast.error("An error occurred while uploading beats");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h2 className="text-xl font-bold mb-4">Bulk Upload Beats</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {beats.length > 0 && (
        <div className="mt-4 overflow-x-auto max-h-56 overflow-y-scroll">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-start border-gray-200">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-start border-gray-200">
                  Description
                </th>
                <th className="py-2 px-4 border-b text-start border-gray-200">
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {beats.map((beat, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {beat.beat_name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {beat.description}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {beat.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <RegularButton
          text="Upload Beats"
          onClick={handleUpload}
          disabled={isLoading || beats.length === 0}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-4">
        <SampleFileDownload />
      </div>
    </div>
  );
}

export default BulkUploadBeats;

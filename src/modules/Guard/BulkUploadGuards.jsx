import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import SampleFileDownload from "./SampleFileDownload";
import { selectOrganization } from "../../redux/selectors/auth";
import {
  useAddGuardsMutation,
  useGetGuardsQuery,
} from "../../redux/services/guards";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { useGetSubscriptionQuery } from "../../redux/services/subscriptions";

function BulkUploadGuards() {
  const [guards, setGuards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const organization = useSelector(selectOrganization);
  const [addGuards] = useAddGuardsMutation();
  const navigate = useNavigate();
  const {
    data: guardsApiResponse,
    refetch: refetchGuards,
    isUninitialized,
    error,
  } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const { data: sub } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData);

      setGuards(
        jsonData.map((jd) => ({
          full_name: jd?.["Full Name"],
          phone: jd?.["Phone Number"],
        }))
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const validateGuards = () => {
    const errors = [];
    const names = new Set();
    const phones = new Set();

    guards.forEach((guard, index) => {
      const { full_name, phone } = guard;
      console.log(guard);

      if (!full_name || `${full_name}`?.trim().length === 0) {
        errors.push(`Row ${index + 1}: Full Name is required.`);
      } else if (names.has(full_name)) {
        errors.push(`Row ${index + 1}: Duplicate Full Name "${full_name}".`);
      } else if (guardsApiResponse.find((g) => g.name === full_name)) {
        errors.push(
          `Row ${
            index + 1
          }: Duplicate Full Name "${full_name}", A Guard has been created with this name.`
        );
      } else {
        names.add(full_name);
      }

      if (!phone || `${phone}`?.trim().length === 0) {
        errors.push(`Row ${index + 1}: Phone Number is required.`);
      } else if (!/^\d{8,15}$/.test(phone)) {
        errors.push(`Row ${index + 1}: Phone Number "${phone}" is invalid.`);
      } else if (phones.has(phone)) {
        errors.push(`Row ${index + 1}: Duplicate Phone Number "${phone}".`);
      } else {
        phones.add(phone);
      }
    });

    return errors;
  };

  const handleUpload = async () => {
    if (
      guardsApiResponse?.length + guards?.length >
      sub?.maxbeats * 5 + sub?.maxextraguards
    ) {
      return Swal.fire({
        title: "OOPS!! You've ran out of Extra Guard(s)",
        text: "You do not have enough Extra Guard(s) to process bulk upload?",
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
    const validationErrors = validateGuards();

    if (validationErrors.length > 0) {
      Swal.fire("Validation Errors", validationErrors.join("\n"), "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to upload the guards.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upload them!",
    });

    if (confirm.isConfirmed) {
      setIsLoading(true);
      try {
        const { data } = await addGuards({ organization, guards });
        if (data) {
          toast("Guards uploaded successfully");
          navigate(-1);
        }
      } catch (error) {
        toast.error("An error occurred while uploading guards");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h2 className="text-xl font-bold mb-4">Bulk Upload Guards</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {guards.length > 0 && (
        <div className="mt-4 overflow-x-auto  max-h-56 overflow-y-scroll">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left border-gray-200">
                  Full Name
                </th>
                <th className="py-2 px-4 border-b text-left border-gray-200">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {guards.map((guard, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {guard.full_name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {guard.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <RegularButton
          text="Upload Guards"
          onClick={handleUpload}
          disabled={isLoading || guards.length === 0}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-4">
        <SampleFileDownload />
      </div>
    </div>
  );
}

export default BulkUploadGuards;

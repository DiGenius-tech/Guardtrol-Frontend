import React, { useEffect, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import ShiftConfigForm from "./ShiftConfigForm/ShiftConfigForm";
import {
  useDeleteShiftMutation,
  useGetShiftsQuery,
} from "../../../../../redux/services/shifts";
import { useDeleteBeatMutation } from "../../../../../redux/services/beats";
import Swal from "sweetalert2";
import EditShiftModal from "./EditShift";

const list_of_shifts = [
  {
    id: "1",
    name: "Early morning shift",
    startTime: "06:30 am",
    endTime: "09:30 am",
  },
  {
    id: "2",
    name: "Night shift",
    startTime: "09:00 pm",
    endTime: "06:00 am",
  },
];

const SettingShiftSchedule = () => {
  const [listOfShifts, setlistOfShifts] = useState(list_of_shifts);
  const [shiftToEdit, setShiftToEdit] = useState();
  const [openEditShiftModal, setEditShiftModal] = useState(false);

  const { data: shifts, refetch: refetchShifts } = useGetShiftsQuery();
  const [deleteShift] = useDeleteShiftMutation();

  const handleEditShift = (editshift) => {
    setShiftToEdit(editshift);
    setEditShiftModal(true);
  };
  const handleEditShiftClose = () => {
    setEditShiftModal(false);
    setShiftToEdit();
  };

  const [shift, setShift] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });
  const [formData, setFormData] = useState({
    numberOfShift: "",
    shift: [],
  });

  const handleNumberOfShiftChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShiftData = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  const handleAddShiftToList = (e) => {
    e.preventDefault();
    for (const key in shift) {
      if (Object.hasOwnProperty.call(shift, key)) {
        const element = shift[key];
        if (!element) return;
      }
    }
    setlistOfShifts([
      ...listOfShifts,
      { id: (listOfShifts?.length + 1).toString(), ...shift },
    ]);
    setShift({
      name: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleDelete = async (shiftToDelete) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await deleteShift(shiftToDelete._id);
          console.log(data);
          refetchShifts();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${shiftToDelete?.name || "Shift"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {}
  };

  return (
    <>
      {shiftToEdit && (
        <EditShiftModal
          shiftToEdit={shiftToEdit}
          openModal={openEditShiftModal}
          closeEditShiftModal={handleEditShiftClose}
        />
      )}
      {/* setting-shift-schedule-app works! */}
      <div className="max-w-4xl">
        <div className="grid grid-cols-12 gap-4 sm:gap-8">
          <div className="hidden sm:block col-span-12 sm:col-span-5">
            <h3 className="font-bold">Create Shift</h3>
          </div>
          <div className="col-span-12 sm:col-span-7">
            <ShiftConfigForm />
          </div>
          <div className="hidden sm:block col-span-12 sm:col-span-5">
            <h3 className="font-bold">Shifts List</h3>
          </div>
          <div className="col-span-12 sm:col-span-7">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                {/* list of configured shifts */}
                {shifts?.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2">
                    {shifts?.map((shift) => {
                      return (
                        <li key={shift._id} className="col-span-1">
                          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <h3 className="font-bold">{shift?.name}</h3>
                                <p className="text-dark-200">
                                  {shift?.start}&nbsp;-&nbsp;{shift?.end}
                                </p>
                              </div>
                              <Dropdown
                                label=""
                                placement="right"
                                dismissOnClick={false}
                                renderTrigger={() => (
                                  <button
                                    type="button"
                                    className="flex w-8 justify-end"
                                  >
                                    <img src={icon_menu_dots} alt="menu" />
                                  </button>
                                )}
                              >
                                <Dropdown.Item
                                  onClick={() => handleEditShift(shift)}
                                >
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleDelete(shift)}
                                >
                                  Remove
                                </Dropdown.Item>
                              </Dropdown>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className=" h-28 w-full flex flex-row justify-center items-center">
                    <span className=" text-gray-400  font-medium text-md">
                      No Shifts
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Shift configuration form */}
          </div>
        </div>
        <div className="my-4"></div>
      </div>
    </>
  );
};

export default SettingShiftSchedule;

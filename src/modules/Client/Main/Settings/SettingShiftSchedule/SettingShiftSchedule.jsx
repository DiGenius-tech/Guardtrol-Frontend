import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import Swal from "sweetalert2";
import {
  useDeleteShiftMutation,
  useGetShiftsQuery,
} from "../../../../../redux/services/shifts";
import ShiftConfigForm from "./ShiftConfigForm/ShiftConfigForm";
import EditShiftModal from "./EditShift";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import Pagination from "../../../../../shared/Pagination/Pagination";

const SettingShiftSchedule = () => {
  const [shiftToEdit, setShiftToEdit] = useState();
  const [openEditShiftModal, setEditShiftModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const { data: shifts, refetch: refetchShifts } = useGetShiftsQuery();
  const [deleteShift] = useDeleteShiftMutation();

  const handleEditShift = (editShift) => {
    setShiftToEdit(editShift);
    setEditShiftModal(true);
  };

  const handleEditShiftClose = () => {
    setEditShiftModal(false);
    setShiftToEdit();
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

  const paginatedShifts = shifts?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <>
      {shiftToEdit && (
        <EditShiftModal
          shiftToEdit={shiftToEdit}
          openModal={openEditShiftModal}
          closeEditShiftModal={handleEditShiftClose}
        />
      )}
      <div className="pr-2 max-h-[58vh] overflow-y-scroll w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div className="">
            <h3 className="font-bold">Create Shift</h3>
          </div>
          <div className="">
            <ShiftConfigForm />
          </div>
          <div className="">
            <h3 className="font-bold">Shifts List</h3>
          </div>
          <div className="">
            <div className="grid grid-cols-12 gap-4 relative pb-16">
              <div className="col-span-12">
                {paginatedShifts?.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2">
                    {paginatedShifts?.map((shift) => (
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
                    ))}
                  </ul>
                ) : (
                  <div className="h-28 w-full flex flex-row justify-center items-center">
                    <span className="text-gray-400 font-medium text-md">
                      No Shifts
                    </span>
                  </div>
                )}
              </div>
              <Pagination
                totalEntries={shifts?.length || 0}
                entriesPerPage={entriesPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onEntriesPerPageChange={setEntriesPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingShiftSchedule;

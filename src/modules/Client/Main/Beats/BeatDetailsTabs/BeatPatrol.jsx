import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import CreatePatrolSubscription from "../../Patrol/CreatePatrol";
import CreatePatrol from "../../Patrol/CreatePatrol";
import {
  useDeletePatrolsMutation,
  useGetPatrolsQuery,
} from "../../../../../redux/services/patrol";
import Swal from "sweetalert2";

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
  const [openCreatePatrolModal, setOpenCreatePatrolModal] = useState(false);

  const { data: patrols, refetch: refetchPatrols } = useGetPatrolsQuery();

  const [deletePatrol] = useDeletePatrolsMutation();

  const handleDelete = async (patrolToDelete) => {
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
          const { data } = await deletePatrol(patrolToDelete._id);
          console.log(data);
          refetchPatrols();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${patrolToDelete?.name || "Patrol"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
      // console.log(patrolToDelete);
      // const data = await deleteBeat({ pointId: patrolToDelete._id });
      // setOpen(false);
      // toast("Beat deleted");
      // console.log(data);
    } catch (error) {}
  };
  return (
    <>
      <CreatePatrol
        openModal={openCreatePatrolModal}
        setOpenCreatePatrolModal={setOpenCreatePatrolModal}
      />
      <div
        onClick={() => setOpenCreatePatrolModal(true)}
        className=" fixed z-10 bottom-8 right-4 cursor-pointer"
      >
        <div
          style={{ backgroundColor: "#008080" }}
          className="ml-auto border  h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md"
        >
          +
        </div>
      </div>
      <div className="flex flex-row gap-6 my-5">
        {patrols?.map((patrol) => {
          return (
            <li key={patrol.id} className="col-span-3 list-none">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className=" h-32 w-40">
                    <h3 className="font-bold">{patrol.name}</h3>
                    <p className="text-dark-200 mb-2">{patrol?.time}</p>
                    {patrol?.points?.map((point) => (
                      <h3 className="text-dark-400">{point?.name}</h3>
                    ))}
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
                    <Dropdown.Item onClick={() => handleDelete(patrol)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default BeatPatrol;

import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import CreatePoint from "../../Points/CreatePoint";
import {
  useDeletePointsMutation,
  useGetPointsQuery,
} from "../../../../../redux/services/points";
import Swal from "sweetalert2";

const list_of_patrols = [
  {
    id: "1",
    name: "North fence wall",
    coordinates: "122.122",
    description: "Fence beside express",
  },
  {
    id: "2",
    name: "Main gate 1",
    coordinates: "122.122",
    description: "Main extate gat outer path",
  },
];

const BeatPoint = () => {
  const [openCreatePointModal, setOpenCreatePointModal] = useState(false);

  const [listOfPoints, setlistOfPoints] = useState(list_of_patrols);
  const { data: points, refetch: refetchPoints } = useGetPointsQuery();
  const [deletePoint] = useDeletePointsMutation();

  const handleDelete = async (pointToDelete) => {
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
          const { data } = await deletePoint(pointToDelete._id);
          console.log(data);
          refetchPoints();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${pointToDelete?.name || "Point"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
      // console.log(pointToDelete);
      // const data = await deleteBeat({ pointId: pointToDelete._id });
      // setOpen(false);
      // toast("Beat deleted");
      // console.log(data);
    } catch (error) {}
  };
  return (
    <>
      <CreatePoint
        openModal={openCreatePointModal}
        setOpenCreatePointModal={setOpenCreatePointModal}
      />
      <div
        onClick={() => setOpenCreatePointModal(true)}
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
        {points?.map((point) => {
          return (
            <li key={point._id} className="col-span-3 list-none">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex   flex-col gap-5 items-start justify-between text-sm min-w-36">
                  <div className="rounded-md bg-gray-500 h-36 w-full"></div>

                  <div className="flex flex-row justify-between w-full">
                    <div>
                      <h3 className="font-medium  text-base">{point.name}</h3>
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
                      <Dropdown.Item onClick={() => handleDelete(point)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </div>
    </>
  );
};

export default BeatPoint;

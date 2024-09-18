import React, { useState } from "react";
import { Dropdown, Spinner } from "flowbite-react";
import Swal from "sweetalert2";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import {
  useDeletePointsMutation,
  useGetPointsQuery,
} from "../../../redux/services/points";
import Pagination from "../../../shared/Pagination/Pagination";
import { ASSET_URL } from "../../../constants/api";
import { useParams } from "react-router-dom";

const BeatPoint = () => {
  const [openCreatePointModal, setOpenCreatePointModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const { beatId } = useParams();
  const {
    data: points,
    refetch: refetchPoints,
    isLoading,
  } = useGetPointsQuery();
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
    } catch (error) {
      console.error(error);
    }
  };

  const paginatedPoints = points
    ?.filter((pat) => pat.beat === beatId)
    ?.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  return (
    <div className="relative pb-16">
      {/* <CreatePoint
        openModal={openCreatePointModal}
        setOpenCreatePointModal={setOpenCreatePointModal}
      /> */}
      {/* <div
        onClick={() => setOpenCreatePointModal(true)}
        className="fixed z-10 bottom-8 right-4 cursor-pointer"
      >
        <div
          style={{ backgroundColor: "#008080" }}
          className="ml-auto border h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md"
        >
          +
        </div>
      </div> */}
      {isLoading && (
        <div className="w-full h-full justify-center flex items-center">
          <Spinner color="success" aria-label="Success spinner example" />
        </div>
      )}
      {((!isLoading && paginatedPoints?.length === 0) ||
        (!isLoading && !paginatedPoints)) && (
        <div className="w-full h-full py-20 justify-center flex items-center text-gray-700 font-semibold">
          {"No Points"}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-6 my-5">
        {paginatedPoints?.map((point) => (
          <div key={point._id} className="col-span-1 list-none">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col gap-5 items-start justify-between text-sm min-w-36">
                {point?.image ? (
                  <div
                    style={{
                      backgroundImage: `url(${ASSET_URL + point?.image})`,
                    }}
                    className="rounded-md bg-cover bg-center h-36 w-full"
                  ></div>
                ) : (
                  <div className="rounded-md bg-gray-500 h-36 w-full"></div>
                )}
                <div className="flex flex-row justify-between w-full">
                  <div>
                    <h3 className="font-medium text-base capitalize">
                      {point.name}
                    </h3>
                    <p className="text-gray-500 capitalize">
                      {point.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {JSON.parse(point.coordinates).latitude +
                        " " +
                        JSON.parse(point.coordinates).longitude}
                    </p>
                  </div>
                  {/* <Dropdown
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
                  </Dropdown> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalEntries={points?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export default BeatPoint;

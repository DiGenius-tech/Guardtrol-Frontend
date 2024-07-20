import { Dropdown, Spinner } from "flowbite-react";
import React, { useState } from "react";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import {
  useDeletePatrolsMutation,
  useGetPatrolsQuery,
} from "../../../redux/services/patrol";
import Swal from "sweetalert2";
import Pagination from "../../../shared/Pagination/Pagination";
import { format, parseISO } from "date-fns";
import { useParams } from "react-router-dom";

const BeatPatrol = () => {
  const [openCreatePatrolModal, setOpenCreatePatrolModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const { beatId } = useParams();
  const {
    data: patrols,
    refetch: refetchPatrols,
    isLoading,
  } = useGetPatrolsQuery();
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
    } catch (error) {
      console.error(error);
    }
  };

  const paginatedPatrols = patrols
    ?.filter((pat) => pat.beat === beatId)
    ?.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  return (
    <div div className="relative pb-16">
      {/* <CreatePatrol
        openModal={openCreatePatrolModal}
        setOpenCreatePatrolModal={setOpenCreatePatrolModal}
      /> */}
      <div
        onClick={() => setOpenCreatePatrolModal(true)}
        className="fixed z-10 bottom-8 right-4 cursor-pointer"
      >
        <div
          style={{ backgroundColor: "#008080" }}
          className="ml-auto border h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md"
        >
          +
        </div>
      </div>
      {isLoading && (
        <div className="w-full h-full justify-center flex items-center">
          <Spinner color="success" aria-label="Success spinner example" />
        </div>
      )}
      {((!isLoading && paginatedPatrols?.length === 0) ||
        (!isLoading && !paginatedPatrols)) && (
        <div className="w-full h-full py-20 justify-center flex items-center text-gray-700 font-semibold">
          {"No Patrols"}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {!isLoading &&
          paginatedPatrols?.map((patrol) => (
            <div key={patrol.id} className="col-span-1 list-none">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col gap-3 items-start justify-between text-sm">
                  <h3 className="font-bold capitalize">{patrol.name}</h3>
                  <p className="text-dark-200 mb-2">{`${
                    patrol?.time &&
                    parseISO(patrol?.time) &&
                    format(parseISO(patrol?.time), "HH:mm:ss")
                  } `}</p>
                  {patrol?.points?.map((point, index) => (
                    <h3 key={index} className="text-dark-400">
                      {point?.name}
                    </h3>
                  ))}
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
            </div>
          ))}
      </div>
      <Pagination
        totalEntries={patrols?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export default BeatPatrol;

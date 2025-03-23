import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Spinner, Dropdown, Card, Button } from "flowbite-react";
import Swal from "sweetalert2";
import Pagination from "../../../shared/Pagination/Pagination";
import { format, parseISO } from "date-fns";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import { selectAuth, selectOrganization } from "../../../redux/selectors/auth";
import {
  useGetBreaksQuery,
  useDeleteBreakMutation,
} from "../../../redux/services/breaks";
import { POOLING_TIME } from "../../../constants/static";
import CreateBreakForm from "./CreateBreakForm";

const BeatBreaks = () => {
  const organization = useSelector(selectOrganization);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [openCreateBreakModal, setOpenCreateBreakModal] = useState(false);
  const { beatId } = useParams();
  const { user } = useSelector(selectAuth);

  const {
    data: breaksData,
    refetch: refetchBreaks,
    isLoading,
  } = useGetBreaksQuery(
    { beatId, page: currentPage, limit: entriesPerPage },
    {
      pollingInterval: POOLING_TIME,
    }
  );

  const [deleteBreak] = useDeleteBreakMutation();

  const handleDelete = async (breakToDelete) => {
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
          const { data } = await deleteBreak(breakToDelete._id);
          refetchBreaks();
          if (data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: `Break has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete break");
    }
  };

  const paginatedBreaks = breaksData?.breaks || [];
  
  return (
    <div className="relative pb-16">
      <CreateBreakForm 
        openModal={openCreateBreakModal} 
        setOpenModal={setOpenCreateBreakModal} 
      />
      
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Break Definitions</h2>
        <Button 
          style={{ backgroundColor: "#008080" }} 
          onClick={() => setOpenCreateBreakModal(true)}
        >
          Add Break
        </Button>
      </div>
      
      {isLoading && (
        <div className="w-full h-full justify-center flex items-center">
          <Spinner color="success" aria-label="Success spinner example" />
        </div>
      )}
      
      {((!isLoading && paginatedBreaks?.length === 0) ||
        (!isLoading && !paginatedBreaks)) && (
        <div className="w-full h-full py-20 justify-center flex items-center text-gray-700 font-semibold">
          {"No Breaks Defined"}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {!isLoading &&
          paginatedBreaks.map((breakItem) => (
            <div key={breakItem._id} className="col-span-1 list-none">
              <Card className="relative">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{breakItem.name}</h3>
                    <span className="text-blue-600 font-medium">{breakItem.minutes} minutes</span>
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    Created: {format(parseISO(breakItem.createdAt), "MMM d, yyyy")}
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <button type="button" className="flex w-8 justify-end">
                          <img src={icon_menu_dots} alt="menu" />
                        </button>
                      )}
                    >
                      <Dropdown.Item onClick={() => handleDelete(breakItem)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </div>
      
      <Pagination
        totalEntries={breaksData?.totalPages ? breaksData.totalPages * entriesPerPage : 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
};

export default BeatBreaks;
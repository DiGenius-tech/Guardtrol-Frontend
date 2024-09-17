import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Spinner, TextInput } from "flowbite-react";
import icon_menu_dots from "../../images/icons/icon-menu-dots.svg";
import { beat_list } from "./beat-list";
import BeatsDesktopView from "./BeatsDesktopView";
import BeatsMobileView from "./BeatsMobileView";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHttpRequest from "../../shared/Hooks/HttpRequestHook";

import EditBeat from "./EditBeat";
import {
  useDeleteBeatMutation,
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../redux/selectors/auth";
import Swal from "sweetalert2";
import Pagination from "../../shared/Pagination/Pagination";
import { POOLING_TIME } from "../../constants/static";
import { useDebouncedValue } from "../../utils/assetHelper";

const BeatList = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [beatToEdit, setBeatToEdit] = useState(null);
  const [beatToDelete, setBeatToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const organization = useSelector(selectOrganization);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebouncedValue(searchQuery);

  const {
    data: beatsApiResponse,
    refetch: refetchBeats,
    isLoading,
    isFetching,
    error,
  } = useGetBeatsQuery(
    {
      organization,
      limit: entriesPerPage,
      page: currentPage,

      ...(debouncedSearchQuery && { searchQuery: debouncedSearchQuery }),
    },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const [deleteBeat, { isLoading: isDeleting, deleteStatus }] =
    useDeleteBeatMutation();

  const [updateBeat, { isLoading: isUpdating, status: updateStatus }] =
    useUpdateBeatMutation();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleUpdateBeat = async (beat) => {
    const data = await updateBeat(beat);

    if (data && data.status) {
      toast("Changes Saved Successfully");
      setOpenModal(false);
      setBeatToEdit(null);
    }
  };

  const handleDelete = async (beatToDelete) => {
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
          const { data } = await deleteBeat({
            beatId: beatToDelete._id,
            organization,
          });
          console.log(data);
          refetchBeats();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${beatToDelete?.name || "Beat"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
      // console.log(beatToDelete);
      // const data = await deleteBeat({ beatId: beatToDelete._id });
      // setOpen(false);
      // toast("Beat deleted");
      // console.log(data);
    } catch (error) {}
  };

  return (
    <div className="relative  pb-40">
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <div className="min-w-40 max-w-64 flex justify-start items-end">
          <h2 className=" text-2xl font-bold">All Beats</h2>
          <label
            htmlFor="entriesPerPage"
            className="text-base font-medium text-gray-400"
          >
            Total: {beatsApiResponse.totalBeats || 0}
          </label>
        </div>

        <div className="flex justify-end items-center gap-3 flex-wrap ">
          <div className="min-w-40 max-w-64 h-10">
            <TextInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Beat Name"
            />
          </div>
          <Button
            className="bg-[#008080] text-white px-4 rounded min-w-28 h-10"
            onClick={() => navigate("add/create")}
          >
            New Beat
          </Button>
          <Button
            onClick={refetchBeats}
            className="bg-[#008080] text-white px-4 rounded min-w-28 h-10"
            disabled={isFetching}
          >
            {isFetching ? (
              <Spinner
                aria-label="Loading spinner"
                className="mr-2"
                size="sm"
                light
              />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>
      <div className="fixed z-10 bottom-8 right-4">
        <Link
          to={"add/create"}
          className="ml-auto border bg-secondary-500 h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md"
        >
          +
        </Link>
      </div>
      <div className="hidden sm:block">
        <Card>
          <BeatsDesktopView
            beatList={beatsApiResponse?.beats}
            icon_menu_dots={icon_menu_dots}
            openModal={openModal}
            setOpenModal={setOpenModal}
            beatToEdit={beatToEdit}
            isLoading={isLoading}
            setBeatToEdit={setBeatToEdit}
            handleUpdateBeat={handleUpdateBeat}
            setSelectedBeat={setSelectedBeat}
            setOpen={setOpen}
            open={open}
            setBeatToDelete={setBeatToDelete}
            handleDeleteBeat={handleDelete}
          />
        </Card>
      </div>

      <div className="sm:hidden  min-h-64">
        <BeatsMobileView
          beatList={beatsApiResponse?.beats}
          icon_menu_dots={icon_menu_dots}
          openModal={openModal}
          setOpenModal={setOpenModal}
          beatToEdit={beatToEdit}
          isLoading={isLoading}
          setBeatToEdit={setBeatToEdit}
          handleUpdateBeat={handleUpdateBeat}
          setSelectedBeat={setSelectedBeat}
          setOpen={setOpen}
          open={open}
          setBeatToDelete={setBeatToDelete}
          handleDeleteBeat={handleDelete}
        />
      </div>

      <Pagination
        totalEntries={beatsApiResponse?.totalBeats || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
      <EditBeat
        openModal={openModal}
        setOpenModal={setOpenModal}
        beatToEdit={beatToEdit}
        setBeatToEdit={setBeatToEdit}
        handleUpdateBeat={handleUpdateBeat}
      />
    </div>
  );
};

export default BeatList;

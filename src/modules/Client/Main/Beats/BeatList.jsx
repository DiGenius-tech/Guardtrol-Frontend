import React, { useContext, useEffect, useState } from "react";
import { Card } from "flowbite-react";
import icon_menu_dots from "../../../../images/icons/icon-menu-dots.svg";
import { beat_list } from "./beat-list";
import BeatsDesktopView from "./BeatsDesktopView";
import BeatsMobileView from "./BeatsMobileView";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";

import EditBeat from "./EditBeat";
import {
  useDeleteBeatMutation,
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../../redux/services/beats";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/selectors/auth";

const BeatList = () => {
  const user = useSelector(selectUser);

  const [selectedBeat, setSelectedBeat] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [beatToEdit, setBeatToEdit] = useState(null);
  const [beatToDelete, setBeatToDelete] = useState(null);

  const { data: beats, isLoading, error } = useGetBeatsQuery();

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
  const handleDelete = async () => {
    try {
      console.log(beatToDelete);
      const data = await deleteBeat({ beatId: beatToDelete._id });
      setOpen(false);
      toast("Beat deleted");
      console.log(data);
    } catch (error) {}
  };

  return (
    <>
      {/* beat-list-app works! */}

      <div className="fixed z-10 bottom-8 right-4">
        <Link
          to={"add"}
          className="ml-auto border bg-secondary-500 h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md"
        >
          +
        </Link>
      </div>
      <div className="hidden sm:block">
        <Card>
          <BeatsDesktopView
            beatList={beats}
            icon_menu_dots={icon_menu_dots}
            openModal={openModal}
            setOpenModal={setOpenModal}
            beatToEdit={beatToEdit}
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

      <div className="sm:hidden">
        <BeatsMobileView
          beatList={beats}
          icon_menu_dots={icon_menu_dots}
          openModal={openModal}
          setOpenModal={setOpenModal}
          beatToEdit={beatToEdit}
          setBeatToEdit={setBeatToEdit}
          handleUpdateBeat={handleUpdateBeat}
          setSelectedBeat={setSelectedBeat}
          setOpen={setOpen}
          open={open}
          setBeatToDelete={setBeatToDelete}
          handleDeleteBeat={handleDelete}
        />
      </div>

      <EditBeat
        openModal={openModal}
        setOpenModal={setOpenModal}
        beatToEdit={beatToEdit}
        setBeatToEdit={setBeatToEdit}
        handleUpdateBeat={handleUpdateBeat}
      />
    </>
  );
};

export default BeatList;

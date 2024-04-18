import React, { useState } from 'react';
import { Card } from "flowbite-react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { beat_list } from "../beat-list";
import BeatsDesktopView from "../BeatsDesktopView/BeatsDesktopView";
import BeatsMobileView from "../BeatsMobileView/BeatsMobileView";
import { Link } from 'react-router-dom';
import EditBeat from '../EditBeat/EditBeat';

const BeatList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [beatToEdit, setBeatToEdit] = useState(null);

    const handleUpdateBeat = (Beat) => {
        console.log("Beat: ", Beat)
    }
    return (
        <>
            {/* beat-list-app works! */}

            <div className="fixed z-10 bottom-8 right-4">
                <Link to={"add"} className="ml-auto border bg-secondary-500 h-12 w-12 p-2 flex items-center justify-center text-lg font-bold rounded-full text-white shadow-md">
                    +
                </Link>
            </div>
            <div className="hidden sm:block">
                <Card>
                    <BeatsDesktopView beatList={beat_list} icon_menu_dots={icon_menu_dots}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        beatToEdit={beatToEdit}
                        setBeatToEdit={setBeatToEdit}
                        handleUpdateBeat={handleUpdateBeat}
                    />
                </Card>
            </div>

            <div className="sm:hidden">
                <BeatsMobileView beatList={beat_list} icon_menu_dots={icon_menu_dots}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    beatToEdit={beatToEdit}
                    setBeatToEdit={setBeatToEdit}
                    handleUpdateBeat={handleUpdateBeat}
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
}

export default BeatList;

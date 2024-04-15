import React from 'react';
import { Card } from "flowbite-react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { beat_list } from "../beat-list";
import BeatsDesktopView from "../BeatsDesktopView/BeatsDesktopView";
import BeatsMobileView from "../BeatsMobileView/BeatsMobileView";
import { Link } from 'react-router-dom';

const BeatList = () => {
    return (
        <>
            {/* beat-list-app works! */}

            <div className="flex mb-4">
                {/* <Link to={"configure-beat"} className="ml-auto border bg-primary-500 p-2 text-sm rounded-lg text-white shadow-md">
                    Configure beat
                </Link> */}
                <Link to={"/onboarding/configure-beats/"} className="ml-auto border bg-primary-500 p-2 text-sm rounded-lg text-white shadow-md">
                    Configure beat
                </Link>
            </div>
            <div className="hidden sm:block">
                <Card>
                    <BeatsDesktopView beatList={beat_list} icon_menu_dots={icon_menu_dots} />
                </Card>
            </div>

            <div className="sm:hidden">
                <BeatsMobileView beatList={beat_list} icon_menu_dots={icon_menu_dots} />
            </div>
        </>
    );
}

export default BeatList;

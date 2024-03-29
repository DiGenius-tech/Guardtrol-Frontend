import React, { useState } from 'react';
import PointModalMobile from '../PointModalMobile/PointModalMobile';

const routeList = [
    {
        id: 1,
        title: "Prince Bella Hotels & Tours",
        address: "No 14 Modupe Shitta street, Off Liasu Road close to Synagogue Church, Lagos 100265",
        point: "point-1",
        mapLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.738038640648!2d3.276644774644562!3d6.554718793438388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8fc27a7b025f%3A0xfe809984750c8912!2sPrince%20Bella%20Hotels%20%26%20Tours!5e0!3m2!1sen!2sng!4v1711464853318!5m2!1sen!2sng`
    },
    {
        id: 2,
        title: "Sugarland Hotel and Suites",
        point: "point-2",
        address: "Onile Wura, 8/10 Ajayi Close, Liasu Rd, Ikotun, Lagos",
        mapLink: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.768155155137!2d3.272475396789555!3d6.550929000000022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8fea17de5ccb%3A0x8633a3fc85cacf3b!2sSugarland%20Hotel%20and%20Suites!5e0!3m2!1sen!2sng!4v1711467333676!5m2!1sen!2sng`
    }
]

const PatrolRouteSelectionForMobile = () => {
    const initialState = routeList[0]
    const [route, setRoute] = useState(initialState);
    const [openModal, setOpenModal] = useState(false);
    const modalSize = 'lg';
    return (
        <>
            {/* patrol-route-selection-for-mobile-app works! */}

            <div id="configure-patrol-route-action">
                <button type="button" className="flex items-start gap-2 w-full my-10" onClick={() => setOpenModal(!openModal)}>
                    <span>
                        <span className="flex flex-col justify-center items-start">
                            <span className="flex w-full font-semibold">Patrol route </span>
                            <span className="flex w-full text-dark-300 mt-1">Configure the patrol route</span>
                        </span></span>
                </button>
            </div>


            <PointModalMobile route={route} openModal={openModal} setOpenModal={setOpenModal} modalSize={modalSize} />

        </>
    );
}

export default PatrolRouteSelectionForMobile;

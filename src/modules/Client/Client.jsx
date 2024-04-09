import React, { useState } from 'react';
import ClientToolbar from './components/ClientToolbar/ClientToolbar';
import ClientSidebar from './components/ClientSidebar/ClientSidebar';
import Main from './Main/Main';
import { Outlet } from 'react-router-dom';
import brandLogo from "../../images/brand-logo.svg";
import "./Client.scss";
import { HiX } from 'react-icons/hi';

const Client = () => {
    const [isOpenSidenav, setIsOpenSidenav] = useState(false);

    const handleOpenSidenav = () => {
        setIsOpenSidenav(!isOpenSidenav)
    }

    console.log(handleOpenSidenav)
    return (
        <>
            {/* client-app works! */}

            <div className="layout">
                <div className='sticky top-0 left-0 right-0 z-40'>
                    <ClientToolbar handleOpenSidenav={handleOpenSidenav} isOpenSidenav={isOpenSidenav} />
                </div>
                <div className='grid grid-cols-12 h-full'>
                    <div className="col-span-12 md:col-span-2">
                        {
                            isOpenSidenav ? <div onClick={handleOpenSidenav} className="sm:hidden backdrop-brightness-50 fixed top-0 bottom-0 left-0 right-0"></div> : ""
                        }
                        <div className=
                            {(isOpenSidenav ? "-left-0 md:left-0 " : "left-full md:left-0 ") + "sidebar | h-full fixed md:relative top-0 bottom-0 w-3/4 md:w-full pt-4 z-40 bg-white"}
                        >
                            <div className='md:hidden px-4 py-2 flex items-center justify-between'>
                                <div className='w-28'>
                                    <img src={brandLogo} alt="Guardtrol" />
                                </div>
                                <button onClick={handleOpenSidenav}>
                                    <HiX />
                                </button>
                            </div>
                            <ClientSidebar />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-10">
                        <div className="main p-2 sm:p-4">
                            <Main />
                        </div>
                    </div>
                </div>
            </div>





            {/* <div className='sticky top-0 left-0 right-0 z-40'>
                <ClientToolbar />
            </div>
            <div className='min-h-screen bg-[#faffff] grid grid-cols-12 gap-2'>
                <div className='col-span-12 md:col-span-2'>
                    <div className="sidebar backdrop-brightness-50" style={{ position: "absolute", zIndex: "10", left: "0", width: "100%", bottom: "0", top: "0", height:"100%" }}>
                    <ClientSidebar />
                    </div>
                </div>

                <div className='col-span-12 md:col-start-3 md:col-end-12 py-2'>
                    <Main />
                </div>

            </div> */}
        </>
    );
}


export default Client;

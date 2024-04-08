import React from 'react';
import ClientToolbar from './components/ClientToolbar/ClientToolbar';
import ClientSidebar from './components/ClientSidebar/ClientSidebar';
import Main from './Main/Main';
import { Outlet } from 'react-router-dom';

const Client = () => {
    return (
        <>
            {/* client-app works! */}
            <div className='sticky top-0 left-0 right-0 z-40'>
                <ClientToolbar />
            </div>
            <div className='min-h-screen bg-[#faffff] grid grid-cols-12 gap-2'>
                <div className='col-span-12 md:col-span-2'>
                    <ClientSidebar />
                </div>

                <div className='col-span-12 md:col-start-3 md:col-end-12 py-2'>
                    <Main />
                </div>


            </div></>
    );
}


export default Client;

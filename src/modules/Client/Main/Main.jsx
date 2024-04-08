import React from 'react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <>
            {/* main-app works! */}
            <Outlet />
        </>
    );
}

export default Main;

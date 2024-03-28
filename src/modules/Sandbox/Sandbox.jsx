import React from 'react';
import { Outlet } from 'react-router-dom';

const Sandbox = () => {
    return (
        <div>
            {/* sandbox-app works! */}
            <Outlet/>
        </div>
    );
}

export default Sandbox;

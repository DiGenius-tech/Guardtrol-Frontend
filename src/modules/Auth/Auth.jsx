import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthToolbar from './components/AuthToolbar/AuthToolbar';

const Auth = () => {
    return (
        <>
            {/* auth-app works! */}
            <AuthToolbar />
            <Outlet />
        </>
    );
}

export default Auth;

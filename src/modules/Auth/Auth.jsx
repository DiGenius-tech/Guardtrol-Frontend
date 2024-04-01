import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthToolbar from './components/AuthToolbar/AuthToolbar';

const Auth = () => {
    return (
        <>
            <div className='min-h-screen'>
                {/* auth-app works! */}
                <AuthToolbar />
                <Outlet />
            </div>
        </>
    );
}

export default Auth;

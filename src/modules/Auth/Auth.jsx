import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthToolbar from './components/AuthToolbar/AuthToolbar';
import MobileAppBar from '../../shared/MobileAppBar/MobileAppBar';

const Auth = () => {
    return (
        <>
            <div className='min-h-screen'>
                {/* auth-app works! */}
                <AuthToolbar />
                <Outlet />
                <MobileAppBar />
            </div>
        </>
    );
}

export default Auth;

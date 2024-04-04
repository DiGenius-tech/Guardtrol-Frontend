import React, { useContext, useEffect } from 'react';
import OnboardingToolbar from './components/OnboardingToolbar/OnboardingToolbar';
import { Outlet, useNavigate } from 'react-router-dom';
import OnboardingProgressBar from './components/OnboardingProgressBar/OnboardingProgressBar';
import { AuthContext } from '../../shared/Context/AuthContext';

const Onboarding = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(null != auth.isLoggedIn){
        if (!auth.isLoggedIn) {
            navigate('/auth')
        } 
    }
    }, [auth.isLoggedIn])
    return (
        <>
            {/* onboarding-app works! */}
            <OnboardingToolbar />
            <OnboardingProgressBar />
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </>
    );
}

export default Onboarding;

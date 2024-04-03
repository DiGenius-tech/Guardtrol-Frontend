import React from 'react';
import OnboardingToolbar from './components/OnboardingToolbar/OnboardingToolbar';
import { Outlet } from 'react-router-dom';
import OnboardingProgressBar from './components/OnboardingProgressBar/OnboardingProgressBar';

const Onboarding = () => {
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

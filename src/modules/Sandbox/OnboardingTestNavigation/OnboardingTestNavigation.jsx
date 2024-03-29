import React from 'react';
import { Link } from 'react-router-dom';

const OnboardingTestNavigation = ({ completeProcess, location }) => {
    return (
        <div>
            {/* onboarding-test-navigation-app works! */}



            <p className="text-red-400 font-bold text-center text-2">
                {location.pathname}
            </p>
            <div className="border rounded-lg p-4 border-primary my-4 shadow-sm">
                <div className="bg-primary-50 mt-6 rounded p-2">
                    <Link to={"/onboarding/membership"}>membership</Link> |{" "}
                    <Link to={"/onboarding/configure-beats"}>configure-beats</Link> |{" "}
                    <Link to={"/onboarding/onboard-guard"}>onboard-guard</Link> |{" "}
                    <Link to={"/onboarding/assign-beats"}>assign-beats</Link>
                </div>


                <p className="text-center pt-4">
                    <button
                        onClick={completeProcess}
                        type="submit"
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Complete Process
                    </button>
                </p>
            </div>
        </div>
    );
}

export default OnboardingTestNavigation;

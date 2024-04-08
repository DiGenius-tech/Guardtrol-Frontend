import { Card } from 'flowbite-react';
import React from 'react';

const Dashboard = () => {
    return (
        <>
            {/* dashboard-app works! */}
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-5">
                    <Card>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Timeline of Activities
                        </h1>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                        </p>
                    </Card>
                </div>
                <div className="col-span-12 sm:col-span-7">
                    <Card>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Patrols
                        </h2>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                        </p>
                    </Card>
                </div>
            </div>

        </>
    );
}

export default Dashboard;

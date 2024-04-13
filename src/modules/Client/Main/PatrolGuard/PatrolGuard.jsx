import { Tabs } from 'flowbite-react';
import React from 'react';
import "./PatrolGuard.scss";

const PatrolGuard = () => {
    return (
        <>
            {/* patrol-guard-app works! */}


            <div className="patrol-guard">
                <Tabs aria-label="Tabs with underline" style="underline">
                    <Tabs.Item active title="Guards">
                        <p>Guards</p>
                    </Tabs.Item>
                    <Tabs.Item title="Sent requests">
                        <p>Sent requests</p>
                    </Tabs.Item>
                </Tabs>
            </div>
        </>
    );
}

export default PatrolGuard;

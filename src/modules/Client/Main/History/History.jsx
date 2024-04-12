import { Tabs } from 'flowbite-react';
import React from 'react';
import ClockInHistory from './ClockInHistory/ClockInHistory';
import ClockOutHistory from './ClockOutHistory/ClockOutHistory';
import OutOnBreakHistory from './OutOnBreakHistory/OutOnBreakHistory';
import PatrolsHistory from './PatrolsHistory/PatrolsHistory';

const History = () => {
    return (
        <div>
            {/* history-app works! */}


            <Tabs aria-label="Tabs with underline" style="underline">
                <Tabs.Item active title="Clock in">
                    <ClockInHistory />
                </Tabs.Item>
                <Tabs.Item title="Clock out">
                    <ClockOutHistory />
                </Tabs.Item>
                <Tabs.Item title="Out on break">
                    <OutOnBreakHistory />
                </Tabs.Item>
                <Tabs.Item title="Patrols">
                    <PatrolsHistory />
                </Tabs.Item>
            </Tabs>
        </div>
    );
}

export default History;

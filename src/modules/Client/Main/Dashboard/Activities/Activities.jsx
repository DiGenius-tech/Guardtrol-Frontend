import React from 'react';
import "./Activities.scss";


const activityList = [
    {
        id: 1,
        time: "9:00AM",
        body: "Totam optio illo unde quod dolore quisquam minima distinctio voluptate alias. Magnam enim temporibus, voluptas voluptate quibusdam commodi.",
        isClockedIn: 0
    },
    {
        id: 2,
        time: "9:00AM",
        body: "Amet, fugiat porro error sunt, illum vitae id possimus provident impedit hic ab.",
        isClockedIn: 1
    },
    {
        id: 3,
        time: "9:00AM",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quasi quis veniam dolores fugiat.", isClockedIn: 1
    }
]

const activity_status = {
    CLOCKED_IN: 1,
    CLOCKED_OUT: 0,
}

const Activities = () => {
    return (
        <>
            {/* activities-app works! */}

            <ul className='activities | text-sm'>
                {
                    activityList.map((activity) => {
                        return <li>
                            <div className="activity">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-3 p-[15px]">
                                        <div className="text-sm font-semibold">{activity.time}</div>
                                    </div>
                                    <div className="dot-wrap | col-span-2 p-[20px]">
                                        <div className="dot"></div>
                                    </div>
                                    <div className="col-span-7">
                                        <div className="body">
                                            {/* <div class="p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert"> */}
                                            <div class="
                                            bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-1 rounded-lg dark:bg-gray-700 dark:text-green-400 border border-[#aae3fd]" role="alert">
                                                {activity.body}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    })
                }
                {/* <li>
                    <div className="activity">
                        <div className="date">9:00 AM</div>
                        <div className="body">
                            <div className="dot"></div>
                            <div>
                                Thomas Prosper has <span>taken a break</span>
                            </div>
                        </div>
                    </div>
                </li> */}
            </ul>
        </>
    );
}

export default Activities;

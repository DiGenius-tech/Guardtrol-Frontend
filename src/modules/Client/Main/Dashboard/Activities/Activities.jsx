import React from "react";
import "./Activities.scss";

const activityList = [
  {
    id: 1,
    time: "9:00AM",
    title: "Totam optio illo",
    body: "Totam optio illo unde quod dolore quisquam minima distinctio voluptate alias. Magnam enim temporibus, voluptas voluptate quibusdam commodi.",
    activityStatus: 1900
  },
  {
    id: 2,
    time: "9:00AM",
    title: "Thomas Prosper Clocked Out",
    body: "“The electrician came to check the devices that developed fault in the compound and he said he’ll be come back tomorrow to fix it, please me see to the device is fixed”",
    activityStatus: 1800
  },
  {
    id: 3,
    time: "9:00AM",
    title: "Thomas Prosper has taken a break",
    body: "",
    activityStatus: 1000
  }
];

const activity_status = {
  CLOCKED_IN: 1900,
  CLOCKED_OUT: 1800,
  BREAK: 1000
};

const Activities = () => {
  return (
    <>
      {/* activities-app works! */}

      <ul className="activities | text-sm">
        {activityList.map((activity) => {
          return (
            <li key={activity.id}>
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
                      {/* <div className="p-4 mb-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert"> */}
                      <div
                        className={
                          (activity.activityStatus ===
                          activity_status.CLOCKED_IN
                            ? "clocked-in "
                            : "") +
                          (activity.activityStatus ===
                          activity_status.CLOCKED_OUT
                            ? "clocked-out "
                            : "") +
                          (activity.activityStatus === activity_status.BREAK
                            ? "break "
                            : "") +
                          `text-xs me-2 
                            px-3 py-1.5 rounded-lg dark:bg-gray-700 
                            dark:text-green-400`
                        }
                        role="alert"
                      >
                        <h3 className="title font-semibold">{activity.title}</h3>
                        <p className="body">{activity.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
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
};

export default Activities;

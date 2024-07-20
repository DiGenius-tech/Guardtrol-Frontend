import { Card, Dropdown } from "flowbite-react";
import icon_building_regular from "../../../images/icons/icon-building-regular.svg";
import { useEffect, useState } from "react";
import { randomHexColor } from "../../../shared/functions/random-hex-color";

function AssignedBeat(props) {
  useEffect(() => {}, []);

  return (
    <>
      {/* assigned-beat-app works! */}
      <Card>
        <div className="h-full w-full hover:bg-gray-50 p-2.5 rounded-lg">
          <div className="grid grid-cols-12 gap-3 items-center justify-between">
            <div className="col-span-2">
              <div className="w-8">
                <img src={icon_building_regular} alt="Location marker" />
              </div>
            </div>
            <div className="col-span-9">
              <h3 className="text-dark-450 font-semibold text-base">
                {props?.assigned_beat?.name}
                {/* Commodi eligendi iste, quo quasi voluptatibus */}
              </h3>
              <p className="text-sm text-gray-400">
                {props?.assigned_beat?.description}
                {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Voluptatem fuga delectus expedita... */}
              </p>
              <div className="my-1.5"></div>
              <ul className="flex items-center ms-1.5">
                {props?.assigned_beat?.guards.length > 0 ? (
                  props?.assigned_beat?.guards.map((guard) => {
                    return (
                      <li key={guard._id} className="-ms-1.5">
                        <div
                          style={{
                            backgroundColor: randomHexColor(),
                            color: "white",
                          }}
                          className={
                            "h-7 w-7 rounded-full overflow-hidden border-2 flex items-center justify-center"
                          }
                        >
                          {guard.profile_image ? (
                            <img
                              src={guard.profile_image}
                              alt="profile image"
                            />
                          ) : (
                            <p className="m-0 font-semibold">
                              {guard?.name?.slice(0, 1).toUpperCase()}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="-ms-1.5">No Guards Assigned Yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default AssignedBeat;

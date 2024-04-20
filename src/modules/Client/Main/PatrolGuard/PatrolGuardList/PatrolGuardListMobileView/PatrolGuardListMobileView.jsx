import { Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";

function PatrolGuardListMobileView(props) {
  return (
    <>
      {/* patrol-guard-list-mobile-view-app works! */}

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sr-only text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {props.patrol_guards?.map((guard) => {
              return (
                <tr
                  key={guard.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img src={guard.profileImage} alt={guard.name} />
                    </div>
                  </th>
                  <td className="p-2">
                    <div>
                      <div>
                        <Link to={`details/${guard.id}`}>{guard.name}</Link>
                      </div>
                      <small className="text-dark-250">{guard.email}</small>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <div>{guard.phone}</div>
                        <div>
                          {guard.dutyStatus === props.duty_status.OFF_DUTY ? (
                            <span className="text-yellow-300 font-semibold">
                              Off duty
                            </span>
                          ) : guard.dutyStatus === props.duty_status.ON_DUTY ? (
                            <span className="text-green-300 font-semibold">
                              On duty
                            </span>
                          ) : (
                            <span className="text-gray-300 font-semibold">
                              Null
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Dropdown
                          label=""
                          placement="right"
                          dismissOnClick={false}
                          renderTrigger={() => (
                            <button className="flex w-8 justify-end">
                              <img src={props.icon_menu_dots} alt="menu" />
                            </button>
                          )}
                        >
                          <Dropdown.Item>
                            <Link
                              to={`/client/patrol-guard/details/${guard.id}`}>Edit guard</Link>
                          </Dropdown.Item>
                          <Dropdown.Item>Assign guard to beat</Dropdown.Item>
                          <Dropdown.Item>Deactivate</Dropdown.Item>
                        </Dropdown>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PatrolGuardListMobileView;

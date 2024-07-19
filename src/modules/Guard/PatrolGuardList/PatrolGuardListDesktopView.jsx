import { Dropdown, Spinner } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ASSET_URL } from "../../../constants/api";

function PatrolGuardListDesktopView(props) {
  const navigate = useNavigate();

  const location = useLocation();
  return (
    <>
      {/* patrol-guard-list-desktop-view-app works! */}
      {!props.guards?.length ? (
        <div className="bg-white p-8 rounded ">
          <p className="text-gray-700 text-center">No Guards Here Yet</p>
        </div>
      ) : (
        <div className="patrol-guard-list-table">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Guard Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Phone Number
                  </th>
                  {/* <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Email address
                </th> */}
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.isLoading && (
                  <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td
                      colSpan={4}
                      className="whitespace-nowrap  font-medium  text-center text-gray-900 dark:text-white"
                    >
                      <div className="w-full h-full py-11 justify-center flex items-center">
                        <Spinner
                          color="success"
                          aria-label="Success spinner example"
                        />
                      </div>
                    </td>
                  </tr>
                )}
                {!props.isLoading &&
                  props?.guards?.map((guard) => {
                    return (
                      <tr
                        key={guard._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td>
                          <Link
                            to={`/client/patrol-guard/details/${guard._id}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={`${
                                    guard.profileImage
                                      ? ASSET_URL + guard.profileImage
                                      : ""
                                  }`}
                                  className=" h-full w-full"
                                  alt={guard?.name}
                                />
                              </div>
                              {guard?.name}
                              <span className="block sm:hidden">
                                <br />
                                {/* {time} */}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4"> {guard.phone}</td>
                        {/* <td className="px-6 py-4"> {guard.email}</td> */}
                        <td className="px-6 py-4">
                          {guard.status === "off-duty" ||
                          guard.status === "off duty" ? (
                            <span className="text-yellow-300 font-semibold">
                              Off Duty
                            </span>
                          ) : guard.status === "on-duty" ||
                            guard.status === "on duty" ? (
                            <span className="text-green-300 font-semibold">
                              On Duty
                            </span>
                          ) : (
                            <span className="text-gray-300 font-semibold">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
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
                                to={`/client/patrol-guard/details/${guard._id}`}
                              >
                                Edit Guard
                              </Link>
                            </Dropdown.Item>
                            {location.pathname.includes("/beats/details/") && (
                              <Dropdown.Item>
                                <button
                                  onClick={() =>
                                    props.handleUnAssignGuard(guard)
                                  }
                                >
                                  Unassign Guard
                                </button>
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item>
                              <button
                                onClick={() => props.handleDeleteGuard(guard)}
                              >
                                Delete Guard
                              </button>
                            </Dropdown.Item>
                            {/* <Dropdown.Item>Assign guard to beat</Dropdown.Item> */}
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
export default PatrolGuardListDesktopView;

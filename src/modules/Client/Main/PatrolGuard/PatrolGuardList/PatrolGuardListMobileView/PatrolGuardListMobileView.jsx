import { Dropdown, Spinner } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { ASSET_URL } from "../../../../../../constants/api";

function PatrolGuardListMobileView(props) {
  const location = useLocation();
  return (
    <>
      {/* patrol-guard-list-mobile-view-app works! */}
      {props?.guards?.length < 1 ? (
        <div className="bg-white p-8 rounded ">
          <p className="text-gray-700 text-center">No Guards Here Yet</p>
        </div>
      ) : (
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
                      <th
                        scope="row"
                        className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
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
                      </th>
                      <td className="p-2">
                        <div>
                          <div>
                            <Link
                              to={`/client/patrol-guard/details/${guard._id}`}
                            >
                              {guard?.name}
                            </Link>
                          </div>
                          <small className="text-dark-250">{guard.email}</small>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end">
                            <div>{guard.phone}</div>
                            <div>
                              {guard.dutyStatus === "off-duty" ? (
                                <span className="text-yellow-300 font-semibold">
                                  Off duty
                                </span>
                              ) : guard.dutyStatus === "on-duty" ? (
                                <span className="text-green-300 font-semibold">
                                  On duty
                                </span>
                              ) : (
                                <span className="text-gray-300 font-semibold">
                                  Suspended
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
                                  to={`/client/patrol-guard/details/${guard._id}`}
                                >
                                  Edit guard
                                </Link>
                              </Dropdown.Item>
                              {location.pathname.includes(
                                "/beats/details/"
                              ) && (
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
                                <Link
                                  onClick={() => props.handleDeleteGuard(guard)}
                                >
                                  Delete Guard
                                </Link>
                              </Dropdown.Item>
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
      )}
    </>
  );
}

export default PatrolGuardListMobileView;

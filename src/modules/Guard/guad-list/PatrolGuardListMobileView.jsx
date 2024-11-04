import { Dropdown, Spinner } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { ASSET_URL } from "../../../constants/api";
import { useGetUserOrganizationRoleQuery } from "../../../redux/services/role";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";

function PatrolGuardListMobileView(props) {
  const organization = useSelector(selectOrganization);

  const location = useLocation();
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  return (
    <>
      {/* patrol-guard-list-mobile-view-app works! */}
      {props?.guards?.length < 1 ? (
        <div className="bg-white p-8 rounded ">
          <p className="text-gray-700 text-center">No Guards Here Yet</p>
        </div>
      ) : (
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sr-only text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Guard name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="">
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
                    className="bg-white border-b  overflow-visible dark:bg-gray-800 dark:border-gray-700"
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
                            {guard.status === "off-duty" ||
                            guard.status === "off duty" ? (
                              <span className="text-yellow-300 font-semibold">
                                Off duty
                              </span>
                            ) : guard.status === "on-duty" ||
                              guard.status === "on duty" ? (
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
                                Edit Guard
                              </Link>
                            </Dropdown.Item>
                            {location.pathname.includes("/beats/details/") && (
                              <>
                                <Dropdown.Item>
                                  <button
                                    onClick={() =>
                                      props.handleUnAssignGuard(guard)
                                    }
                                  >
                                    Unassign Guard
                                  </button>
                                </Dropdown.Item>
                                {guard.status === "on duty" && (
                                  <Dropdown.Item>
                                    <button
                                      onClick={() =>
                                        props.handleClockoutGuard(guard)
                                      }
                                    >
                                      Clock out
                                    </button>
                                  </Dropdown.Item>
                                )}
                              </>
                            )}
                            {(userRole?.name == "Owner" ||
                              userRole?.name == "Manager") && (
                              <Dropdown.Item>
                                <button
                                  onClick={() => props.handleDeleteGuard(guard)}
                                >
                                  Delete Guard
                                </button>
                              </Dropdown.Item>
                            )}
                          </Dropdown>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default PatrolGuardListMobileView;

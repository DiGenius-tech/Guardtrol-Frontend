import { Dropdown, Spinner } from "flowbite-react";
import AlertDialog from "../../shared/Dialog/AlertDialog";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../redux/selectors/auth";
import { useGetPointsQuery } from "../../redux/services/points";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";

function BeatsDesktopView(props) {
  // const sendBeatToUpdate = (beat) => {
  //   props.setOpenModal(true);
  //   props.setBeatToEdit(beat);

  // };
  const organization = useSelector(selectOrganization);
  const {
    data: points,
    refetch: refetchPoints,
    isLoading,
  } = useGetPointsQuery();

  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  return (
    <>
      {/* beats-desktop-view-app works! */}

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap lowercase first-letter:uppercase"
              >
                Name of Beat
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap lowercase first-letter:uppercase"
              >
                Guards
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap lowercase first-letter:uppercase"
              >
                Patrol Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap lowercase first-letter:uppercase"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap lowercase first-letter:uppercase"
              >
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.isLoading && (
              <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <td
                  colSpan={5}
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
              props?.beatList?.map((beat) => {
                return (
                  <tr
                    key={beat._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {beat.name}
                    </th>
                    <td className="px-6 py-4">
                      {beat.guards?.length || 0}&nbsp;Guard
                      {beat.guards?.length || 0 > 1 ? <span>s</span> : ""}
                    </td>
                    <td className="px-6 py-4">
                      {points?.filter((pat) => pat.beat === beat._id)?.length ||
                        0}
                      &nbsp;point
                      {points?.filter((pat) => pat.beat === beat._id)?.length ||
                      0 > 1 ? (
                        <span>s</span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {beat.isactive ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Not active</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown
                        label=""
                        placement="right"
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <button className="flex w-8 justify-end">
                            <img src={props?.icon_menu_dots} alt="menu" />
                          </button>
                        )}
                      >
                        <Dropdown.Item
                          onClick={() => {
                            navigate(`details/${beat._id}`);
                          }}
                        >
                          View beat
                        </Dropdown.Item>
                        {(userRole.name === "Owner" ||
                          userRole.name === "Manager") && (
                          <Dropdown.Item
                            onClick={() => {
                              props.handleDeleteBeat(beat);
                            }}
                          >
                            Delete beat
                          </Dropdown.Item>
                        )}
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* <AlertDialog
        open={props.open}
        title="Delete Beat ?"
        description="Are you sure you want to delete this Beat ?, you can't revert this action"
        setOpen={props.setOpen}
        actionText="Delete"
        action={props.handleDeleteBeat}
      /> */}
    </>
  );
}

export default BeatsDesktopView;

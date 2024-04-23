import { Dropdown } from "flowbite-react";
import EditBeat from "./EditBeat/EditBeat";
import AlertDialog from "../../../../shared/Dialog/AlertDialog";
import { Link } from "react-router-dom";

function BeatsMobileView(props) {
  const sendBeatToUpdate = (beat) => {
    props.setOpenModal(true);
    props.setBeatToEdit(beat);
  };
  return (
    <>
      {/* beats-mobile-view-app works! */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody>
            {props.beatList?.map((beat) => {
              return (
                <tr
                  key={beat.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div>
                      <Link to={`details/${beat.id}`}>{beat.title}</Link>
                    </div>
                    <small className="text-dark-250">
                      {beat.routes?.length || 0}&nbsp;point
                      {beat.routes?.length || 0 > 1 ? <span>s</span> : ""}
                    </small>
                  </th>
                  <td className="p-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <div className="text-dark-250">
                          {beat.guards?.length || 0}&nbsp;guard
                          {beat.guards?.length || 0 > 1 ? <span>s</span> : ""}
                        </div>
                        <div>
                          {beat.beatStatus ? (
                            <span className="text-green-400">Active</span>
                          ) : (
                            <span className="text-red-400">Not active</span>
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
                          <Dropdown.Item onClick={() => sendBeatToUpdate(beat)}>
                            Edit beat
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              props.setBeatToDelete(beat);
                              props.setOpen(true);
                            }}
                          >
                            Delete beat
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
      <AlertDialog
        open={props.open}
        title="Delete Beat ?"
        description="Are you sure you want to delete this Beat ?, you can't revert this action"
        setOpen={props.setOpen}
        actionText="Delete"
        action={props.handleDeleteBeat}
      />
    </>
  );
}

export default BeatsMobileView;

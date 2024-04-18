import { Dropdown } from "flowbite-react";
import EditBeat from "../EditBeat/EditBeat";

function BeatsDesktopView(props) {

  const sendBeatToUpdate = (beat) => {
    console.log("beat: ", beat)
    props.setOpenModal(true)
    props.setBeatToEdit(beat)
  }
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
                Name of beat
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
                Patrol points
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
            {props?.beatList.map((beat) => {
              return (
                <tr
                  key={beat.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {beat.title}
                  </th>
                  <td className="px-6 py-4">
                    {beat.numberOfGuards}&nbsp;guard
                    {beat.numberOfGuards > 1 ? <span>s</span> : ""}
                  </td>
                  <td className="px-6 py-4">
                    {beat.patrolPoints}&nbsp;point
                    {beat.patrolPoints > 1 ? <span>s</span> : ""}
                  </td>
                  <td className="px-6 py-4">
                    {beat.beatStatus ? (
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
                      <Dropdown.Item onClick={() => sendBeatToUpdate(beat)}>Edit beat</Dropdown.Item>
                      <Dropdown.Item>Deactivate beat</Dropdown.Item>
                    </Dropdown>
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

export default BeatsDesktopView;

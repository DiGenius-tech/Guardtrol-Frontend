import { Dropdown } from "flowbite-react";

function BeatsMobileView(props) {
  return (
    <>
      {/* beats-mobile-view-app works! */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody>
            {props.beatList?.map((beat) => {
              return (
                <tr key={beat.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div>{beat.title}</div>
                    <small className="text-dark-250">
                      {beat.patrolPoints}&nbsp;point
                      {beat.patrolPoints > 1 ? <span>s</span> : ""}
                    </small>
                  </th>
                  <td className="p-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <div className="text-dark-250">
                          {beat.numberOfGuards}&nbsp;guard
                          {beat.patrolPoints > 1 ? <span>s</span> : ""}
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
                          <Dropdown.Item href="#">Edit beat</Dropdown.Item>
                          <Dropdown.Item>Deactivate beat</Dropdown.Item>
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

export default BeatsMobileView;

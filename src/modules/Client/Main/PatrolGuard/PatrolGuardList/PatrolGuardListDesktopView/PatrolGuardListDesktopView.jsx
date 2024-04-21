import { Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";

function PatrolGuardListDesktopView(props) {

  return (
    <>
      {/* patrol-guard-list-desktop-view-app works! */}
      {props.guards.length < 1?(
      <div class="bg-white p-8 rounded ">
        <p class="text-gray-700 text-center">No Guards Here Yet</p>
     </div>):(
      <div className="patrol-guard-list-table">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Guard name
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Phone number
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
              {props.guards.map((guard) => {
                return (
                  <tr
                    key={guard.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <Link to={`/client/patrol-guard/details/${guard.id}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img src={guard.profileImage} alt={guard.name} />
                          </div>
                          {guard.name}
                          <span className="block sm:hidden">
                            <br />
                            {/* {time} */}
                          </span>
                        </div>
                      </Link>
                    </th>
                    <td className="px-6 py-4"> {guard.phone}</td>
                    {/* <td className="px-6 py-4"> {guard.email}</td> */}
                    <td className="px-6 py-4">
                      {guard.status === "off-duty" ? (
                        <span className="text-yellow-300 font-semibold">
                          Off Duty
                        </span>
                      ) : guard.status === "on-duty" ? (
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
                          <Link to={`/client/patrol-guard/details/${guard.id}`}>Edit guard</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>Assign guard to beat</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          props.setSelectedGuard(guard)
                          props.setOpen(true)
                        }}>Deactivate</Dropdown.Item>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>)}
    </>
  );
}

export default PatrolGuardListDesktopView;

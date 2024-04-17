import { Dropdown } from "flowbite-react";
import { patrol_guards } from "../../patrol-guard-list";

function PatrolGuardListDesktopView(props) {


  const sendGuardToEdit = (data)=>{
    console.log("data: ", data)
    props.setGuardToEdit(data)
  }
  return (
    <>
      {/* patrol-guard-list-desktop-view-app works! */}

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
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Email address
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {patrol_guards.map((guard) => {
                return (
                  <tr
                    key={guard.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
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
                    </th>
                    <td className="px-6 py-4"> {guard.phone}</td>
                    <td className="px-6 py-4"> {guard.email}</td>
                    <td className="px-6 py-4">
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
                          Removed
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
                        <Dropdown.Item  onClick={() => sendGuardToEdit(guard)}>Edit guard</Dropdown.Item>
                        <Dropdown.Item>Assign guard to beat</Dropdown.Item>
                        <Dropdown.Item>Deactivate</Dropdown.Item>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PatrolGuardListDesktopView;

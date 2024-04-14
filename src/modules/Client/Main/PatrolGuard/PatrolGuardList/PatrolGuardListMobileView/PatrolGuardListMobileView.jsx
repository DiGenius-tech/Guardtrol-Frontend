import { Dropdown } from "flowbite-react";
import { patrol_guards } from "../../patrol-guard-list";

function PatrolGuardListMobileView(props) {
  return (
    <>
      {/* patrol-guard-list-mobile-view-app works! */}

      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="sr-only text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Product name
              </th>
              <th scope="col" class="px-6 py-3">
                Color
              </th>
              <th scope="col" class="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {patrol_guards?.map((guard) => {
              return (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    class="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img src={guard.profileImage} alt={guard.name} />
                    </div>
                  </th>
                  <td class="p-2">
                    <div>
                      <div>{guard.name}</div>
                      <div>{guard.email}</div>
                    </div>
                  </td>
                  <td class="p-2">
                    <div className="flex items-center gap-2">
                      {/* <div>{guard.phone}</div> */}
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
                          <Dropdown.Item>View guard</Dropdown.Item>
                          <Dropdown.Item>Edit guard</Dropdown.Item>
                          <Dropdown.Item>Complete onboarding</Dropdown.Item>
                          <Dropdown.Item>Remove and deactivate</Dropdown.Item>
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

      {/* <ul className="text-xs flex flex-col gap-2">
        {patrol_guards?.map((guard) => {
          return (
            <li key={guard.id} className="flex items-center justify-between">
              <div className="basis-1/5">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img src={guard.profileImage} alt={guard.name} />
                </div>
              </div>
              <div className="basis-2/5">{guard.name}</div>
              <div className="basis-1/5">{guard.phone}</div>
              <div className="basis-1/5">
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
                  <Dropdown.Item>View guard</Dropdown.Item>
                  <Dropdown.Item>Edit guard</Dropdown.Item>
                  <Dropdown.Item>Complete onboarding</Dropdown.Item>
                  <Dropdown.Item>Remove and deactivate</Dropdown.Item>
                </Dropdown>
              </div>
            </li>
          );
        })}
      </ul> */}
    </>
  );
}

export default PatrolGuardListMobileView;

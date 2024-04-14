import { Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { useEffect, useState } from "react";
import { patrol_guards } from "../patrol-guard-list";

function SentRequest(props) {
  const [sentRequestList, setSentRequestList] = useState([]);

  const handleSentRequest = () => {
    const data = patrol_guards.filter((guard) => guard.requestSent);
    setSentRequestList(data);
    props.setSentRequestCount(data.length);
  };

  useEffect(() => {
    handleSentRequest();
  }, []);

  return (
    <>
      {/* sent-request-app works! */}

      <Card>
        {/* <div className="patrol-guard-list-table overflow-x-auto remove-scrollbar"> */}
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
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sentRequestList?.map((guard) => {
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
                        <Dropdown
                          label=""
                          placement="right"
                          dismissOnClick={false}
                          renderTrigger={() => (
                            <button className="flex w-8 justify-end">
                              <img src={icon_menu_dots} alt="menu" />
                            </button>
                          )}
                        >
                          <Dropdown.Item>Edit guard</Dropdown.Item>
                          <Dropdown.Item>Send reminder</Dropdown.Item>
                          <Dropdown.Item>Remove guard</Dropdown.Item>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </>
  );
}

export default SentRequest;

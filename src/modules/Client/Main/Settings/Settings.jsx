import { Tabs } from "flowbite-react";
import SettingsToolbar from "./SettingsToolbar/SettingsToolbar";
import { Outlet } from "react-router-dom";

function Settings() {
  return (
    <>
      {/* settings-app works! */}

      <SettingsToolbar />
      <div className="my-4"></div>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Outlet />
      </div>

      {/* 
      <div className="tab flex-tabs flex-tab-nowrap">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Personal information">
            Personal information app
          </Tabs.Item>
          <Tabs.Item title="Security">
            Security app
          </Tabs.Item>
          <Tabs.Item title="Shift schedule">
            Shift schedule app
          </Tabs.Item>
          <Tabs.Item title="Billing">
            Billing app
          </Tabs.Item>
        </Tabs>
      </div> */}
    </>
  );
}

export default Settings;
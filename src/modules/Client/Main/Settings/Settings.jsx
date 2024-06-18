import { Tabs } from "flowbite-react";
import SettingsToolbar from "./SettingsToolbar/SettingsToolbar";
import { Outlet } from "react-router-dom";

function Settings() {
  return (
    <>
      {/* settings-app works! */}

      <SettingsToolbar />
      <div className="my-4"></div>

      <Outlet />

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

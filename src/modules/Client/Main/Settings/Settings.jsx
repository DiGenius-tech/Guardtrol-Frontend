import { Tabs } from "flowbite-react";
import SettingsToolbar from "./SettingsToolbar/SettingsToolbar";
import { Outlet, useNavigate } from "react-router-dom";
import { selectOrganization } from "../../../../redux/selectors/auth";
import { useGetUserOrganizationRoleQuery } from "../../../../redux/services/role";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function Settings() {
  const organization = useSelector(selectOrganization);
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (userRole.name === "Supervisor") {
      navigate("/client");
    }
  }, [userRole]);
  return (
    <>
      {/* settings-app works! */}

      <SettingsToolbar />
      <div className="my-4"></div>
      <div className="px-4 ">
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

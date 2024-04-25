import SettingBilling from "./SettingBilling/SettingBilling";
import SettingPersonalInformation from "./SettingPersonalInformation/SettingPersonalInformation";
import SettingSecurity from "./SettingSecurity/SettingSecurity";
import SettingShiftSchedule from "./SettingShiftSchedule/SettingShiftSchedule";
import Settings from "./Settings";

const settings_routes = {
    path: "settings",
    element: <Settings />,
    children: [
        {
            path: "",
            element: <SettingPersonalInformation />
        },
        {
            path: "personal-information",
            element: <SettingPersonalInformation />
        },
        {
            path: "security",
            element: <SettingSecurity />
        },
        {
            path: "shift-schedule",
            element: <SettingShiftSchedule />
        },
        {
            path: "billing",
            element: <SettingBilling />
        },
    ]

}
const settings_routes_empt = {
    path: "",
    element: <Settings />,
    children: [
        {
            path: "",
            element: <SettingPersonalInformation />
        },
        {
            path: "personal-information",
            element: <SettingPersonalInformation />
        },
        {
            path: "security",
            element: <SettingSecurity />
        },
        {
            path: "shift-schedule",
            element: <SettingShiftSchedule />
        },
        {
            path: "billing",
            element: <SettingBilling />
        },
    ]

}

export default { settings_routes, settings_routes_empt };
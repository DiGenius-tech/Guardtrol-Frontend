import SettingBilling from "./SettingBilling/SettingBilling";
import CheckoutSubscription from "./SettingBilling/checkout-subscription/checkout-subscription";
import UpdateSubscriptionPlan from "./SettingBilling/update-subscription-plan/update-subscription-plan";
import SettingNotifications from "./SettingNotifications";
import SettingPersonalInformation from "./SettingPersonalInformation/SettingPersonalInformation";
import SettingSecurity from "./SettingSecurity/SettingSecurity";
import SettingShiftSchedule from "./SettingShiftSchedule/SettingShiftSchedule";
import Settings from "./Settings";
import OrganizationUsers from "./Users/all-users";

const settings_routes = {
  path: "settings",
  element: <Settings />,
  children: [
    {
      path: "",
      element: <SettingPersonalInformation />,
    },
    {
      path: "personal-information",
      element: <SettingPersonalInformation />,
    },
    {
      path: "security",
      element: <SettingSecurity />,
    },
    {
      path: "shift-schedule",
      element: <SettingShiftSchedule />,
    },
    {
      path: "notification",
      element: <SettingNotifications />,
    },
    {
      path: "users",
      element: <OrganizationUsers />,
    },
    {
      path: "billing",
      element: <SettingBilling />,
      children: [
        {
          path: "",
          element: <UpdateSubscriptionPlan />,
        },
        {
          path: "update-subscription",
          element: <UpdateSubscriptionPlan />,
        },
        {
          path: "checkout-subscription",
          element: <CheckoutSubscription />,
        },
      ],
    },
  ],
};
const settings_routes_empt = {
  path: "",
  element: <Settings />,
  children: [
    {
      path: "",
      element: <SettingPersonalInformation />,
    },
    {
      path: "personal-information",
      element: <SettingPersonalInformation />,
    },
    {
      path: "security",
      element: <SettingSecurity />,
    },
    {
      path: "shift-schedule",
      element: <SettingShiftSchedule />,
    },
    {
      path: "billing",
      element: <SettingBilling />,
      children: [
        {
          path: "",
          element: <UpdateSubscriptionPlan />,
        },
        {
          path: "update-subscription",
          element: <UpdateSubscriptionPlan />,
        },
        {
          path: "checkout-subscription",
          element: <CheckoutSubscription />,
        },
      ],
    },
  ],
};

export default { settings_routes, settings_routes_empt };

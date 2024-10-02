import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Settings from "./Settings";
import SettingPersonalInformation from "./SettingPersonalInformation/SettingPersonalInformation";
import SettingSecurity from "./SettingSecurity/SettingSecurity";
import SettingShiftSchedule from "./SettingShiftSchedule/SettingShiftSchedule";
import SettingNotifications from "./SettingNotifications";
import SettingBilling from "./SettingBilling/SettingBilling";
import UpdateSubscriptionPlan from "./SettingBilling/update-subscription-plan/update-subscription-plan";
import CheckoutSubscription from "./SettingBilling/checkout-subscription/checkout-subscription";
import OrganizationUsers from "./Users/all-users";
import SettingsLayout from "./settings-layout";
import BeatsRoutes from "../Beats/beats.routes";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../redux/selectors/auth";
import PaymentSuccess from "./PaymentSuccess";

const SettingsRouter = () => {
  const organization = useSelector(selectOrganization);

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });

  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route index element={<SettingPersonalInformation />} />
        <Route
          path="personal-information"
          element={<SettingPersonalInformation />}
        />
        <Route path="security" element={<SettingSecurity />} />
        {(userRole?.name === "Owner" || userRole?.name === "Manager") && (
          <>
            <Route path="shift-schedule" element={<SettingShiftSchedule />} />
            <Route path="notification" element={<SettingNotifications />} />
            <Route path="users" element={<OrganizationUsers />} />
            <Route path="verify-payment" element={<PaymentSuccess />} />
            <Route path="billing" element={<SettingBilling />}>
              <Route index element={<UpdateSubscriptionPlan />} />
              <Route
                path="update-subscription"
                element={<UpdateSubscriptionPlan />}
              />
              <Route
                path="checkout-subscription"
                element={<CheckoutSubscription />}
              />
            </Route>
          </>
        )}
      </Route>
    </Routes>
  );
};

export default SettingsRouter;

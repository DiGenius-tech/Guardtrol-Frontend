import { Card } from "flowbite-react";
import { inactive_patrol_guards } from "../../patrol-guard-list";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 0
};
function InactivePatrolGuards() {
  return (
    <>
      {/* inactive-patrol-guards-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            patrol_guards={inactive_patrol_guards}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          patrol_guards={inactive_patrol_guards}
        />
      </div>
    </>
  );
}

export default InactivePatrolGuards;

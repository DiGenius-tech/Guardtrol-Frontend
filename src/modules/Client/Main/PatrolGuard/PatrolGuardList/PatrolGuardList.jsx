import { Card } from "flowbite-react";
import "./PatrolGuardList.scss";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1
};

function PatrolGuardList() {
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
        />
      </div>
    </>
  );
}

export default PatrolGuardList;

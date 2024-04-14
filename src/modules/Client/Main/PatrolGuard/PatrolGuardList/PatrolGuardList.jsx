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

      <Card>
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
        />

        <PatrolGuardListDesktopView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
        />
      </Card>
    </>
  );
}

export default PatrolGuardList;

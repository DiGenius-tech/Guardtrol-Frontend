import { Card } from "flowbite-react";
import icon_menu_dots from "../../../../images/icons/icon-menu-dots.svg";
import { beat_list } from "./beat-list";
import BeatsDesktopView from "./BeatsDesktopView/BeatsDesktopView";
import BeatsMobileView from "./BeatsMobileView/BeatsMobileView";

function Beats(props) {
  return (
    <>
      {/* beats-app works! */}
      <div className="hidden sm:block">
        <Card>
            <BeatsDesktopView beatList={beat_list} icon_menu_dots={icon_menu_dots}/>
        </Card>
      </div>

      <div className="sm:hidden">
            <BeatsMobileView beatList={beat_list} icon_menu_dots={icon_menu_dots}/>
      </div>
    </>
  );
}

export default Beats;

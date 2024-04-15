import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { useEffect, useState } from "react";
import { patrol_guards } from "../patrol-guard-list";
import SentRequestDesktopView from "./SentRequestDesktopView/SentRequestDesktopView";
import SentRequestMobileView from "./SentRequestMobileView/SentRequestMobileView";
import { Card } from "flowbite-react";

function SentRequest(props) {
  const [sentRequestList, setSentRequestList] = useState([]);

  const handleSentRequest = () => {
    const data = patrol_guards.filter((guard) => guard.requestSent);
    setSentRequestList(data);
    props.setSentRequestCount(data.length);
  };

  useEffect(() => {
    handleSentRequest();
  }, []);

  return (
    <>
      {/* sent-request-app works! */}

      <div className="hidden sm:block">
        <Card>
          <SentRequestDesktopView
            sentRequestList={sentRequestList}
            setSentRequestList={setSentRequestList}
            icon_menu_dots={icon_menu_dots}
          />
        </Card>
      </div>
      
      <div className="sm:hidden rounded-lg bg-white p-2">
        <SentRequestMobileView
          sentRequestList={sentRequestList}
          setSentRequestList={setSentRequestList}
          icon_menu_dots={icon_menu_dots}
        />
      </div>
    </>
  );
}

export default SentRequest;

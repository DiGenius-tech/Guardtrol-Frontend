import { NavLink, Outlet } from "react-router-dom";
import Activities from "./Activities";
import { useState } from "react";
import Patrols from "./Patrols";

function MobileDisplay() {
  const [tab, setTab] = useState("patrols");
  return (
    <>
      {/* mobile-display-app works! */}
      <div className="activities-patrols-mobile-navigation">
        <ul className="flex items-center just rounded-e-full rounded-s-full p-1 bg-dark-50">
          <li className="basis-1/2">
            <div
              style={{
                backgroundColor: tab === "logs" ? "white" : "",
                marginRight: tab === "logs" ? "-1.3em" : "",
              }}
              onClick={() => setTab("logs")}
              className="flex items-center justify-center rounded-e-full rounded-s-full px-4 py-2"
            >
              Activities
            </div>
          </li>
          <li className="basis-1/2">
            <div
              style={{
                backgroundColor: tab === "patrols" ? "white" : "",
                marginLeft: tab === "patrols" ? "-1.3em" : "",
              }}
              onClick={() => setTab("patrols")}
              to={"patrols"}
              className="flex items-center justify-center rounded-e-full rounded-s-full px-4 py-2"
            >
              Patrols
            </div>
          </li>
        </ul>
      </div>
      <div className="py-4">
        {tab === "logs" && <Activities />}
        {tab === "patrols" && <Patrols />}
      </div>
    </>
  );
}

export default MobileDisplay;

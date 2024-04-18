import { Card, Tabs } from "flowbite-react";
import "./PatrolGuardList.scss";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import { useEffect, useState } from "react";
import EditGuard from "../EditGuard/EditGuard";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1
};

function PatrolGuardList() {
  const [guardToEdit, setGuardToEdit] = useState(null)


  useEffect(() => {
    console.log("guardToEdit: ", guardToEdit)
  }, [guardToEdit])
  
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <div className="tab flex-tabs">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Active guards">

            <div className="hidden sm:block">
              <Card>
                <PatrolGuardListDesktopView
                  duty_status={duty_status}
                  icon_menu_dots={icon_menu_dots}
                  setGuardToEdit={setGuardToEdit}
                />
              </Card>
            </div>

            <div className="sm:hidden rounded-lg bg-white p-2">
              <PatrolGuardListMobileView
                duty_status={duty_status}
                icon_menu_dots={icon_menu_dots}
                setGuardToEdit={setGuardToEdit}
              />
            </div>
          </Tabs.Item>
          <Tabs.Item active title="Inactive guards">

            <div className="hidden sm:block">
              <Card>
              </Card>
            </div>

            <div className="sm:hidden rounded-lg bg-white p-2">
             Inactive guards
            </div>
          </Tabs.Item>
        </Tabs>
      </div>


      <EditGuard
        guardToEdit={guardToEdit} setGuardToEdit={setGuardToEdit} />
      {/* 


      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            setGuardToEdit={props.setGuardToEdit}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          setGuardToEdit={props.setGuardToEdit}
        />
      </div> */}
    </>
  );
}

export default PatrolGuardList;

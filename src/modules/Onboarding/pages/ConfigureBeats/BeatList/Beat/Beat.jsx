import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../../../../images/icons/icon-guard-avatar.svg";
import icon_location_marker from "../../../../../../images/icons/icon-location-marker.svg";

function Beat({ guard, status, handle_edit_beat }) {
  return (
    <>
      {/* beat-app works! */}

      <Card>
        <div className="grid grid-cols-12 gap-3 items-center justify-between">
          <div className="col-span-2">
            <div className="w-8">
              <img src={icon_location_marker} alt="Location marker" />
            </div>
          </div>
          <div className="col-span-9">
            <h3 className="text-dark-450 font-semibold text-base">
              {guard?.name}
            </h3>
            <p className="text-sm text-gray-400">{guard?.description}</p>
          </div>
          <div className="col-span-1 text-right">
            <Dropdown
              label=""
              placement="right"
              dismissOnClick={false}
              renderTrigger={() => (
                <button className="block">
                  <img src={icon_menu_dots} alt="menu" />
                </button>
              )}
            >
              <Dropdown.Item onClick={() => handle_edit_beat(guard)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item>Remove</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </Card>
    </>
  );
}

export default Beat;

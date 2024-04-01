import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../../../../images/icons/icon-guard-avatar.svg";

function Guard({ guard, Status, handle_edit_guard }) {
  const handle_status = (guard) => {
    switch (guard.status) {
      case 1:
        return (
          <Badge
            color="success"
            className="bg-success-100 inline-flex uppercase text-success-500 font-normal"
          >
            Success
          </Badge>
        );
        break;
      case 0:
        return (
          <Badge
            color="warning"
            className="bg-warning-100 inline-flex uppercase text-warning-500 font-normal"
          >
            Pending
          </Badge>
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Guard-app works! */}

      <Card>
        <div className="grid grid-cols-12 gap-4 items-center justify-between">
          <div className="col-span-2">
            <img src={icon_guard_avatar} alt="avatar" />
          </div>
          <div className="col-span-9">
            <div>{handle_status(guard)}</div>
            <p className="text-dark-450 font-semibold text-sm">
              {guard.name}
              <br />
              <span className="font-normal text-dark-200">
                {guard.phone_number}
              </span>
            </p>
          </div>
          <div className="col-span-1">
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
              <Dropdown.Item onClick={() => handle_edit_guard(guard)}>
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

export default Guard;

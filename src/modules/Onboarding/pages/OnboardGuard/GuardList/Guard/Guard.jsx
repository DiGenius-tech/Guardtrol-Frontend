import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../../../../images/icons/icon-guard-avatar.svg";
import { useState } from "react";
import { toast } from "react-toastify";
import AlertDialog from "../../../../../../shared/Dialog/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { selectOnboardingGuards } from "../../../../../../redux/selectors/onboarding";
import { setOnboardingGuards } from "../../../../../../redux/slice/onboardingSlice";

function Guard({ setGuards, guard, status, handle_edit_guard }) {
  const onboardingGuards = useSelector(selectOnboardingGuards);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handle_status = (guard) => {
    switch (guard?.status) {
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

  const deleteGuard = (guardName) => {
    const index = onboardingGuards?.findIndex(
      (guard) => onboardingGuards?.full_name === guardName
    );

    if (index !== -1) {
      // Check if the beat is found

      const newGuards = onboardingGuards?.filter((guard, i) => i !== index);

      dispatch(setOnboardingGuards(newGuards));
    } else {
      toast.error("Guard not found");
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
              {guard?.full_name}
              <br />
              <span className="font-normal text-dark-200">{guard?.phone}</span>
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
              <Dropdown.Item onClick={() => setOpen(true)}>
                Remove
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </Card>

      <AlertDialog
        open={open}
        title="Delete Guard ?"
        description="Are You Sure You Want To Delete This Guard ?, You won't Be Able To Revert This Action"
        setOpen={setOpen}
        actionText="Delete"
        action={() => deleteGuard(guard?.full_name)}
      />
    </>
  );
}

export default Guard;

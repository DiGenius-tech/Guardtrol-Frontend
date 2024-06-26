import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../../../../images/icons/icon-guard-avatar.svg";
import icon_location_marker from "../../../../../../images/icons/icon-location-marker.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import AlertDialog from "../../../../../../shared/Dialog/AlertDialog";
import {
  useDeleteBeatMutation,
  useGetBeatsQuery,
} from "../../../../../../redux/services/beats";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import { useDispatch } from "react-redux";

function Beat({ setBeats, beat, status, handle_edit_beat }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [deleteBeat, { isLoading: isDeleting, deleteStatus }] =
    useDeleteBeatMutation();
  const { refetch: refetchBeats } = useGetBeatsQuery();

  const handleDelete = async (_id) => {
    setOpen(false);
    dispatch(suspenseShow());

    try {
      const data = await deleteBeat({ beatId: _id });

      toast("Beat deleted");
      await refetchBeats();
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };
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
              {beat?.name}
            </h3>
            <p className="text-sm text-gray-400">{beat?.description}</p>
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
              <Dropdown.Item onClick={() => handle_edit_beat(beat)}>
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
        title="Delete Beat ?"
        description="Are You Sure You Want To Delete This Beat ?, You won't Be Able To Revert This Action"
        setOpen={setOpen}
        actionText="Delete"
        action={() => handleDelete(beat?._id)}
      />
    </>
  );
}

export default Beat;

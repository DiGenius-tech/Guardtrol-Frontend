import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../images/icons/icon-guard-avatar.svg";
import icon_location_marker from "../../../images/icons/icon-location-marker.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import AlertDialog from "../../../shared/Dialog/AlertDialog";
import {
  useDeleteBeatMutation,
  useGetBeatsQuery,
} from "../../../redux/services/beats";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectOrganization } from "../../../redux/selectors/auth";
import Swal from "sweetalert2";
import { POOLING_TIME } from "../../../constants/static";

function Beat({ setBeats, beat, status, handle_edit_beat }) {
  const organization = useSelector(selectOrganization);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [deleteBeat, { isLoading: isDeleting, deleteStatus }] =
    useDeleteBeatMutation();
  const { refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const handleDelete = async (beatToDelete) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await deleteBeat({
            beatId: beatToDelete._id,
            organization,
          });
          await refetchBeats();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${beatToDelete?.name || "Beat"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {}
  };
  return (
    <>
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
              <Dropdown.Item onClick={() => handleDelete(beat)}>
                Remove
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </Card>
    </>
  );
}

export default Beat;

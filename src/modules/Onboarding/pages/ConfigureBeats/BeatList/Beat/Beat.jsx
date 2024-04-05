import { Badge, Card, Dropdown } from "flowbite-react";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import icon_guard_avatar from "../../../../../../images/icons/icon-guard-avatar.svg";
import icon_location_marker from "../../../../../../images/icons/icon-location-marker.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import AlertDialog from "../../../../../../shared/Dialog/AlertDialog";



function Beat({setBeats, guard, status, handle_edit_beat }) {
  const [open, setOpen] = useState(false);

  

  

  const deleteBeat = (beatname) => {
      const beats = JSON.parse(localStorage.getItem('beats')) || [];
      const index = beats.findIndex(beat => beat.beat_name === beatname);

      if (index !== -1) { // Check if the beat is found
        
        const newBeats = beats.filter((beat, i) => i!== index);

        setBeats(newBeats);

        const savedBeats = JSON.stringify(newBeats);
        localStorage.setItem("beats", savedBeats);
  
      } else {
        toast.error('Beat not found');
      }
  }
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
              {guard?.beat_name}
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
              <Dropdown.Item onClick={()=> setOpen(true)}>Remove</Dropdown.Item>
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
        action={() => deleteBeat(guard?.beat_name)}
      />
    </>
  );
}

export default Beat;

import { useState } from "react";
import { Link } from "react-router-dom";
import Beat from "./Beat/Beat";
import EditBeat from "../EditBeat/EditBeat";

const guardList = [
  {
    id: 1,
    name: "Laborum possimus voluptatum",
    description:
      "Reiciendis at aperiam repellat sunt illum autem non laborum possimus voluptatum distinctio optio, libero quo hic quos veniam."
  },
  {
    id: 2,
    name: "Repudiandae ipsam libero deserunt",
    description:
      "Vero commodi ea laboriosam voluptas enim temporibus nostrum, repudiandae ipsam libero deserunt velit porro quaerat autem"
  }
];

function BeatList() {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState(null);

  const handle_edit_beat = (guard) => {
    if (guard) {
      setIsEdit(true);
      setSelectedBeat(guard);
    }
  };

  const cancelEdit = ()=>{
    setIsEdit(false);
  }
  return (
    <>
      {/* beat-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8">
            <EditBeat selectedBeat={selectedBeat} cancelEdit={cancelEdit} />
          </div>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-4">
              {guardList.map((guard) => (
                <li key={guard.id}>
                  <Beat guard={guard} handle_edit_beat={handle_edit_beat} />
                </li>
              ))}
            </ul>
            <Link
              to="add-beat"
              className="text-primary-500 font-semibold text-sm"
            >
              + Onboard Another Beat
            </Link>

            <div className="my-8"></div>
            <Link
              to=""
              className="block w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Continue To Assign Beats
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default BeatList;

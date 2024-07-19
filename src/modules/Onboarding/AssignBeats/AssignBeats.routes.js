import AssignBeats from "./AssignBeats";
import AssignNewBeat from "./AssignNewBeat";
import AssignedBeatList from "./AssignedBeatList";

const assign_beats_routes = {
  path: "assign-beats",
  element: <AssignBeats />,
  children: [
    {
      path: "",
      element: <AssignedBeatList isOnboarding={true} />,
    },
    {
      path: "assign-new-beat",
      element: <AssignNewBeat isOnboarding={true} />,
    },
  ],
};

export default assign_beats_routes;

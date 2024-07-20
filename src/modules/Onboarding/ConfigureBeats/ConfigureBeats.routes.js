import AddBeat from "./AddBeat";
import BeatList from "./BeatList";
import ConfigureBeats from "./ConfigureBeats";

const configure_beats_routes = {
  path: "configure-beats",
  element: <ConfigureBeats />,
  children: [
    {
      path: "",
      element: <BeatList />,
    },
    {
      path: "add-beat",
      element: <AddBeat />,
    },
    // {
    //     path: "update-beat/:id",
    //     element: <UpdateGuard />
    // }
  ],
};

export default configure_beats_routes;

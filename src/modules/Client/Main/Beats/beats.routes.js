import BeatList from "./BeatList";
import Beats from "./Beats";
import AddBeat from "./AddBeat";
import BeatDetails, { BeatDetailsRouter } from "./BeatDetails";
import BeatGaurds from "./BeatDetailsTabs/BeatGaurds";
import BeatPatrol from "./BeatDetailsTabs/BeatPatrol";
import AssignBeat from "./AssignBeat";
import BeatReport from "./BeatDetailsTabs/BeatReport";
import { Navigate } from "react-router-dom";
import BeatInformation from "./BeatDetailsTabs/BeatInformation";

const beats_routes = {
  path: "beats",
  element: <Beats />,
  children: [
    {
      path: "",
      element: <BeatList />,
    },
    {
      path: "list",
      element: <BeatList />,
    },
    {
      path: "add",
      element: <AddBeat />,
    },
    {
      path: "details/:beatId/*",
      element: <BeatDetailsRouter />,
      // children: [
      //   {
      //     path: "beat-guards",
      //     element: <BeatGaurds />,
      //   },
      //   {
      //     path: "beat-patrol",
      //     element: <BeatPatrol />,
      //   },
      //   {
      //     path: "assign-beat",
      //     element: <AssignBeat />,
      //   },
      //   {
      //     path: "beat-report",
      //     element: <BeatReport />,
      //   },
      //   {
      //     path: "",
      //     element: <Navigate to={"beat-information"} />,
      //   },

      //   {
      //     path: "beat-information",
      //     element: <BeatInformation />,
      //   },
      //   {
      //     path: "add",
      //     element: <AddBeat />,
      //   },
      // ],
    },
  ],
};
const beats_routes_empt = {
  path: "",
  element: <Beats />,
  children: [],
};

export default { beats_routes, beats_routes_empt };

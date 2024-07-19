import { Navigate, Route, Routes } from "react-router-dom";
import BeatsLayout from "./beats-layout";
import BeatList from "./BeatList";
import AddBeat from "./AddBeat";
import { BeatDetailsRouter } from "./BeatDetails";

const BeatsRouter = () => (
  <Routes>
    <Route element={<BeatsLayout />}>
      <Route path="" element={<BeatList />} />
      <Route path="list" element={<BeatList />} />
      <Route path="add" element={<AddBeat />} />
      <Route path="details/:beatId/*" element={<BeatDetailsRouter />} />
    </Route>
  </Routes>
);

export { BeatsRouter };

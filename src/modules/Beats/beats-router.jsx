import { Navigate, Route, Routes } from "react-router-dom";
import BeatsLayout from "./beats-layout";
import BeatList from "./BeatList";
import AddBeat from "./AddBeat";
import { BeatDetailsRouter } from "./BeatDetails";
import AddBeatToolbar from "./AddBeatToolbar";
import BulkUploadBeat from "./BulkUploadBeat";

const BeatsRouter = () => (
  <Routes>
    <Route element={<BeatsLayout />}>
      <Route path="" element={<BeatList />} />
      <Route path="list" element={<BeatList />} />
      <Route
        path="add/create"
        element={
          <>
            <AddBeatToolbar />
            <AddBeat />
          </>
        }
      />
      <Route
        path="add/bulkupload"
        element={
          <>
            <AddBeatToolbar />
            <BulkUploadBeat />
          </>
        }
      />
      <Route path="details/:beatId/*" element={<BeatDetailsRouter />} />
    </Route>
  </Routes>
);

export { BeatsRouter };

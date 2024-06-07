import { Navigate, Route, Routes } from "react-router-dom";
import HistoryLayout from "./history-layout";
import { GuardsHistory } from "./guards";
import { BeatsHistory } from "./beats";

const HistoryRouter = () => (
  <Routes>
    <Route element={<HistoryLayout />}>
      <Route path="" element={<Navigate to={"beats"} />} />
      <Route path="beats" element={<BeatsHistory />} />
      <Route path="guards" element={<GuardsHistory />} />
    </Route>
  </Routes>
);

export { HistoryRouter };

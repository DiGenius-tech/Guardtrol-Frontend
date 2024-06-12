import { Navigate, Route, Routes } from "react-router-dom";
import LogLayout from "./log-layout";
import { BeatsLog } from "./beats";
import { GuardsLog } from "./guards";

const LogRouter = () => (
  <Routes>
    <Route element={<LogLayout />}>
      <Route path="" element={<Navigate to={"beats"} />} />
      <Route path="beats" element={<BeatsLog />} />
      <Route path="guards" element={<GuardsLog />} />
    </Route>
  </Routes>
);

export { LogRouter };

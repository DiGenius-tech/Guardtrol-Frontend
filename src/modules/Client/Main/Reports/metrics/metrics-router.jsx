import { Navigate, Route, Routes } from "react-router-dom";
import { GuardsMetrics } from "./guards";
import { BeatsMetrics } from "./beats";
import MetricsLayout from "./metrics-layout";

const MetricsRouter = () => (
  <Routes>
    <Route element={<MetricsLayout />}>
      <Route path="" element={<Navigate to={"beats"} />} />
      <Route path="beats" element={<BeatsMetrics />} />
      <Route path="guards" element={<GuardsMetrics />} />
    </Route>
  </Routes>
);

export { MetricsRouter };

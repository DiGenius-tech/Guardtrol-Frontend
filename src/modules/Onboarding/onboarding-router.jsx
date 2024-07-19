import { Navigate, Route, Routes } from "react-router-dom";
import OnboardingLayout from "./onboarding-layout";
import OnboardingComplete from "./CompleteOnboarding";
import AssignBeats from "./AssignBeats/AssignBeats";
import AssignedBeatList from "./AssignBeats/AssignedBeatList";
import AssignNewBeat from "./AssignBeats/AssignNewBeat";
import ConfigureBeats from "./ConfigureBeats/ConfigureBeats";
import BeatList from "./ConfigureBeats/BeatList";
import AddBeat from "./ConfigureBeats/AddBeat";
import OnboardGuard from "./OnboardGuard/OnboardGuard";
import GuardList from "./OnboardGuard/GuardList";
import AddGuard from "./OnboardGuard/AddGuard";
import Subscription from "./Subscription/Subscription";
import Shop from "./Subscription/Shop";
import Checkout from "./Subscription/Checkout";
import PaymentSuccess from "./Subscription/PaymentSuccess";
import PaymentFailure from "./Subscription/PaymentFailure";

const OnboardingRouter = () => {
  return (
    <Routes>
      <Route element={<OnboardingLayout />}>
        <Route index element={<Navigate to={"membership"} />} />
        <Route path="complete" element={<OnboardingComplete />} />
        <Route path="assign-beats" element={<AssignBeats />}>
          <Route path="" element={<AssignedBeatList isOnboarding={true} />} />
          <Route
            path="assign-new-beat"
            element={<AssignNewBeat isOnboarding={true} />}
          />
        </Route>
        <Route path="configure-beats" element={<ConfigureBeats />}>
          <Route path="" element={<BeatList />} />
          <Route path="add-beat" element={<AddBeat />} />
        </Route>
        <Route path="onboard-guard" element={<OnboardGuard />}>
          <Route path="" element={<GuardList />} />
          <Route path="add-guard" element={<AddGuard />} />
        </Route>
        <Route path="membership" element={<Subscription />}>
          <Route path="" element={<Shop />} />
          <Route path="shop" element={<Shop />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="successful" element={<PaymentSuccess />} />
          <Route path="failed" element={<PaymentFailure />} />
        </Route>
      </Route>
    </Routes>
  );
};

export { OnboardingRouter };

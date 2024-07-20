import React, { useEffect, useState } from "react";
import "./OnboardingProgressBar.scss";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../../../redux/selectors/auth";
import { useGetUserOrganizationRoleQuery } from "../../../../redux/services/role";

const list = [
  {
    id: 1,
    title: "Membership",
    url: "/onboarding/membership",
    passed: false,
    current: true,
  },
  {
    id: 2,
    title: "Configure Beats",
    url: "/onboarding/configure-beats",
    passed: false,
    current: false,
  },
  {
    id: 3,
    title: "Onboard Guard",
    url: "/onboarding/onboard-guard",
    passed: false,
    current: false,
  },
  {
    id: 4,
    title: "Assign Beats",
    url: "/onboarding/assign-beats",
    passed: false,
    current: false,
  },
];

const OnboardingProgressBar = ({ complete = false }) => {
  const organization = useSelector(selectOrganization);
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: !organization,
  });

  const location = useLocation();
  const [stageProgressClass, setStageProgressClass] = useState("stage-1");
  const [stages, setStages] = useState([...list]);

  const completeProcess = () => {
    const updatedStages = stages.map((stage) => ({
      ...stage,
      passed: true,
    }));
    setStages(updatedStages);
    setStageProgressClass("stage-full");
  };

  useEffect(() => {
    const handleProgress = (pathname) => {
      const updatedStages = stages.map((stage, index) => {
        return {
          ...stage,
          current: pathname.includes(stage.url) ? true : false,
          passed:
            complete ||
            stage.id < list.find((it) => pathname.includes(it.url))?.id,
        };
      });
      setStages(updatedStages);
    };

    const progress = () => {
      handleProgress(location.pathname);

      switch (location.pathname) {
        case "/onboarding":
        case "/onboarding/":
        case "/onboarding/membership":
        case "/onboarding/membership/":
        case "/onboarding/membership/shop":
        case "/onboarding/membership/shop/":
        case "/onboarding/membership/checkout":
        case "/onboarding/membership/checkout/":
        case "/onboarding/services":
        case "/onboarding/services/":
        case "/onboarding/services/shop":
        case "/onboarding/services/shop/":
        case "/onboarding/services/checkout":
        case "/onboarding/services/checkout/":
          setStageProgressClass("stage-1");
          break;
        case "/onboarding/configure-beats":
        case "/onboarding/configure-beats/":
        case "/onboarding/configure-beats/add-beat":
          setStageProgressClass("stage-2");
          break;
        case "/onboarding/configure-beats/add-beat/":
          setStageProgressClass("stage-2");
          break;
        case "/onboarding/onboard-guard":
        case "/onboarding/onboard-guard/":
        case "/onboarding/onboard-guard/add-guard":
        case "/onboarding/onboard-guard/add-guard/":
          setStageProgressClass("stage-3");
          break;

        case "/onboarding/assign-beats":
        case "/onboarding/assign-beats/":
        case "/onboarding/assign-beats/assign-new-beat":
          setStageProgressClass("stage-4");
          break;
        case "/onboardingcomplete":
          completeProcess();
          break;
        case "/onboarding/complete":
          completeProcess();
          break;
        default:
          setStageProgressClass("stage-1");
          break;
      }
    };

    progress();
  }, [location.pathname]);
  return (
    <div className="onboarding-progress-bar-alt | mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mb-4">
      <div className={`bar ${stageProgressClass}`}></div>
      <ul className="onboarding-progress passed">
        {stages.map((stage) => (
          <li
            key={stage.title}
            className={`font-semibold ${
              complete || stage.passed || stage.current
                ? "passed text-secondary-500"
                : "text-secondary-50"
            }`}
          >
            <p className="hidden sm:block mt-1">{stage.title}</p>
          </li>
        ))}
      </ul>
      <p className="font-semibold sm:hidden">
        {stages.map((stage) => (stage.current ? stage.title : null))}
      </p>
    </div>
  );
};

export default OnboardingProgressBar;

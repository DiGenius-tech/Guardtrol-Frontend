import React, { useEffect, useState } from "react";
import "./OnboardingProgressBar.scss";
import { Link, useLocation } from "react-router-dom";
import OnboardingTestNavigation from "../../../Sandbox/OnboardingTestNavigation/OnboardingTestNavigation";

const list = [
  {
    title: "Membership",
    url: "/onboarding/membership",
    passed: false,
    current: true
  },
  {
    title: "Configure Beats",
    url: "/onboarding/configure-beats",
    passed: false,
    current: false
  },
  {
    title: "Onboard Guard",
    url: "/onboarding/onboard-guard",
    passed: false,
    current: false
  },
  {
    title: "Assign Beats",
    url: "/onboarding/assign-beats",
    passed: false,
    current: false
  }
];

const OnboardingProgressBar = () => {
  const location = useLocation();
  const [stageProgressClass, setstageProgressClass] = useState("stage-2");
  const [stages, setStages] = useState([...list]);

  const completeProcess = () => {
    for (let i = 0; i < list.length; i++) {
      const stage = list[i];
      stage.passed = true;
    }

    setStages(list);
    setstageProgressClass("stage-full");
  };

  useEffect(() => {
    const handleProgress = (pathname) => {
      let item_ = list.find((it) => it.url === pathname);
      let item_index = list.indexOf(item_);

      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        element.current = false;
        element.passed = false;

        if (pathname === element.url) {
          element.current = true;
        }
        if (i < item_index) {
          element.passed = true;
        }
      }
      setStages(list);
    };

    const progress = () => {
      handleProgress(location.pathname);

      switch (location.pathname) {
        case "/onboarding":
          setstageProgressClass("stage-1");
          break;
        case "/onboarding/":
          setstageProgressClass("stage-1");
          break;
        case "/onboarding/membership":
          setstageProgressClass("stage-1");
          break;
        case "/onboarding/configure-beats":
          setstageProgressClass("stage-2");
          break;
        case "/onboarding/configure-beats/":
          setstageProgressClass("stage-2");
          break;
        case "/onboarding/onboard-guard":
          setstageProgressClass("stage-3");
          break;
        case "/onboarding/onboard-guard/":
          setstageProgressClass("stage-3");
          break;
        case "/onboarding/onboard-guard/add-guard":
          setstageProgressClass("stage-3");
          break;
        case "/onboarding/onboard-guard/add-guard/":
          setstageProgressClass("stage-3");
          break;
        case "/onboarding/assign-beats":
          setstageProgressClass("stage-4");
          break;
        case "/onboarding/assign-beats/":
          setstageProgressClass("stage-4");
          break;

        default:
          setstageProgressClass("stage-1");
          break;
      }
    };

    progress();

    return () => {
      // cleanup
    };
  }, [location, stages]);

  return (
    <>
      {/* onboarding-progress-bar-app works! */}

      <div className="onboarding-progress-bar-alt | mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mb-4">
        <div className={`bar ${stageProgressClass}`}></div>
        <ul className="onboarding-progress passed">
          {stages.map((stage, i) => {
            return (
              <li
                key={stage.title}
                className={`font-semibold ${stage.passed
                  ? "passed text-secondary-500"
                  : "text-secondary-50"
                  }; 
                        `}
              >
                <p className="hidden sm:block mt-1">{stage.title}</p>
              </li>
            );
          })}
        </ul>
        <p className="font-semibold sm:hidden">
          {stages.map((stage, i) => {
            return stage.current ? stage.title : null;
          })}
        </p>

        {/* <OnboardingTestNavigation completeProcess={completeProcess} location={location} /> */}
      </div>
    </>
  );
};

export default OnboardingProgressBar;

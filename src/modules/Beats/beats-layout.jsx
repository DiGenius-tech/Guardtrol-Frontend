import { Outlet } from "react-router-dom";

const OnbordingLayout = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-2">
        <Outlet />
      </div>
    </>
  );
};

export default OnbordingLayout;

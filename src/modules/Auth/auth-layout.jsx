import { Outlet } from "react-router-dom";
import AuthToolbar from "./AuthToolbar";
import left_pattern_boxes from "../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../images/right-pattern-boxes.svg";

const AuthLayout = () => {
  return (
    <>
      {" "}
      <AuthToolbar />
      <div className="min-h-screen ">
        <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8 mb-16">
          <div className="flex flex-row justify-center items-center gap-4 sm:gap-8 mx-auto px-2 sm:px-6 lg:px-8 relative">
            <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-left absolute -z-10 left-0 bottom-0">
              <div className="h-48"></div>
              <div className="h-full flex items-end justify-end">
                <img src={left_pattern_boxes} alt="" />
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 w-full max-w-[420px]">
              <Outlet />
            </div>
            <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-right absolute  -z-10 right-0  bottom-0">
              <div className="h-48 "></div>
              <div className="h-full flex items-end justify-end">
                <img src={right_pattern_boxes} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;

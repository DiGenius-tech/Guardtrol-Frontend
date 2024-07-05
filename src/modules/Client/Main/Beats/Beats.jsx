import { Outlet } from "react-router-dom";

function Beats(props) {
  return (
    <>
      {/* beats-app works! */}
      <div className="px-4">
        <Outlet />
      </div>
    </>
  );
}

export default Beats;

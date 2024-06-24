import { NavLink, Outlet } from "react-router-dom";

function MobileDisplay() {
  return (
    <>
      {/* mobile-display-app works! */}
      <div className="activities-patrols-mobile-navigation">
        <ul className="flex items-center just rounded-e-full rounded-s-full p-1 bg-dark-50">
          <li className="basis-1/2">
            <NavLink
              style={({ isActive, isPending, isTransitioning }) => {
                return {
                  backgroundColor: isActive ? "white" : "",
                  marginRight: isActive ? "-1.3em" : "",
                  // color: isPending ? "red" : "black",
                  viewTransitionName: isTransitioning
                    ? "transform opacity-0 scale-95"
                    : "transform opacity-100 scale-100",
                };
              }}
              to="/client"
              end
              // to="activities"
              // to={[{ pathname: '/client' }, { pathname: 'activities' }]} end
              // className="flex items-center justify-center rounded-e-full rounded-s-full px-4 py-2 bg-white -mr-4"
              className="flex items-center justify-center rounded-e-full rounded-s-full px-4 py-2"
            >
              Activities
            </NavLink>
          </li>
          <li className="basis-1/2">
            <NavLink
              style={({ isActive, isPending, isTransitioning }) => {
                return {
                  backgroundColor: isActive ? "white" : "",
                  marginLeft: isActive ? "-1.3em" : "",
                  // fontWeight: isActive ? "bold" : "",
                  // color: isPending ? "red" : "black",
                  // viewTransitionName: isTransitioning ? "slide" : ""
                  viewTransitionName: isTransitioning
                    ? "transform opacity-0 scale-95"
                    : "transform opacity-100 scale-100",
                };
              }}
              to={"patrols"}
              className="flex items-center justify-center rounded-e-full rounded-s-full px-4 py-2"
            >
              Patrols
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="py-4">
        <Outlet />
      </div>
    </>
  );
}

export default MobileDisplay;

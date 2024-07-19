import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;

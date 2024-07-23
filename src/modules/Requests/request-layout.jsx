import { Outlet, useNavigate } from "react-router-dom";
import RequestToolbar from "./request-toolbar";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";
import { useSelector } from "react-redux";
import { selectOrganization } from "../../redux/selectors/auth";
import { useEffect } from "react";

const RequestLayout = () => {
  const organization = useSelector(selectOrganization);
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole?.name === "Supervisor") {
      navigate("/client");
    }
  }, [userRole]);
  return (
    <>
      <RequestToolbar />
      <div className="mt-4 px-7">
        <Outlet />
      </div>
    </>
  );
};

export default RequestLayout;

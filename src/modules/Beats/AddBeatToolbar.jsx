import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../redux/selectors/auth";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";

function AddBeatToolbar() {
  const location = useLocation();
  const { beatId } = useParams();
  const user = useSelector(selectUser);
  /**URLS */

  const organization = useSelector(selectOrganization);
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });

  return (
    <>
      {/* patrol-guard-list-toolbar-app works! */}
      <nav>
        {/*  active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 */}
        <ul className="flex gap-2 text-center  mb-5 flex-wrap border-b border-gray-200 dark:border-gray-700">
          {(userRole?.name === "Owner" || userRole?.name === "Manager") && (
            <>
              <li>
                <Link
                  to={`/client/beats/add/create`}
                  className={
                    (location.pathname.includes("/client/beats/add/create")
                      ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                      : `border-transparent `) +
                    `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
                  }
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  to={`/client/beats/add/bulkupload`}
                  className={
                    (location.pathname.includes("client/beats/add/bulkupload")
                      ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                      : `border-transparent `) +
                    `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
                  }
                >
                  Bulk Upload
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default AddBeatToolbar;

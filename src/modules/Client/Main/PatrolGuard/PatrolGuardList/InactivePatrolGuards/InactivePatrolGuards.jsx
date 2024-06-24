import { Card } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../../../../redux/services/guards";
import {
  useGetBeatsQuery,
  useUnAssignFromGuardToBeatMutation,
} from "../../../../../../redux/services/beats";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import {
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import Pagination from "../../../../../../shared/Pagination/Pagination";
import Swal from "sweetalert2";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 0,
};

function InactivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { beatId } = useParams();

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    error,
  } = useGetGuardsQuery();
  const { data: beats } = useGetBeatsQuery();
  const [deleteGuard] = useDeleteGuardMutation();
  const selectedBeat = beats?.find((b) => b._id === beatId);

  const handleDeleteGuard = (guardToDelete) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await deleteGuard(guardToDelete);
          console.log(data);
          refetchGuards();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${guardToDelete?.name || "Guard"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {}
  };
  const [UnAssignGuard] = useUnAssignFromGuardToBeatMutation();

  const handleUnAssignGuard = (guardToUnassign) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: " Unassign",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await UnAssignGuard({
            beat: selectedBeat,
            guard: guardToUnassign,
          });
          console.log(data);
          refetchGuards();
          if (data?.status) {
            Swal.fire({
              title: "Unassigned!",
              text: `${guardToUnassign?.name || "Guard"} has been unassigned.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {}
  };
  useEffect(() => {}, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const inactiveGuards =
    selectedBeat?.guards?.filter((guard) => !guard.isactive) ||
    guards?.filter((guard) => !guard.isactive);
  const paginatedGuards = inactiveGuards?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div div className="relative  pb-40">
      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            handleDeleteGuard={handleDeleteGuard}
            handleUnAssignGuard={handleUnAssignGuard}
            icon_menu_dots={icon_menu_dots}
            guards={paginatedGuards}
          />
        </Card>
      </div>

      <div className="sm:hidden rounded-lg bg-white p-2 min-h-64">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          icon_menu_dots={icon_menu_dots}
          handleUnAssignGuard={handleUnAssignGuard}
          guards={paginatedGuards}
        />
      </div>

      <Pagination
        totalEntries={inactiveGuards?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
}

export default InactivePatrolGuards;

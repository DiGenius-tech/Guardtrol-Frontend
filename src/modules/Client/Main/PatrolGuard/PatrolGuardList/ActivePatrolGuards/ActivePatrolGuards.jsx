import { Card } from "flowbite-react";
import PatrolGuardListDesktopView from "../PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "../PatrolGuardListMobileView/PatrolGuardListMobileView";
import icon_menu_dots from "../../../../../../images/icons/icon-menu-dots.svg";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";

import {
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../../../../redux/services/guards";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../../redux/slice/suspenseSlice";
import {
  useGetBeatsQuery,
  useUnAssignFromGuardToBeatMutation,
} from "../../../../../../redux/services/beats";
import { useParams } from "react-router-dom";
import Pagination from "../../../../../../shared/Pagination/Pagination";
import Swal from "sweetalert2";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};

function ActivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { beatId } = useParams();

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const organization = useSelector(selectOrganization);
  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    isUninitialized,
    error,
  } = useGetGuardsQuery(organization, {
    skip: organization ? false : true,
  });

  const { data: beats, refetch: refetchBeats } = useGetBeatsQuery(
    organization,
    {
      skip: organization ? false : true,
    }
  );

  const [selectedBeat, setSelectedBeat] = useState({});

  useEffect(() => {
    setSelectedBeat(beats?.find((b) => b?._id === beatId));
  }, [beats]);

  const [deleteGuard] = useDeleteGuardMutation();
  const [UnAssignGuard] = useUnAssignFromGuardToBeatMutation();

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
          refetchBeats();
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

  useEffect(() => {
    if (isUninitialized) {
      refetchGuards();
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const activeGuards = beatId
    ? selectedBeat?.guards?.filter((guard) => guard.isactive)
    : guards?.filter((guard) => guard.isactive);

  const paginatedGuards = activeGuards?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="relative pb-32">
      {/* active-patrol-guards-app works! */}
      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            icon_menu_dots={icon_menu_dots}
            isLoading={isLoading}
            handleDeleteGuard={handleDeleteGuard}
            handleUnAssignGuard={handleUnAssignGuard}
            guards={paginatedGuards}
          />
        </Card>
      </div>
      <div className="sm:hidden rounded-lg bg-white p-2 min-h-64">
        <PatrolGuardListMobileView
          duty_status={duty_status}
          handleDeleteGuard={handleDeleteGuard}
          icon_menu_dots={icon_menu_dots}
          isLoading={isLoading}
          guards={paginatedGuards}
        />
      </div>

      <Pagination
        totalEntries={activeGuards?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
}

export default ActivePatrolGuards;

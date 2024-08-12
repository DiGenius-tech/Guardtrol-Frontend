import { Button, Card, Spinner, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../redux/services/guards";
import {
  useGetBeatsQuery,
  useUnAssignFromGuardToBeatMutation,
} from "../../../redux/services/beats";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import Pagination from "../../../shared/Pagination/Pagination";
import Swal from "sweetalert2";
import { POOLING_TIME } from "../../../constants/static";
import { useDebouncedValue } from "../../../utils/assetHelper";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 0,
};

function InactivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const { beatId } = useParams();
  const debouncedSearchQuery = useDebouncedValue(searchQuery);

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const organization = useSelector(selectOrganization);
  const {
    data: guards,
    isLoading,
    refetch: refetchGuards,
    isFetching,
    error,
  } = useGetGuardsQuery(
    {
      organization,
      ...(debouncedSearchQuery && { searchQuery: debouncedSearchQuery }),
    },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );
  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const [deleteGuard] = useDeleteGuardMutation();
  const selectedBeat = beatsApiResponse?.beats?.find((b) => b._id === beatId);

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
      <div className="flex gap-2 justify-start mb-2">
        <div className="min-w-40 max-w-64 h-10">
          <TextInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guard Name"
          />
        </div>
        <Button
          color={"green"}
          onClick={refetchGuards}
          className="bg-green-500 text-white px-4 rounded min-w-40 h-10"
          disabled={isFetching}
        >
          {isFetching ? (
            <Spinner
              aria-label="Loading spinner"
              className="mr-2"
              size="sm"
              light
            />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            isLoading={isLoading}
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
          isLoading={isLoading}
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

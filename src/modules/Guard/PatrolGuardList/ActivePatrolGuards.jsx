import { Button, Card, Spinner, TextInput } from "flowbite-react";
import PatrolGuardListDesktopView from "./PatrolGuardListDesktopView";
import PatrolGuardListMobileView from "./PatrolGuardListMobileView";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";

import {
  useClockoutGuardMutation,
  useDeleteGuardMutation,
  useGetGuardsQuery,
} from "../../../redux/services/guards";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import {
  useGetBeatsQuery,
  useUnAssignFromGuardToBeatMutation,
} from "../../../redux/services/beats";
import { useParams } from "react-router-dom";
import Pagination from "../../../shared/Pagination/Pagination";
import Swal from "sweetalert2";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { POOLING_TIME } from "../../../constants/static";
import { useDebouncedValue } from "../../../utils/assetHelper";
import { useGetPatrolsQuery } from "../../../redux/services/patrol";

const duty_status = {
  OFF_DUTY: 0,
  ON_DUTY: 1,
};

function ActivePatrolGuards() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const { beatId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [guardToUnassignId, setGuardToUnassignId] = useState();
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
    isUninitialized,
    isFetching,
    error,
  } = useGetGuardsQuery(
    {
      organization,
      ...(debouncedSearchQuery && { searchQuery: debouncedSearchQuery }),
    },
    {
      skip: organization ? false : true,
    }
  );

  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const [selectedBeat, setSelectedBeat] = useState({});

  useEffect(() => {
    setSelectedBeat(beatsApiResponse?.beats?.find((b) => b?._id === beatId));
  }, [beatsApiResponse]);

  const [deleteGuard] = useDeleteGuardMutation();
  const [clockoutGuard] = useClockoutGuardMutation();
  const [UnAssignGuard] = useUnAssignFromGuardToBeatMutation();

  const {
    data: patrolsAssignedToGuard,
    refetch: refetchPatrolsAssignedToGuard,
  } = useGetPatrolsQuery(
    {
      guard: guardToUnassignId,
      beat: beatId,
    },
    { skip: guardToUnassignId ? false : true }
  );

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
          dispatch(suspenseShow());
          const { data } = await deleteGuard(guardToDelete);
          await refetchGuards();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${guardToDelete?.name || "Guard"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
          dispatch(suspenseHide());
        }
      });
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };

  const handleClockoutGuard = (guardToClockout) => {
    try {
      Swal.fire({
        title: "You won't be able to revert this!",
        text: "Are you sure you want to clock out this Guard?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Clock Out!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(suspenseShow());
          const { data } = await clockoutGuard({
            guard: guardToClockout._id,
            beat: beatId,
            organization,
          });
          await refetchGuards();
          if (data?.status) {
            Swal.fire({
              title: "Guard Clock Out!",
              text: `${guardToClockout?.name || "Guard"} has been clocked out.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
          dispatch(suspenseHide());
        }
      });
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };

  const handleUnAssignGuard = (guardToUnassign) => {
    let removeFromPatrols;
    setGuardToUnassignId(guardToUnassign?._id);
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
          const { data: patrolsAssignedToGuard } =
            await refetchPatrolsAssignedToGuard();

          if (patrolsAssignedToGuard.length) {
            await Swal.fire({
              title: "Guard is assigned to patrols",
              text: "Would you like to remove the guard from the patrols in this Beat?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#008080",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes",
              cancelButtonText: "No",
            }).then(async (result) => {
              if (result.isConfirmed) {
                removeFromPatrols = true;

                await Swal.fire({
                  text: `${
                    guardToUnassign?.name || "Guard"
                  } will be removed from patrol.`,
                  icon: "success",
                  confirmButtonColor: "#008080",
                });
              }

              const { data } = await UnAssignGuard({
                beat: selectedBeat,
                guard: guardToUnassign,
                removeFromPatrols: removeFromPatrols,
              });

              if (data) {
                await refetchGuards();
                await refetchBeats();
                Swal.fire({
                  title: "Unassigned!",
                  text: `${
                    guardToUnassign?.name || "Guard"
                  } has been unassigned.`,
                  icon: "success",
                  confirmButtonColor: "#008080",
                });
              }
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
      <div className="flex gap-2 justify-between mb-2">
        <div className="min-w-40 max-w-64 flex justify-start items-center gap-2">
          <h2 className=" text-2xl font-bold">Active Guards</h2>
          <label
            htmlFor="entriesPerPage"
            className="text-base font-medium text-gray-400"
          >
            Total: {activeGuards?.length || 0}
          </label>
        </div>
        <div className="flex justify-end  gap-2">
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
      </div>
      <div className="hidden sm:block">
        <Card>
          <PatrolGuardListDesktopView
            duty_status={duty_status}
            handleClockoutGuard={handleClockoutGuard}
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
          handleClockoutGuard={handleClockoutGuard}
          icon_menu_dots={icon_menu_dots}
          isLoading={isLoading}
          guards={paginatedGuards}
        />
      </div>

      <Pagination
        totalEntries={activeGuards?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        handleDeleteGuard={handleDeleteGuard}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
    </div>
  );
}

export default ActivePatrolGuards;

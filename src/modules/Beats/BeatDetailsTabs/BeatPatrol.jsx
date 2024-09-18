import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Spinner,
  Dropdown,
  Modal,
  Button,
  TextInput,
  Textarea,
  Label,
} from "flowbite-react";

import Swal from "sweetalert2";
import Pagination from "../../../shared/Pagination/Pagination";
import { format, parseISO } from "date-fns";
import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";
import { selectAuth, selectOrganization } from "../../../redux/selectors/auth";
import {
  useGetPatrolsQuery,
  useDeletePatrolsMutation,
  useUpdatePatrolsMutation,
} from "../../../redux/services/patrol";
import AssignGuardToPatrol from "./assign-beats-to-user";
import { useGetBeatsQuery } from "../../../redux/services/beats";
import { formatTime } from "../../../utils/dateUtils";
import { POOLING_TIME } from "../../../constants/static";

const BeatPatrol = () => {
  const organization = useSelector(selectOrganization);

  const [openCreatePatrolModal, setOpenCreatePatrolModal] = useState(false);
  const [openEditPatrolModal, setOpenEditPatrolModal] = useState(false);
  const [currentPatrol, setCurrentPatrol] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const { beatId } = useParams();
  const { user } = useSelector(selectAuth);
  const {
    data: patrols,
    refetch: refetchPatrols,
    isLoading,
  } = useGetPatrolsQuery({});

  const [selectedBeat, setSelectedBeat] = useState({});

  const [startTime, setStartTime] = useState();

  const [deletePatrol] = useDeletePatrolsMutation();
  const [updatePatrol, { isLoading: isUpdatingPatrol }] =
    useUpdatePatrolsMutation();
  const [selectedGuards, setSelectedGuards] = useState();
  const { data: beatsApiResponse, refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  useEffect(() => {
    setSelectedBeat(beatsApiResponse?.beats?.find((b) => b?._id === beatId));
  }, [beatsApiResponse]);

  const handleDelete = async (patrolToDelete) => {
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
          const { data } = await deletePatrol(patrolToDelete._id);
          refetchPatrols();
          if (data?.status) {
            Swal.fire({
              title: "Deleted!",
              text: `${patrolToDelete?.name || "Patrol"} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#008080",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (patrol) => {
    setCurrentPatrol(patrol);
    setOpenEditPatrolModal(true);
  };

  const handleUpdatePatrol = async () => {
    try {
      const updatedPatrol = {
        ...currentPatrol,
        guards: selectedGuards.map((g) => g.value),
      };
      await updatePatrol(updatedPatrol);
      refetchPatrols();
      setOpenEditPatrolModal(false);
      toast.success("Patrol updated successfully!");
    } catch (error) {
      toast.error("Failed to update patrol.");
      console.error("Error updating patrol:", error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentPatrol({ ...currentPatrol, [e.target.name]: e.target.value });
  };

  const paginatedPatrols = patrols
    ?.filter((pat) => pat.beat === beatId)
    ?.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => {
    setSelectedGuards(
      currentPatrol?.guards?.map((g) => ({
        _id: g._id,
        value: g._id,
        name: g.name,
      })) || []
    );
    if (currentPatrol?.time) {
      const date = parseISO(currentPatrol?.time);
      const formattedTime = format(date, "HH:mm:ss");
      setStartTime(formattedTime);
    }
  }, [currentPatrol]);

  return (
    <div className="relative pb-16">
      {isLoading && (
        <div className="w-full h-full justify-center flex items-center">
          <Spinner color="success" aria-label="Success spinner example" />
        </div>
      )}
      {((!isLoading && paginatedPatrols?.length === 0) ||
        (!isLoading && !paginatedPatrols)) && (
        <div className="w-full h-full py-20 justify-center flex items-center text-gray-700 font-semibold">
          {"No Patrols"}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {!isLoading &&
          paginatedPatrols?.map((patrol) => (
            <div key={patrol._id} className="col-span-1 list-none ">
              <div className="p-6 bg-white border relative border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col gap-2 items-start justify-between text-sm min-w-36">
                  <h3 className="font-bold capitalize">{patrol.name}</h3>
                  <p className="text-dark-200 mb-2">
                    {patrol?.time &&
                      parseISO(patrol?.time) &&
                      format(parseISO(patrol?.time), "HH:mm:ss")}
                  </p>
                  <div className="w-full ">
                    <h4 className="font-bold capitalize">
                      {patrol?.guards.length || ""} Guard(s)
                    </h4>
                    <div className="ml-3 overflow-y-auto w-full h-44">
                      {patrol?.guards?.map((guard, index) => (
                        <h3 key={index} className="text-dark-300">
                          {guard?.name}
                        </h3>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold capitalize">
                      {patrol?.points.length || ""} Point(s)
                    </h4>
                    <div className="ml-3">
                      {patrol?.points?.map((point, index) => (
                        <h3 key={index} className="text-dark-300">
                          {point?.name}
                        </h3>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Dropdown
                      label=""
                      dismissOnClick={false}
                      renderTrigger={() => (
                        <button type="button" className="flex w-8 justify-end">
                          <img src={icon_menu_dots} alt="menu" />
                        </button>
                      )}
                    >
                      <Dropdown.Item onClick={() => handleEdit(patrol)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(patrol)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Pagination
        totalEntries={patrols?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
      <Modal
        show={openEditPatrolModal}
        onClose={() => setOpenEditPatrolModal(false)}
      >
        <Modal.Header>Edit Patrol</Modal.Header>
        <Modal.Body>
          <div className="flex gap-4 flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="name" value={"Enter Patrol Name"} />
                <TextInput
                  id="name"
                  type="name"
                  required
                  name="name"
                  placeholder={"Enter Patrol Name"}
                  value={currentPatrol?.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <Label htmlFor="name" value={"Enter Patrol Description"} />
                <TextInput
                  id="description"
                  type="description"
                  name="description"
                  required
                  placeholder={"Enter patrol description"}
                  value={currentPatrol?.description || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Label htmlFor="frequency" value={"Enter Patrol Frequency"} />
                <TextInput
                  id="frequency"
                  required
                  name="frequency"
                  type="number"
                  placeholder={"Enter patrol frequency"}
                  value={currentPatrol?.frequency || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <Label
                  htmlFor="timetocompletepatrol"
                  value={"Enter Time To Complete Patrol (Minutes)"}
                />
                <TextInput
                  id="timetocompletepatrol"
                  name="timetocompletepatrol"
                  type="number"
                  required
                  placeholder={"Enter patrol Time To Complete Patrol"}
                  value={currentPatrol?.timetocompletepatrol || ""}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="">
                <Label htmlFor="startTime" value={"Enter Patrol Start Time"} />
                <div className="flex items-center gap-2">
                  <input
                    className="border-gray-300 bg-gray-100 w-full rounded-md "
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>
              </div> */}
            </div>

            <div>
              {selectedGuards && (
                <AssignGuardToPatrol
                  selectedGuards={selectedGuards}
                  setSelectedGuards={setSelectedGuards}
                />
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            isProcessing={isUpdatingPatrol}
            disabled={isUpdatingPatrol}
            onClick={() => handleUpdatePatrol()}
            style={{ backgroundColor: "#008080" }}
            type="submit"
          >
            Save Changes
          </Button>
          <Button
            isProcessing={isUpdatingPatrol}
            disabled={isUpdatingPatrol}
            onClick={() => setOpenEditPatrolModal(false)}
            color={"gray"}
            type="submit"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BeatPatrol;

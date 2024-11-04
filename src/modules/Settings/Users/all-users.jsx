import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import icon_menu_dots from "../../../images/icons/icon-menu-dots.svg";

import Swal from "sweetalert2";
import Pagination from "../../../shared/Pagination/Pagination";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../../redux/services/organization-users";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import UserListDesktopView from "./all-users-desktop";
import UserListMobileView from "./all-users-mobile";
import AssignBeatsToUser from "./assign-beats-to-user";

const roles = ["Supervisor", "Manager", "Client"];

function OrganizationUsers() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);

  const {
    data: organizationUsers,
    isLoading,
    isFetching: isFetchingUsers,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery(organization);

  const [createUser, { isLoading: isCreatingUser, isError }] =
    useAddUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    whatsappNumber: "",
    isDirectCreator: false,
    assignedBeats: [], // Add beats field
  });
  const [errors, setErrors] = useState({});
  const [selectedBeats, setSelectedBeats] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);

      setUserForm({
        name: user.name,
        isDirectCreator: user.isDirectCreator,
        email: user.email,
        whatsappNumber: user.whatsappNumber,
        role: user?.role?.name,
        assignedBeats: user.assignedBeats || [],
      });
      setSelectedBeats(
        user?.role?.assignedBeats.map((b) => ({
          _id: b._id,
          value: b._id,
          name: b.name,
        })) || []
      );
      setEditMode(true);
    } else {
      setSelectedUser(null);
      setUserForm({
        name: "",
        whatsappNumber: "",
        email: "",
        password: "",
        role: "",
        assignedBeats: [], // Reset beats
      });
      setSelectedBeats([]); // Reset selected beats
      setEditMode(false);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserForm({
      ...userForm,
      [name]: value,
    });

    if (name === "password" && value.length < 8) {
      setErrors({
        ...errors,
        password: "Password must be at least 8 characters long",
      });
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: "Please enter a valid email address",
        });
      } else {
        setErrors({ ...errors, email: "" });
      }
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setUserForm((prevForm) => {
      return { ...prevForm, role: value };
    });
  };

  const handleSaveUser = async () => {
    // Validate all fields before saving
    const newErrors = {};
    if (!userForm.name) newErrors.name = "Name is required";
    if (!userForm.email) newErrors.email = "Email is required";
    if (!userForm.password && !editMode)
      newErrors.password = "Password is required";
    if (!userForm.whatsappNumber)
      newErrors.whatsappNumber = "Whatsapp number is required";
    if (!userForm.role) newErrors.role = "Role is required";
    if (userForm.password && userForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userData = {
        ...userForm,
        assignedBeats: selectedBeats.map((sb) => sb.value),
        organizationId: user.organization,
      };

      if (editMode) {
        await updateUser({ id: selectedUser._id, ...userData });
        toast.success("User updated successfully");
      } else {
        await createUser(userData);
        toast.success("User created successfully");
      }

      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      await refetchUsers();
    }
  };

  const handleDeleteUser = (userToDelete) => {
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
        await deleteUser({
          organizationId: user.organization,
          userToDelete: userToDelete._id,
        });
        refetchUsers();
        toast.success("User deleted successfully");
      }
    });
  };

  const paginatedUsers = organizationUsers?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="relative pb-16 ">
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className=" text-2xl font-bold">All Users</h2>

        <div className="flex justify-end items-center gap-3 flex-wrap ">
          <Button className="bg-[#008080] " onClick={() => handleOpenModal()}>
            Create User
          </Button>
          <Button
            onClick={refetchUsers}
            className="bg-[#008080] text-white px-4 min-w-40 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
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
        <Card className=" min-h-96 overflow-y-auto">
          {isFetchingUsers ? (
            <div className="w-full h-full justify-center flex items-center">
              <Spinner color="success" />
            </div>
          ) : (
            <UserListDesktopView
              users={paginatedUsers}
              handleEditUser={handleOpenModal}
              handleDeleteUser={handleDeleteUser}
              icon_menu_dots={icon_menu_dots}
            />
          )}
          {!isFetchingUsers && paginatedUsers?.length === 0 && (
            <div className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <div
                colSpan={4}
                className="whitespace-nowrap font-medium  text-center text-gray-900 dark:text-white"
              >
                {"No Users"}
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="sm:hidden rounded-lg bg-white p-2 pb-20">
        {isFetchingUsers ? (
          <div className="w-full h-full justify-center flex items-center">
            <Spinner color="success" />
          </div>
        ) : (
          <UserListMobileView
            users={paginatedUsers}
            handleEditUser={handleOpenModal}
            handleDeleteUser={handleDeleteUser}
            icon_menu_dots={icon_menu_dots}
          />
        )}
      </div>
      <Pagination
        totalEntries={organizationUsers?.length || 0}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEntriesPerPageChange={setEntriesPerPage}
      />
      <Modal show={showModal} onClose={handleCloseModal}>
        <Modal.Header>{editMode ? "Edit User" : "Create User"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              label="Name"
              readOnly={editMode && !userForm?.isDirectCreator}
              name="name"
              value={userForm.name}
              onChange={handleChange}
              placeholder="Enter User Name"
              required
              helperText={
                errors?.name && (
                  <span className="text-red-500">{errors.name}</span>
                )
              }
            />
            <TextInput
              label="Email"
              error={errors?.email}
              readOnly={editMode && !userForm?.isDirectCreator}
              name="email"
              value={userForm.email}
              onChange={handleChange}
              placeholder="Enter User Email"
              required
              helperText={
                errors?.email && (
                  <span className="text-red-500">{errors.email}</span>
                )
              }
            />

            {((editMode && userForm?.isDirectCreator) || !editMode) && (
              <>
                <TextInput
                  label="Password"
                  name="password"
                  error={errors?.password}
                  value={userForm.password}
                  onChange={handleChange}
                  placeholder="Enter User Password"
                  required
                  helperText={
                    errors?.password && (
                      <span className="text-red-500">{errors.password}</span>
                    )
                  }
                />
                <TextInput
                  label="Whatsapp Number"
                  name="whatsappNumber"
                  value={userForm.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter user Whatsapp Number"
                  required
                  type="number"
                  helperText={
                    errors?.whatsappNumber && (
                      <span className="text-red-500">
                        {errors.whatsappNumber}
                      </span>
                    )
                  }
                />
                <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
                  <h4 className="font-bold text-yellow-800">
                    Important Notice
                  </h4>
                  <p className="text-yellow-700">
                    To receive notifications on WhatsApp, please ensure that you
                    have accepted the most recent WhatsApp policy and terms.
                    Click the link below to review and accept the terms.
                  </p>
                  <a
                    href="https://wa.me/tos/20210210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Review and Accept WhatsApp Terms
                  </a>
                </div>
              </>
            )}

            <Select
              label="Roles"
              required
              value={userForm?.role}
              onChange={handleRoleChange}
              helperText={
                errors?.role && (
                  <span className="text-red-500">{errors.role}</span>
                )
              }
            >
              <option value={""}>Select Role</option>
              {roles?.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            {(userForm.role === "Supervisor" || userForm.role === "Client") &&
              selectedBeats && (
                <AssignBeatsToUser
                  selectedBeats={selectedBeats}
                  setSelectedBeats={setSelectedBeats}
                />
              )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isUpdatingUser || isCreatingUser}
            className="bg-[#008080] "
            onClick={handleSaveUser}
          >
            {editMode ? "Update" : "Create"}
            {(isUpdatingUser || isCreatingUser) && !isError && (
              <Spinner
                aria-label="Loading spinner"
                className="ml-2"
                color="success"
              />
            )}
          </Button>
          <Button color="gray" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrganizationUsers;

import React, { useState, useEffect } from "react";
import { Card, Button, Modal, TextInput, Select } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import icon_menu_dots from "../../../../images/icons/icon-menu-dots.svg";

import Swal from "sweetalert2";
import Pagination from "../../../../shared/Pagination/Pagination";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../../../redux/services/organization-users";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import UserListDesktopView from "./all-users-desktop";
import UserListMobileView from "./all-users-mobile";

const roles = ["Supervisor", "Manager", "Owner"];

function OrganizationUsers() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const {
    data: organizationUsers,
    isLoading,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery(user.organization);
  const [createUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "Password",
    role: "",
  });

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
        email: user.email,
        role: user.role,
      });
      setEditMode(true);
    } else {
      setSelectedUser(null);
      setUserForm({
        name: "",
        email: "",
        role: "",
      });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;

    setUserForm((prevForm) => {
      return { ...prevForm, role: value };
    });
  };

  const handleSaveUser = async () => {
    try {
      if (editMode) {
        await updateUser({
          id: selectedUser._id,
          ...userForm,
          organizationId: user.organization,
        });
        toast.success("User updated successfully");
      } else {
        await createUser({ ...userForm, organizationId: user.organization });
        toast.success("User created successfully");
      }
      refetchUsers();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
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
    <div className="relative pb-16">
      <div className="flex justify-between items-center">
        <h2 className=" text-2xl font-bold">All Users</h2>
        <Button className="bg-[#008080] mb-5" onClick={() => handleOpenModal()}>
          Create User
        </Button>
      </div>
      <div className="hidden sm:block">
        <Card>
          <UserListDesktopView
            users={paginatedUsers}
            handleEditUser={handleOpenModal}
            handleDeleteUser={handleDeleteUser}
            icon_menu_dots={icon_menu_dots}
          />
        </Card>
      </div>
      <div className="sm:hidden rounded-lg bg-white p-2">
        <UserListMobileView
          users={paginatedUsers}
          handleEditUser={handleOpenModal}
          handleDeleteUser={handleDeleteUser}
          icon_menu_dots={icon_menu_dots}
        />
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
              name="name"
              value={userForm.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
            />
            <TextInput
              label="Email"
              name="email"
              value={userForm.email}
              onChange={handleChange}
              placeholder="Enter user email"
              required
            />
            <TextInput
              label="Password"
              name="password"
              value={userForm.password}
              onChange={handleChange}
              placeholder="Enter user password"
              required
            />
            <Select
              label="Roles"
              required
              value={userForm.role}
              onChange={handleRoleChange}
            >
              <option value={""}>Select Role</option>
              {roles?.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-[#008080] " onClick={handleSaveUser}>
            {editMode ? "Update" : "Create"}
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

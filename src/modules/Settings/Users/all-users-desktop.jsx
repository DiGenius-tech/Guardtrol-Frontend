import React from "react";
import { Table, Button } from "flowbite-react";

const UserListDesktopView = ({
  users,
  handleEditUser,
  handleDeleteUser,
  icon_menu_dots,
}) => {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Roles</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {users?.map((user) => (
          <Table.Row key={user._id}>
            <Table.Cell>{user?.name}</Table.Cell>
            <Table.Cell>{user?.email}</Table.Cell>
            <Table.Cell>{user?.role?.name}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <>
                  <Button
                    className="bg-[#008080]"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </Button>

                  <Button onClick={() => handleDeleteUser(user)} color="red">
                    Delete
                  </Button>
                </>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default UserListDesktopView;

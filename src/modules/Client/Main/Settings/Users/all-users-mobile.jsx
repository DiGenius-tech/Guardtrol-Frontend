import React from "react";
import { Card, Button } from "flowbite-react";

const UserListMobileView = ({
  users,
  handleEditUser,
  handleDeleteUser,
  icon_menu_dots,
}) => {
  return (
    <>
      {users?.map((user) => (
        <Card key={user._id} className="mb-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900">
            {user.name}
          </h5>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-gray-700">{user.role}</p>
          <div className="flex space-x-2 mt-4">
            <Button
              className="bg-[#008080]"
              onClick={() => handleEditUser(user)}
            >
              Edit
            </Button>
            <Button onClick={() => handleDeleteUser(user)} color="red">
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
};

export default UserListMobileView;

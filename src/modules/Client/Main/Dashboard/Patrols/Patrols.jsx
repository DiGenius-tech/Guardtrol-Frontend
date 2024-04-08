import { Table } from "flowbite-react";
import React from "react";

const patrols = [
  {
    id: 1,
    guard: {
      name: "Thomas Prosper"
    },
    time: "09:00AM",
    isCompleted: true
  },
  {
    id: 2,
    guard: {
      name: "John Doe"
    },
    time: "09:00AM",
    isCompleted: false
  }
];

const Patrols = () => {
  return (
    <>
      {/* patrols-app works! */}
      <div className="overflow-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Guard name</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only"></span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {patrols.map((patrol) => {
              return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={patrol.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {patrol.guard.name}
                  </Table.Cell>
                  <Table.Cell>{patrol.time}</Table.Cell>
                  <Table.Cell>
                    {patrol.isCompleted ? (
                      <span className="text-green-400">Completed</span>
                    ) : (
                      <span className="text-red-400">Not completed</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href="#"
                      className="font-medium text-primary-500 hover:underline dark:text-cyan-500"
                    >
                      View
                    </a>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default Patrols;

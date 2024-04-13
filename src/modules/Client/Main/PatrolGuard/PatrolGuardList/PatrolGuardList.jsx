import { Card, Table } from "flowbite-react";
import "./PatrolGuardList.scss";

function PatrolGuardList() {
  return (
    <>
      {/* patrol-guard-list-app works! */}

      <Card>
        {/* <div className="patrol-guard-list-table overflow-x-auto remove-scrollbar"> */}
        <div className="patrol-guard-list-table">
          <Table>
            <Table.Head className="hidden sm:block">
              <Table.HeadCell>Guard name</Table.HeadCell>
              <Table.HeadCell>Phone number</Table.HeadCell>
              <Table.HeadCell className="hidden sm:block">
                Email address
              </Table.HeadCell>
              <Table.HeadCell className="hidden sm:block">
                Status
              </Table.HeadCell>
              <Table.HeadCell className="hidden sm:block">
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <span>{'Apple MacBook Pro 17"'}</span>
                  <span className="block sm:hidden">
                    {" "}
                    <br />
                    "johndoe@gmaol.com"
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {"08033422544"}
                  <span className="block sm:hidden">
                    {" "}
                    <br />
                    "On-duty"
                  </span>
                </Table.Cell>
                <Table.Cell className="hidden sm:block">Laptop</Table.Cell>
                <Table.Cell className="hidden sm:block">$2999</Table.Cell>
                <Table.Cell className="hidden sm:block">
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Card>
    </>
  );
}

export default PatrolGuardList;

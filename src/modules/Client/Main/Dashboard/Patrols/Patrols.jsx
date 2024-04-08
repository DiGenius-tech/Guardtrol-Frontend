import { Table } from 'flowbite-react';
import React from 'react';


const patrols = [
    {
        id: 1,
        name: "Thomas Prosper",
        time: "09:00AM",
        status: "completed"
    },
    {
        id: 2,
        name: "John Doe",
        time: "09:00AM",
        status: "completed"
    },
]

const Patrols = () => {
    return (
        <>
            {/* patrols-app works! */}
            <div className='overflow-auto'>
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
                        {
                            patrols.map((guard) => {
                                return <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{guard.name}</Table.Cell>
                                    <Table.Cell>{guard.time}</Table.Cell>
                                    <Table.Cell>{guard.status}</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                            View
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            })
                        }
                    </Table.Body>
                </Table></div>

        </>
    );
}

export default Patrols;

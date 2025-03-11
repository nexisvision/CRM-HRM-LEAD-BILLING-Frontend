import React from 'react';
import { Card } from 'antd';

const UserList = () => {


    return (
        <Card className=''>
            <div className="overflow-x-auto">
                <figcaption className='font-semibold text-lg mb-1'>Users</figcaption>
                <table className="w-full bg-white text-center text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Assigned Tasks</th>
                            <th className="px-4 py-2">Done Tasks</th>
                            <th className="px-4 py-2">Logged Hours</th>
                        </tr>
                    </thead>
                    <tbody className="border-gray-50">

                        <tr className='border-b'>
                            <td className="px-4 py-2">Workdo</td>
                            <td className="px-4 py-2">1</td>
                            <td className="px-4 py-2">0</td>
                            <td className="px-4 py-2">0</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 text-center">
                                Buffy Walter
                            </td>
                            <td className="px-4 py-2">4</td>
                            <td className="px-4 py-2">2</td>
                            <td className="px-4 py-2">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </Card>
    );
};

export default UserList;


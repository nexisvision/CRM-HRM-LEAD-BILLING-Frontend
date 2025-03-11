import React from 'react';
import { Card } from 'antd';


const MilestonsList = () => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <figcaption className='font-semibold text-lg mb-1'>Milestones</figcaption>
                <table className="w-full bg-white text-center text-xs">
                    <thead className="bg-gray-50  border-b-gray-100">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Progress</th>
                            <th className="px-4 py-2">Cost</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Start Date</th>
                            <th className="px-4 py-2">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="6" className="text-center px-4 py-2">
                                No milestones available
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </Card>
    );
};

export default MilestonsList;


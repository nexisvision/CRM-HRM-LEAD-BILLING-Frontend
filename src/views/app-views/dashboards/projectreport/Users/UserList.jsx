import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddContract from './AddContract';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';



const UserList = () => {
    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);


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


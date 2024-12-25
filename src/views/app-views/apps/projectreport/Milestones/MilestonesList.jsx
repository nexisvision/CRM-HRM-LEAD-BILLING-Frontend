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



const MilestonsList = () => {
    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);


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


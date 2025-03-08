import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, CopyOutlined, EditOutlined, LinkOutlined, FileExcelOutlined } from '@ant-design/icons';

import MilestonsList from './Milestones/MilestonesList';
import UserList from './Users/UserList';
import TableViewList from './ProjectViewTable/TableViewList';



function ViewProjectReport() {

    return (
        <>
            <div>
                <div className='bg-gray-50 ml-[-44px] mr-[-44px] mt-[-72px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-4 font-medium"></h2>
                    <div className='mt-3'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 rounded-lg'>
                        <div >
                            <UserList />
                        </div>
                        <div>
                            <MilestonsList />
                        </div>
                    </div>

                    <div>
                        <TableViewList />
                    </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ViewProjectReport;



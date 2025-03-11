import React, { useState } from 'react';
import { Card, Table, Tag, Input, Button } from 'antd';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import userData from 'assets/data/user-list.data.json';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex';
import OrderListData from 'assets/data/order-list.data.json';

import utils from 'utils';



function TableViewList() {
    const [list, setList] = useState(OrderListData);
    const users = userData;

    const getProjectReportPriority = status => {
        if (status === 'High') {
            return 'orange'
        }
        if (status === 'Medium') {
            return 'cyan'
        }
        if (status === 'Critical') {
            return 'blue'
        }
        return ''
    }

    const getProjectReportStage = stage => {
        if (stage === '	To Do') {
            return 'orange'
        }
        if (stage === 'In Progress') {
            return 'cyan'
        }
        if (stage === 'Done') {
            return 'blue'
        }
        return ''
    }

    // Search functionality
    const onSearch = (e) => {
        const value = e.currentTarget.value;
        const searchArray = value ? list : OrderListData;
        const data = utils.wildCardSearch(searchArray, value);
        setList(data);
    };


    const tableColumns = [
        {
            title: 'Task Name',
            dataIndex: 'taskname',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Milestone',
            dataIndex: 'milestone',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Due Date',
            dataIndex: 'duedate',
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Assigned to',
            dataIndex: 'assignedto',
            render: (_, record) => (
                <div className="d-flex">
                    <AvatarStatus size={30} src={record.image} />
                </div>
            ),
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Total Logged Hours',
            dataIndex: 'totalloggedhours',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Priority',
            dataIndex: 'status',
            render: (_, record) => (
                <><Tag color={getProjectReportPriority(record.orderStatus)}>{record.orderStatus}</Tag></>
            ),
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Stage',
            dataIndex: 'stage',
            render: (_, record) => (
                <><Tag color={getProjectReportStage(record.orderStatus)}></Tag></>
            ),
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
    ];



    return (
        <>
            <Flex alignItems="center" mobileFlex={false} className='flex justify-end mb-3'>
                <Flex gap="7px" >
                    <Button type="primary" className='flex items-center' icon={<FileExcelOutlined />} block>
                        Export
                    </Button>
                </Flex>
            </Flex>
            <Card className='border-2'>

                <Flex alignItems="center" mobileFlex={false} className='flex justify-end'>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
                        </div>
                    </Flex>
                </Flex>

                <div className="table-responsive mt-2">
                    <Table
                        columns={tableColumns}
                        dataSource={users}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                    />
                </div>
            </Card>


        </>
    )
}

export default TableViewList;

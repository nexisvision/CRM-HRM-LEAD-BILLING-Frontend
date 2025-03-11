import React from 'react'
import { useState } from 'react'

import { Card, Table, Input } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'


export const PlanRequestList = () => {
    const [users, setUsers] = useState([]);

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Plan Name',
            dataIndex: 'planname',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'planname')
        },
        {
            title: 'Total Users',
            dataIndex: 'totalusers',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalusers')
        },
        {
            title: 'Total Customers',
            dataIndex: 'totalcustomers',

            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalcustomers')
        },
        {
            title: 'Total Vendors',
            dataIndex: 'totalvendors',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalvendors')
        },
        {
            title: 'Total Clients',
            dataIndex: 'totalclients',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalclients')
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'duration')
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center flex gap-3">
                    <CheckOutlined className='border border-gray-300 bg-blue-400 text-white p-1' />
                    <CloseOutlined className='border border-gray-300 bg-white text-red-500 p-1 ' />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'action')
        }
    ];


    const onSearch = e => {
        const value = e.currentTarget.value
        const searchArray = e.currentTarget.value ? users : []
        const data = utils.wildCardSearch(searchArray, value)
        setUsers(data)
    }

    return (
        <div className="container">
            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={users}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                    />
                </div>
            </Card>
        </div>
    );
}


export default PlanRequestList
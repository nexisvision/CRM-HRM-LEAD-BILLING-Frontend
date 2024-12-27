import React, { Component } from 'react'
import { useState } from 'react'
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Switch } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import userData from '../../../../assets/data/user-list.data.json';



const { Column } = Table;

const { Option } = Select


export const CurrenciesList = () => {
    const [users, setUsers] = useState(userData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'currenciename',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currenciename')
        },
        {
            title: 'Currency Icon',
            dataIndex: 'currencyicon',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currencyicon')
        },
        {
            title: 'Currency Code',
            dataIndex: 'currencycode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currencycode')
        },
    ];


    const onSearch = e => {
        const value = e.currentTarget.value
        const searchArray = e.currentTarget.value ? users : userData
        const data = utils.wildCardSearch(searchArray, value)
        setUsers(data)
        setSelectedRowKeys([])
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
                        scroll={{ x: 1000 }}
                    />
                </div>

            </Card>
        </div>
    );
}


export default CurrenciesList

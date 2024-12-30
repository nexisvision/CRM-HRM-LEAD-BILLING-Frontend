import React, { useEffect, useState } from 'react'
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Switch } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import userData from '../../../../assets/data/user-list.data.json';
import { useDispatch, useSelector } from 'react-redux';
import { getallcurrencies } from './currenciesreducer/currenciesSlice';



const { Column } = Table;

const { Option } = Select


export const CurrenciesList = () => {
    const [users, setUsers] = useState(userData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const dispatch = useDispatch();
    const { currencies } = useSelector(
        (state) => state.currencies
    );

     // Get countries data from Redux store
    //  const { countries, isLoading } = useSelector((state) => state.countries);

     useEffect(() => {
         dispatch(getallcurrencies());
     }, [dispatch]);

     useEffect(() => {
        setFilteredData(currencies);
    }, [currencies]);

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'currencyName',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currencyName')
        },
        {
            title: 'Currency Icon',
            dataIndex: 'currencyIcon',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currencyIcon')
        },
        {
            title: 'Currency Code',
            dataIndex: 'currencyCode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'currencyCode')
        },
    ];


    const onSearch = e => {
        const value = e.currentTarget.value.toLowerCase();
        
        // If search value is empty, show all data
        if (!value) {
            setFilteredData(currencies);
            return;
        }

        // Filter the data based on search value
        const filtered = currencies.filter(item => 
            item.currencyName?.toLowerCase().includes(value) ||
            item.currencyIcon?.toLowerCase().includes(value) ||
            item.currencyCode?.toLowerCase().includes(value)
        );
        
        setFilteredData(filtered);
    }

    // const onSearch = e => {
    //     const value = e.currentTarget.value
    //     const searchArray = e.currentTarget.value ? users : userData
    //     const data = utils.wildCardSearch(searchArray, value)
    //     setUsers(data)
    //     setSelectedRowKeys([])
    // }


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
                        dataSource={filteredData}
                        rowKey='id'
                        scroll={{ x: 1000 }}
                    />
                </div>

            </Card>
        </div>
    );
}


export default CurrenciesList

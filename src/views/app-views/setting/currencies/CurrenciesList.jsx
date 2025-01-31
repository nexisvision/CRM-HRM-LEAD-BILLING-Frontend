import React, { useEffect, useState } from 'react'
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Switch, message } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import userData from '../../../../assets/data/user-list.data.json';
import { useDispatch, useSelector } from 'react-redux';
// import { getallcurrencies } from './currenciesreducer/currenciesSlice';
import AddCurrencies from './AddCurrencies';
import EditCurrencies from './EditCurrencies';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { deletecurren, getcurren } from './currenciesSlice/currenciesSlice';

const { Column } = Table;

const { Option } = Select

export const CurrenciesList = () => {
    const [users, setUsers] = useState(userData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isAddCurrenciesModalVisible, setIsAddCurrenciesModalVisible] = useState(false);
    const [isEditCurrenciesModalVisible, setIsEditCurrenciesModalVisible] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const dispatch = useDispatch();
    const { currencies } = useSelector(
        (state) => state.currencies.currencies
    );

    useEffect(() => {
        dispatch(getcurren());
    }, [dispatch]);

    const allcurrdata = useSelector((state)=>state.currencies.currencies)

     // Get countries data from Redux store
    //  const { countries, isLoading } = useSelector((state) => state.countries);

     useEffect(() => {
        if(allcurrdata){
            setFilteredData(allcurrdata);
        }
    }, [allcurrdata]);

    const openAddCurrenciesModal = () => {
        setIsAddCurrenciesModalVisible(true);
    };

    const openEditCurrenciesModal = (currency) => {
        setIsEditCurrenciesModalVisible(true);
        setSelectedCurrency(currency);
    };

    const handleModalClose = () => {
        setIsAddCurrenciesModalVisible(false);
        setIsEditCurrenciesModalVisible(false);
        setSelectedCurrency(null);
    };

    const handleDeleteCurrency = (id) => {
       dispatch(deletecurren(id))
        .then(()=>{
            dispatch(getcurren())
            message.success('Currency deleted successfully');
            setFilteredData(filteredData.filter(item => item.id!== id));
        })
    };

    const onSearch = e => {
        const value = e.currentTarget.value.toLowerCase();
        
        // If search value is empty, show all data
        if (!value) {
            setFilteredData(allcurrdata);
            return;
        }

        // Filter the data based on search value
        const filtered = allcurrdata.filter(item => 
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

    const dropdownMenu = (elm) => (
        <Menu>
            {/* <Menu.Item>
                <Flex alignItems="center" onClick={() => openEditCurrenciesModal(elm)}>
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item> */}
            <Menu.Item>
                <Flex alignItems="center" onClick={() => handleDeleteCurrency(elm.id)}>
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

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
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            )
        }
    ];

    return (
        <div className="container">
            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddCurrenciesModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
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
            <Modal
                title="Add Currencies"
                visible={isAddCurrenciesModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={700}
                className='mt-[-70px]'
            >
                <AddCurrencies onClose={handleModalClose} />
            </Modal>
            <Modal
                title="Edit Currencies"
                visible={isEditCurrenciesModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={700}
                className='mt-[-70px]'
            >
                <EditCurrencies onClose={handleModalClose} currency={selectedCurrency} />
            </Modal>
        </div>
    );
}

export default CurrenciesList
     
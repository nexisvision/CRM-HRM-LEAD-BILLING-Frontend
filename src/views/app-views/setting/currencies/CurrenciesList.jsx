import React, { useEffect, useState } from 'react'
import { Card, Table, Input, Button, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { useDispatch, useSelector } from 'react-redux';
import AddCurrencies from './AddCurrencies';
import { getcurren } from './currenciesSlice/currenciesSlice';
import { getRoles } from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';

export const CurrenciesList = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [isAddCurrenciesModalVisible, setIsAddCurrenciesModalVisible] = useState(false);
    const dispatch = useDispatch();
    const filterdata = useSelector((state) => state.currencies?.currencies?.data);

    // Get logged-in user data
    const userData = useSelector((state) => state.user?.loggedInUser)
    const roles = useSelector((state) => state.role?.role?.data);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    // Check if user is super-admin
    const isSuperAdmin = () => {
        const userRole = roles?.find(role => role.id === userData?.role_id);
        return userRole?.role_name === 'super-admin';
    };


    useEffect(() => {
        if (!filterdata || filterdata.length === 0) {
            dispatch(getcurren());
        }
    }, [dispatch, filterdata]);

    const allcurrdata = filterdata?.filter((item) => item?.created_by === userData?.username);

    useEffect(() => {
        if (filterdata && Array.isArray(filterdata)) {
            setFilteredData(filterdata);
        } else {
            setFilteredData([]);
        }
    }, [filterdata]);

    const openAddCurrenciesModal = () => {
        setIsAddCurrenciesModalVisible(true);
    };

    const handleModalClose = () => {
        setIsAddCurrenciesModalVisible(false);
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
        }
    ];

    return (
        <div className="w-full">
            <Card className="w-full">
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className="w-full mb-4">
                    <Flex className="w-full md:w-auto" mobileFlex={false}>
                        <div className="w-full md:w-48">
                            <Input 
                                placeholder="Search" 
                                prefix={<SearchOutlined />} 
                                onChange={e => onSearch(e)}
                                className="w-full" 
                            />
                        </div>
                    </Flex>
                    {/* Only show Add button if role_name is super-admin */}
                    {isSuperAdmin() && (
                        <Flex gap="7px" className="flex">
                            <Button
                                type="primary"
                                className="flex items-center"
                                onClick={openAddCurrenciesModal}
                            >
                                <PlusOutlined />
                                <span className="ml-2">Add Currency</span>
                            </Button>
                        </Flex>
                    )}
                </Flex>
                <div className="w-full overflow-x-auto">
                    <Table
                        columns={tableColumns}
                        dataSource={filteredData}
                        rowKey='id'
                        scroll={{ x: true }}
                        className="w-full"
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
        </div>
    );
}

export default CurrenciesList

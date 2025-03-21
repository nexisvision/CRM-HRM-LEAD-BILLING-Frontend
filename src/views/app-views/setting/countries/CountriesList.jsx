import React, { useEffect, useState } from 'react'
import { Card, Table, Input, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { useDispatch, useSelector } from 'react-redux';
import { getallcountries } from './countriesreducer/countriesSlice';
import AddCountries from './AddCountries';
import EditCountries from './EditCountries';
import { getRoles } from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';

export const CountriesList = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [isAddCountriesModalVisible, setIsAddCountriesModalVisible] = useState(false);
    const [isEditCountriesModalVisible, setIsEditCountriesModalVisible] = useState(false);
    const dispatch = useDispatch();
    const idd = ""
    const [searchText, setSearchText] = useState('');

    // Get logged-in user data
    const userData = useSelector((state) => state.user?.loggedInUser);
    const roles = useSelector((state) => state.role?.role?.data);

    useEffect(() => {
        dispatch(getallcountries());
    }, [dispatch]);

    const countries = useSelector((state) => state.countries.countries);

    useEffect(() => {
        if (countries) {
            setFilteredData(countries);
        }
    }, [countries]);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    const isSuperAdmin = () => {
        const userRole = roles?.find(role => role.id === userData?.role_id);
        return userRole?.role_name === 'super-admin';
    };

    // Open Add Job Modal
    const openAddCountriesModal = () => {
        setIsAddCountriesModalVisible(true);
    };

    const handleModalClose = () => {
        setIsAddCountriesModalVisible(false);
        setIsEditCountriesModalVisible(false);
    };

    // Search function
    const onSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        // If search value is empty, show all data
        if (!value) {
            setFilteredData(countries);
            return;
        }

        // Filter the data based on country name
        const filtered = countries.filter(country =>
            country.countryName?.toLowerCase().includes(value)
        );

        setFilteredData(filtered);
    };

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'countryName',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'countryName')
        },
        {
            title: 'Country Code',
            dataIndex: 'countryCode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'countryCode')
        },
        {
            title: 'Phone Code',
            dataIndex: 'phoneCode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'phoneCode')
        }
    ];

    return (
        <div className="w-full">
            <Card className="w-full">
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className="w-full mb-4">
                    <Flex className="w-full md:w-auto" mobileFlex={false}>
                        <div className="w-full md:w-48">
                            <Input.Group compact>
                                <Input
                                    placeholder="Search by country name..."
                                    prefix={<SearchOutlined />}
                                    onChange={onSearch}
                                    value={searchText}
                                    allowClear
                                    className="w-full"
                                    onPressEnter={() => message.success('Search completed')}
                                />
                            </Input.Group>
                        </div>
                    </Flex>
                    {/* Only show Add button if role_name is super-admin */}
                    {isSuperAdmin() && (
                        <Flex gap="7px" className="flex">
                            <Button
                                type="primary"
                                className="flex items-center"
                                onClick={openAddCountriesModal}
                            >
                                <PlusOutlined />
                                <span className="ml-2">Add Country</span>
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
                        pagination={{
                            total: filteredData.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                        }}
                    />
                </div>
            </Card>
            <Modal
                title="Add Countries"
                visible={isAddCountriesModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={700}
                className='mt-[-70px]'
            >
                <AddCountries onClose={handleModalClose} />
            </Modal>
            <Modal
                title="Edit Countries"
                visible={isEditCountriesModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={700}
                className='mt-[-70px]'
            >
                <EditCountries onClose={handleModalClose} idd={idd} />
            </Modal>
        </div>
    );
}

// Add styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  .ant-input-group .ant-input {
    width: 100%;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-group {
      width: 100%;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const CountriesListWithStyles = () => (
    <>
        <style>{styles}</style>
        <CountriesList />
    </>
);

export default CountriesListWithStyles;
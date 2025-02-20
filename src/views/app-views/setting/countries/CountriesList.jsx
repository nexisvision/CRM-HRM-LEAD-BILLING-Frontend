import React, { useEffect, useState } from 'react'
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, message, Switch } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import utils from 'utils'
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { DeletePs, getallcountries } from './countriesreducer/countriesSlice';
import { deleteCountries } from './countriesreducer/countriesSlice';
import userData from 'assets/data/user-list.data.json';
import AddCountries from './AddCountries';
import EditCountries from './EditCountries';
import { getRoles } from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';
const { Column } = Table;
const { Option } = Select
export const CountriesList = () => {
    // const [countries, setCountries] = useState([]);


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isAddCountriesModalVisible, setIsAddCountriesModalVisible] = useState(false);
    const [isEditCountriesModalVisible, setIsEditCountriesModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [idd, setIdd] = useState("");
    const [searchText, setSearchText] = useState('');

      // Get logged-in user data
      const userData = useSelector((state) => state.user?.loggedInUser);
      const roles = useSelector((state) => state.role?.role?.data);

    useEffect(() => {
        dispatch(getallcountries());
    }, [dispatch]);


    const countries = useSelector((state)=>state.countries.countries);

    const loggedIndata = useSelector((state)=>state.user.loggedInUser.username)

    // const countries = filterdata?.filter((item)=>item?.created_by === loggedIndata)

     // Get countries data from Redux store
    //  const { countries, isLoading } = useSelector((state) => state.countries);

     useEffect(() => {
        if(countries){
            setFilteredData(countries);
        }
    }, [countries]);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    // Check if user is super-admin
    const isSuperAdmin = () => {
        const userRole = roles?.find(role => role.id === userData?.role_id);
        return userRole?.role_name === 'super-admin';
    };
  
    // Open Add Job Modal
    const openAddCountriesModal = () => {
        setIsAddCountriesModalVisible(true);
    };
    // Close Add Job Modal
    // const closeAddCountriesModal = () => {
    //     setIsAddCountriesModalVisible(false);
    // };
    // Open Add Job Modal
    const openEditCountriesModal = (country) => {
        setIsEditCountriesModalVisible(true);
        setSelectedCountry(country);
        setIdd(country.id)
    };
    // Close Add Job Modal
    // const closeEditCountriesModal = () => {
    //     setIsEditCountriesModalVisible(false);
    // };
    const handleModalClose = () => {
        setIsAddCountriesModalVisible(false);
        setIsEditCountriesModalVisible(false);
        setSelectedCountry(null);
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
    const handleDeleteCountry = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this country?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                return new Promise((resolve, reject) => {
                    dispatch(DeletePs(id))
                        .unwrap()
                        .then(() => {
                            // message.success('Country deleted successfully');
                            resolve();
                        })
                        .catch((error) => {
                            // message.error(error.message || 'Failed to delete country');
                            reject();
                        });
                });
            }
        });
    };

    const dropdownMenu = (elm) => (
        <Menu>
            {/* <Menu.Item>
                <Flex alignItems="center" onClick={() => openEditCountriesModal(elm)}>
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item> */}
            {/* <Menu.Item>
                <Flex alignItems="center" onClick={() => handleDeleteCountry(elm.id)}>
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item> */}
        </Menu>
    );
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
        },
        // {
        //     title: 'Action',
        //     dataIndex: 'actions',
        //     render: (_, elm) => (
        //         <div className="text-center">
        //             <EllipsisDropdown menu={dropdownMenu(elm)} />
        //         </div>
        //     )
        // }
    ];
    // const onSearch = e => {
    //     const value = e.currentTarget.value;
    //     const data = utils.wildCardSearch(countries, value);
    //     // setCountries(data);     
    //     setSelectedRowKeys([]);
    // }
    return (
        <div className="container">
            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input.Group compact>
                                <Input
                                    placeholder="Search by country name..."
                                    prefix={<SearchOutlined />}
                                    onChange={onSearch}
                                    value={searchText}
                                    allowClear
                                    className="search-input"
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
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={filteredData}
                        rowKey='id'
                        scroll={{ x: 1000 }}
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
                <EditCountries onClose={handleModalClose} idd={idd}/>
            </Modal>
            {/* <Modal
                    title="Subscribed Plans Details"
                    visible={isViewCountriesModalVisible}
                    onCancel={closeViewCountriesModal}
                    footer={null}
                    width={700}
                    className='mt-[-70px]'
                >
                    <ViewCountries onClose={closeViewCountriesModal} />
                </Modal> */}
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
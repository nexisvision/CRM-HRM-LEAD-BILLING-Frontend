import React, { Component } from 'react'
import { useState } from 'react'
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, message,Switch } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import utils from 'utils'
import userData from '../../../../assets/data/user-list.data.json';
import AddCountries from './AddCountries';
import EditCountries from './EditCountries';



const { Column } = Table;

const { Option } = Select


export const CountriesList = () => {
    const [users, setUsers] = useState(userData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isAddCountriesModalVisible, setIsAddCountriesModalVisible] = useState(false);
    const [isEditCountriesModalVisible, setIsEditCountriesModalVisible] = useState(false);

    const deleteUser = (userId) => {
        setUsers(users.filter((item) => item.id !== userId));
        message.success({ content: `Deleted user ${userId}`, duration: 2 });
      };

     // Open Add Job Modal
     const openAddCountriesModal = () => {
        setIsAddCountriesModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddCountriesModal = () => {
        setIsAddCountriesModalVisible(false);
    };

    // Open Add Job Modal
    const openEditCountriesModal = () => {
        setIsEditCountriesModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditCountriesModal = () => {
        setIsEditCountriesModalVisible(false);
    };

    const dropdownMenu = (elm) => (
        <Menu>

            <Menu.Item>
                <Flex alignItems="center" onClick={openEditCountriesModal}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center"  onClick={() => deleteUser(elm.id)}>
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'countriesname',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'countriesname')
        },
        {
            title: 'Short Code',
            dataIndex: 'shortcode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'shortcode')
        },
        {
            title: 'Phone Code',
            dataIndex: 'phonecode',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'phonecode')
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
                    <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddCountriesModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
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
            <Modal
					title="Add Countries"
					visible={isAddCountriesModalVisible}
					onCancel={closeAddCountriesModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
				<AddCountries onClose={closeAddCountriesModal} />
				</Modal>
                <Modal
					title="Edit Countries"
					visible={isEditCountriesModalVisible}
					onCancel={closeEditCountriesModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
				    <EditCountries onClose={closeEditCountriesModal} />
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


export default CountriesList;

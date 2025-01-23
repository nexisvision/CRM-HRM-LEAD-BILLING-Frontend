import React, { Component, useEffect } from 'react'
import { useState } from 'react'
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import {
    AnnualStatisticData,
} from '../../../dashboards/default/DefaultDashboardData';
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Tag, message } from 'antd';
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from 'react-number-format';
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
// import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import AddBilling from './AddBilling';
import EditBilling from './EditBilling';
import ViewBilling from './ViewBilling';
import { getInvoice } from '../invoice/InvoiceReducer/InvoiceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBilling, getAllBillings } from './billingReducers/billingSlice';
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';



const { Column } = Table;

const { Option } = Select

const getPaymentStatus = status => {
    if (status === 'Paid') {
        return 'success'
    }
    if (status === 'Pending') {
        return 'warning'
    }
    if (status === 'Expired') {
        return 'error'
    }
    return ''
}

const getShippingStatus = status => {
    if (status === 'Ready') {
        return 'blue'
    }
    if (status === 'Shipped') {
        return 'cyan'
    }
    return ''
}

const paymentStatusList = ['Paid', 'Pending', 'Expired']

export const BillingList = () => {

    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
const [isEditBillingModalVisible, setIsEditBillingModalVisible] =
    useState(false);
  const [isViewBillingModalVisible, setIsViewBillingModalVisible] =
    useState(false);
    const dispatch = useDispatch();





    const [selectedRowKeys, setSelectedRowKeys] = useState([])


          const AllLoggeddtaa = useSelector((state) => state.user);
          const lid = AllLoggeddtaa.loggedInUser.id;
      const [idd, setIdd] = useState("");
    
  const alldata = useSelector((state) => state.salesbilling);
  const fnddata = alldata.billings;


    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'paymentStatus'
            const data = utils.filterArray(OrderListData, key, value)
            setList(data)
        } else {
            setList(OrderListData)
        }
    }

    useEffect(() => {
        dispatch(getInvoice());
      }, []);


      useEffect(() => {
          dispatch(getAllBillings(lid));
        }, []);



  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

    // Open Add Job Modal
    const openAddBillingModal = () => {
        setIsAddBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddBillingModal = () => {
        setIsAddBillingModalVisible(false);
    };

    // Open Add Job Modal
    const openEditBillingModal = () => {
        setIsEditBillingModalVisible(true);
      };

    // Close Add Job Modal
    const closeEditBillingModal = () => {
        setIsEditBillingModalVisible(false);
    };


    // Open Add Job Modal
    const openViewBillingModal = () => {
        setIsViewBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewBillingModal = () => {
        setIsViewBillingModalVisible(false);
    };


 const delfun = (idd) => {
    dispatch(deleteBilling(idd)).then(() => {
        message.success("Billing delete  successfully!");
      dispatch(getAllBillings(lid));
      setList(list.filter((item) => item.id !== idd));
    });
  };

    const editfun = (idd) => {
        openEditBillingModal();
        setIdd(idd);
      };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewBillingModal}>
                    <EyeOutlined />
                    {/* <EyeOutlined /> */}
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    <PlusCircleOutlined />
                    <span className="ml-2">Add to remark</span>
                </Flex>
            </Menu.Item>

            <Menu.Item>
                <Flex alignItems="center" onClick={() => editfun(row.id)}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    <TiPinOutline />
                    <span className="ml-2">Pin</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center" onClick={() => delfun(row.id)}>
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const tableColumns = [
        {
            title: "vendor",
            dataIndex: "vendor",
            render: (_, record) => <span>{record.vendor}</span>,
            sorter: (a, b) => utils.antdTableSorter(a, b, "duedate"),
          },
        {
            title: 'Discription',
            dataIndex: 'discription',
            sorter: {
                compare: (a, b) => a.discription.length - b.discription.length,
            },
        },
        {
            title: "Bill  Date",
            dataIndex: "billDate",
            render: (_, record) => <span>{record.billDate}</span>,
            sorter: (a, b) => utils.antdTableSorter(a, b, "billDate"),
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
        const searchArray = e.currentTarget.value ? list : OrderListData
        const data = utils.wildCardSearch(searchArray, value)
        setList(data)
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
                        <div className="mb-3">
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All Billing </Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddBillingModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
                        <Button type="primary" icon={<FileExcelOutlined />} block>
                            Export All
                        </Button>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                    // rowSelection={{
                    // 	selectedRowKeys: selectedRowKeys,
                    // 	type: 'checkbox',
                    // 	preserveSelectedRowKeys: false,
                    // 	...rowSelection,
                    // }}
                    />
                </div>

                <Modal
					title="Create Billing"
					visible={isAddBillingModalVisible}
					onCancel={closeAddBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddBilling onClose={closeAddBillingModal} />
				</Modal>
                <Modal
					title="Edit Billing"
					visible={isEditBillingModalVisible}
					onCancel={closeEditBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<EditBilling onClose={closeEditBillingModal} idd={idd} />
				</Modal>
                <Modal
					title="Billing"
					visible={isViewBillingModalVisible}
					onCancel={closeViewBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<ViewBilling onClose={closeViewBillingModal} />
				</Modal>
            </Card>
        </div>
    );
}


export default BillingList

import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from "components/shared-components/StatisticWidget";

import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Modal,
  Switch,
  message,
} from "antd";
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from "react-number-format";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
// import NumberFormat from 'react-number-format';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';
import userData from "../../../assets/data/user-list.data.json";
import ViewSubscribedUserPlans from "./ViewSubscribedUserPlans";
import EditSubscribedUserPlans from "./EditSubscribedUserPlans";
import { getsubplandata } from "./subplanReducer/subplanSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetPlan } from "../plan/PlanReducers/PlanSlice";
import { ClientData } from "../company/CompanyReducers/CompanySlice";
import axios from 'axios';
import { env } from "configs/EnvironmentConfig";

// import userData from '../../../../../assets/data/user-list.data.json';

const { Column } = Table;

const { Option } = Select;

export const SubscribedUserPlansList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [
    isAddSubscribedUserPlansModalVisible,
    setIsAddSubscribedUserPlansModalVisible,
  ] = useState(false);
  const [
    isEditSubscribedUserPlansModalVisible,
    setIsEditSubscribedUserPlansModalVisible,
  ] = useState(false);
  const [
    isViewSubscribedUserPlansModalVisible,
    setIsViewSubscribedUserPlansModalVisible,
  ] = useState(false);

  useEffect(() => {
    dispatch(getsubplandata());
  }, []);


  useEffect(() => {
    dispatch(GetPlan());
    dispatch(ClientData());
  }, []);


  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = alldatas.subplan.data || [];

  const allclient = useSelector((state) => state.ClientData);
  const fndclient = allclient.ClientData.data || [];

  const allplan = useSelector((state) => state.Plan);
  const fndplan = allplan?.Plan || [];



  useEffect(() => {
    if (fnddtat) {
      setUsers(fnddtat);
    }
  }, [fnddtat]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "paymentStatus";
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  // Open Add Job Modal
  const openAddSubscribedUserPlansModal = () => {
    setIsAddSubscribedUserPlansModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddSubscribedUserPlansModal = () => {
    setIsAddSubscribedUserPlansModalVisible(false);
  };

  // Open Add Job Modal
  const openEditSubscribedUserPlansModal = () => {
    setIsEditSubscribedUserPlansModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditSubscribedUserPlansModal = () => {
    setIsEditSubscribedUserPlansModalVisible(false);
  };

  // Open Add Job Modal
  const openViewSubscribedUserPlansModal = () => {
    setIsViewSubscribedUserPlansModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewSubscribedUserPlansModal = () => {
    setIsViewSubscribedUserPlansModalVisible(false);
  };

 

  // Add this function to handle status changes
  const handleStatusChange = async (checked, id) => {
    try {
      if (!checked) {
        const token = localStorage.getItem('auth_token');
        const response = await axios.delete(`${env.API_ENDPOINT_URL}/subscriptions/remove/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          dispatch(getsubplandata());
        } else {
          return false;
        }
      }
      return false;
    } catch (error) {
      message.error('Error processing request');
      console.error('Error:', error);
      return false;
    }
  };


  const tableColumns = [
    // {
    //   title: "created_by",
    //   dataIndex: "created_by",
    // },
    {
      title: "Plan Name",
      dataIndex: "plan_id",
      render: (plan_id) => {
        const plan = fndplan.find((p) => p.id === plan_id);
        return plan ? plan.name : "Unknown Plan"; // Display the plan name or a fallback
      },
    },



    {
      title: "Client Name",
      dataIndex: "client_id",
      render: (client_id) => {
        const client = fndclient.find((c) => c.id === client_id);
        return client ? client.username : "Unknown Client"; // Display the client name or a fallback
      },
    },


    {
      title: "Total Client Count",
      dataIndex: "current_clients_count",
    },


    {
      title: "Total Storage Used",
      dataIndex: "current_storage_used",
    },

    {
      title: "Total Users Count",
      dataIndex: "current_users_count",
    },


    {
      title: "Payment Status",
      dataIndex: "payment_status",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => {
        const isActive = record.status !== 'cancelled'; // Check if status is not cancelled
        return (
          <Switch
            defaultChecked={isActive}
            onChange={(checked) => handleStatusChange(checked, record.id)}
            size="small"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            disabled={!isActive} // Disable switch if status is cancelled
          />
        );
      },
    },


    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (_, record) => (
        <span>{dayjs(record.start_date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "start_date"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (_, record) => (
        <span>{dayjs(record.end_date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "end_date"),

    },
   
  ];

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? users : [];
    const data = utils.wildCardSearch(searchArray, value);
    setUsers(data);
    setSelectedRowKeys([]);
  };

  // total() {
  // 	let total = 0;
  // 	invoiceData.forEach((elm) => {
  // 		total += elm.price;
  // 	})
  // 	return total
  // }

  // render() {

  return (
    <div className="container">
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e)}
              />
            </div>
          </Flex>
          {/* <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddSubscribedUserPlansModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
                    </Flex> */}
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          // rowSelection={{
          // 	selectedRowKeys: selectedRowKeys,
          // 	type: 'checkbox',
          // 	preserveSelectedRowKeys: false,
          // 	...rowSelection,
          // }}
          />
        </div>

        {/* <Modal
					title="SubscribedUserPlans Create"
					visible={isAddSubscribedUserPlansModalVisible}
					onCancel={closeAddSubscribedUserPlansModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddInvoice onClose={closeAddSubscribedUserPlansModal} />
				</Modal> */}
        <Modal
          title="Edit Subscribed Plans"
          visible={isEditSubscribedUserPlansModalVisible}
          onCancel={closeEditSubscribedUserPlansModal}
          footer={null}
          width={700}
          className="mt-[-70px]"
        >
          <EditSubscribedUserPlans
            onClose={closeEditSubscribedUserPlansModal}
          />
        </Modal>
        <Modal
          title="Subscribed Plans Details"
          visible={isViewSubscribedUserPlansModalVisible}
          onCancel={closeViewSubscribedUserPlansModal}
          footer={null}
          width={700}
          className="mt-[-70px]"
        >
          <ViewSubscribedUserPlans
            onClose={closeViewSubscribedUserPlansModal}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default SubscribedUserPlansList;

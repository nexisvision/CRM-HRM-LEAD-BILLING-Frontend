import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Modal,
  Switch,
  message,
  Select,
} from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import ViewSubscribedUserPlans from "./ViewSubscribedUserPlans";
import EditSubscribedUserPlans from "./EditSubscribedUserPlans";
import { getsubplandata } from "./subplanReducer/subplanSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetPlan } from "../plan/PlanReducers/PlanSlice";
import { ClientData } from "../company/CompanyReducers/CompanySlice";
import axios from 'axios';
import { env } from "configs/EnvironmentConfig";

const { Option } = Select;

export const SubscribedUserPlansList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const dispatch = useDispatch();

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
    dispatch(GetPlan());
    dispatch(ClientData());
  }, [dispatch]);

  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = React.useMemo(() => alldatas.subplan.data || [], [alldatas.subplan.data]);

  const allclient = useSelector((state) => state.ClientData);
  const fndclient = allclient.ClientData.data || [];

  const allplan = useSelector((state) => state.Plan);
  const fndplan = allplan?.Plan || [];

  // Update users when data changes
  useEffect(() => {
    if (fnddtat) {
      setUsers(fnddtat);
      filterUsers(fnddtat, searchText, paymentStatusFilter, planFilter);
    }
  }, [fnddtat]);

  // Enhanced filter function
  const filterUsers = (data, search, paymentStatus, planId) => {
    let filtered = [...data];

    // Apply payment status filter
    if (paymentStatus !== "all") {
      filtered = filtered.filter(user => 
        user.payment_status?.toLowerCase() === paymentStatus.toLowerCase()
      );
    }

    // Apply plan filter
    if (planId !== "all") {
      filtered = filtered.filter(user => user.plan_id === planId);
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(user => {
        const plan = fndplan.find(p => p.id === user.plan_id);
        const client = fndclient.find(c => c.id === user.client_id);
        const searchLower = search.toLowerCase();

        return (
          (plan?.name?.toLowerCase().includes(searchLower)) ||
          (client?.username?.toLowerCase().includes(searchLower)) ||
          (user.payment_status?.toLowerCase().includes(searchLower))
        );
      });
    }

    setFilteredUsers(filtered);
  };

  // Handle search input change
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchText(value);
    filterUsers(users, value, paymentStatusFilter, planFilter);
  };

  // Handle payment status filter change
  const handlePaymentStatusChange = (value) => {
    setPaymentStatusFilter(value);
    filterUsers(users, searchText, value, planFilter);
  };

  // Handle plan filter change
  const handlePlanChange = (value) => {
    setPlanFilter(value);
    filterUsers(users, searchText, paymentStatusFilter, value);
  };

  // Close modals
  const closeEditSubscribedUserPlansModal = () => {
    setIsEditSubscribedUserPlansModalVisible(false);
  };

  const closeViewSubscribedUserPlansModal = () => {
    setIsViewSubscribedUserPlansModalVisible(false);
  };

  // Handle status change
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
          return true;
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
    {
      title: "Plan Name",
      dataIndex: "plan_id",
      render: (plan_id) => {
        const plan = fndplan.find((p) => p.id === plan_id);
        return plan ? plan.name : "Unknown Plan";
      },
    },
    {
      title: "Client Name",
      dataIndex: "client_id",
      render: (client_id) => {
        const client = fndclient.find((c) => c.id === client_id);
        return client ? client.username : "Unknown Client";
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
        const isActive = record.status !== 'cancelled';
        return (
          <Switch
            defaultChecked={isActive}
            onChange={(checked) => handleStatusChange(checked, record.id)}
            size="small"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            disabled={!isActive}
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

  return (
    <div className="w-full">
      <Card className="w-full">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="w-full mb-4"
        >
          <Flex
            className="w-full md:w-auto"
            mobileFlex={false}
          >
            <div className="w-full md:w-48 mr-4">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48 mr-4">
              <Select
                placeholder="Payment Status"
                onChange={handlePaymentStatusChange}
                value={paymentStatusFilter}
                className="w-full"
              >
                <Option value="all">All Status</Option>
                <Option value="paid">Paid</Option>
                <Option value="pending">Pending</Option>
                <Option value="failed">Failed</Option>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select
                placeholder="Select Plan"
                onChange={handlePlanChange}
                value={planFilter}
                className="w-full"
              >
                <Option value="all">All Plans</Option>
                {fndplan.map(plan => (
                  <Option key={plan.id} value={plan.id}>
                    {plan.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
        </Flex>
        <div className="w-full overflow-x-auto">
          <Table
            columns={tableColumns}
            dataSource={filteredUsers}
            rowKey="id"
            scroll={{ x: true }}
            className="w-full"
          />
        </div>
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

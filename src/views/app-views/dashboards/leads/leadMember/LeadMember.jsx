import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Card, Table, Button, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddLeadMember from "./AddLeadMember";

import Flex from "components/shared-components/Flex";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GetLeads } from "../LeadReducers/LeadSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { env } from "configs/EnvironmentConfig";

const LeadMember = () => {
  const dispatch = useDispatch();
  const [isAddLeadMemberModalVisible, setIsAddLeadMemberModalVisible] =
    useState(false);
  
  const AllLead = useSelector((state) => state.Lead);
  const AllEmployee = useSelector((state) => state.employee);

  const leadData = AllLead?.Lead?.data || [];
  const employeeData = AllEmployee?.employee?.data || [];

  const { id } = useParams();

  // Add useEffect to fetch data on component mount
  useEffect(() => {
    dispatch(GetLeads());
    dispatch(empdata());
  }, [dispatch]);

  const allproject = useSelector((state) => state.Leads);
  const fndrewduxxdaa = allproject.Leads.data;
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

  

  
  const DeletePro2 = async (payload) => {
    const token = localStorage.getItem("auth_token");

    const payload2 = {
      lead_members: [payload],
    };

    try {
      const res = await axios.post(
        `${env.API_ENDPOINT_URL}/leads/membersdel/${id}`,
        { lead_members: payload2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(GetLeads());
      dispatch(empdata());
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const project = leadData[0]; // Accessing the first project as an example
  const leadMembers = fnddata?.lead_members || [];
  let memberArray = [];
  
  try {
    memberArray = typeof leadMembers === 'string' 
      ? JSON.parse(leadMembers).lead_members 
      : leadMembers;
  } catch (error) {
    console.error("Error parsing lead members:", error);
  }

  const userEmployeeData = useMemo(() => {
    return memberArray
      ?.map((memberId) => {
        const employee = employeeData?.find((emp) => emp?.id === memberId);
        if (!employee) {
          console.warn(`No employee found for memberId: ${memberId}`);
        }
        return employee || null;
      })
      .filter((employee) => employee !== null);
  }, [memberArray, employeeData]);


  const tableColumns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      render: (text, record) => <span>{record?.username || "N/A"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => <span>{record?.email || "N/A"}</span>,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const openAddLeadMemberModal = () => {
    setIsAddLeadMemberModalVisible(true);
  };

  const closeAddLeadMemberModal = () => {
    setIsAddLeadMemberModalVisible(false);
  };

  const handleDelete = async (userId) => {
    try {

      await DeletePro2(userId);

      await dispatch(GetLeads  ()).unwrap();

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

 
  useEffect(()=>{
    dispatch(GetLeads())
  },[dispatch])

  return (
    <div className="container">
      <Flex gap="7px" className="flex">
        <Button
          type="primary"
          className="flex items-center bg-blue-500 text-white rounded-md p-2 mb-3"
          onClick={openAddLeadMemberModal}
        >
          <PlusOutlined />
          <span className="ml-2">Add Lead Member</span>
        </Button>
      </Flex>
      <Card>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={userEmployeeData}
            rowKey="id"
          />
        </div>
        <Modal
          title="Add Lead Member"
          visible={isAddLeadMemberModalVisible}
          onCancel={closeAddLeadMemberModal}
          footer={null}
          width={1000}
        >
          <AddLeadMember onClose={closeAddLeadMemberModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default LeadMember;

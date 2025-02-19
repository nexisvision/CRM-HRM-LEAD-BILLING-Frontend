import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Card, Table, Button, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddLeadMember from "./AddLeadMember";
import { GetProject } from "../../project/project-list/projectReducer/ProjectSlice";

import Flex from "components/shared-components/Flex";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GetLeads } from "../LeadReducers/LeadSlice";

const LeadMember = () => {
  const dispatch = useDispatch();
  const [isAddLeadMemberModalVisible, setIsAddLeadMemberModalVisible] =
    useState(false);

  const AllLead = useSelector((state) => state.Lead);
  const AllEmployee = useSelector((state) => state.employee);

  const leadData = AllLead?.Lead?.data || [];
  const employeeData = AllEmployee?.employee?.data || [];

  const { id } = useParams();


  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
  


  const DeletePro2 = async (payload) => {
    const token = localStorage.getItem("auth_token");

    const payload2 = {
      project_members: [payload],
    };

    try {
      const res = await axios.post(
        `http://localhost:5353/api/v1/projects/membersdelete/${id}`,
        { project_members: payload2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // dispatch(empdata());
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  console.log("tt", leadData);

  const project = leadData[0]; // Accessing the first project as an example

console.log("sdfsdfsdf",project);

  const userField = fnddata?.project_members; // The 'user' field in the project
  let userArray = [];
  console.log("popopop", userField);

  try {
    const parsedUserField = JSON.parse(userField); // Parse the JSON string
    userArray = parsedUserField?.project_members; // Extract the array of user IDs
  } catch (error) {
    console.error("Error parsing user field:", error);
  }

  const userEmployeeData = userArray
    ?.map((userId) => {
      const employee = employeeData?.find((emp) => emp?.id === userId);
      if (!employee) {
        console.warn(`No employee found for userId: ${userId}`);
      }
      return employee || null; // Return the employee if found, otherwise null
    })
    .filter((employee) => employee !== null); // Remove null values

  console.log("Filtered Employee Data:", userEmployeeData);

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
      // await dispatch(DeletePro2(userId)).unwrap();
      // const updatedData = await dispatch(GetProject());

      await DeletePro2(userId);

      await dispatch(GetLeads  ()).unwrap();

      // setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);

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

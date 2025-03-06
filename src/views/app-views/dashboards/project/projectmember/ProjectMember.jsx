import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Card, Table, Button, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddProjectMember from "./AddProjectMember";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import Flex from "components/shared-components/Flex";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import { env } from "configs/EnvironmentConfig";

const ProjectMember = () => {
  const dispatch = useDispatch();
  const [isAddProjectMemberModalVisible, setIsAddProjectMemberModalVisible] =
    useState(false);

  const AllProject = useSelector((state) => state.Project);
  const AllEmployee = useSelector((state) => state.Users);

  const projectData = AllProject?.Project?.data || [];
  const employeeData = AllEmployee?.Users?.data || [];

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
        `${env.API_ENDPOINT_URL}/projects/membersdelete/${id}`,
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

  // console.log("tt", projectData);

  const project = projectData[0]; // Accessing the first project as an example

// console.log("sdfsdfsdf",project);

  const userField = fnddata?.project_members; // The 'user' field in the project
  let userArray = [];
  // console.log("popopop", userField);

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

  // console.log("Filtered Employee Data:", userEmployeeData);

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

  const openAddProjectMemberModal = () => {
    setIsAddProjectMemberModalVisible(true);
  };

  const closeAddProjectMemberModal = () => {
    setIsAddProjectMemberModalVisible(false);
  };

  const handleDelete = async (userId) => {
    try {
      // await dispatch(DeletePro2(userId)).unwrap();
      // const updatedData = await dispatch(GetProject());

      await DeletePro2(userId);

      await dispatch(GetProject()).unwrap();

      // setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    dispatch(GetUsers());

    dispatch(GetProject());
  }, [dispatch]);

  return (
    <div className="container">
      <Flex gap="7px" className="flex">
        <Button
          type="primary"
          className="flex items-center bg-blue-500 text-white rounded-md p-2 mb-3"
          onClick={openAddProjectMemberModal}
        >
          <PlusOutlined />
          <span className="ml-2">Add Project Member</span>
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
          title="Add Project Member"
          visible={isAddProjectMemberModalVisible}
          onCancel={closeAddProjectMemberModal}
          footer={null}
          width={1000}
        >
          <AddProjectMember onClose={closeAddProjectMemberModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default ProjectMember;

import React, { useEffect, useState } from "react";
import { Card, Table, message, Button, Modal, Dropdown } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import AddDocument from "./AddDocument";
import EditDocument from "./EditDocument";
import { utils, writeFile } from "xlsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteDocu, getDocu } from "./DocumentReducers/documentSlice";

const DocumentList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [isAddTrainingSetupModalVisible, setIsAddTrainingSetupModalVisible] =
    useState(false);
  const [isEditTrainingSetupModalVisible, setIsEditTrainingSetupModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getDocu());
  }, [dispatch]);

  const alladatas = useSelector((state) => state.Documents);
  const fnddtaas = alladatas.Documents.data;

  useEffect(() => {
    if (fnddtaas) {
      setUsers(fnddtaas);
    }
  }, [fnddtaas]);

  const allempdata = useSelector((state) => state.Training);
  const fnddata = allempdata.Training.data;

  const openAddTrainingSetupModal = () => {
    setIsAddTrainingSetupModalVisible(true);
  };

  const closeTrainingSetupModal = () => {
    setIsAddTrainingSetupModalVisible(false);
  };

  const openEditTrainingSetupModal = () => {
    setIsEditTrainingSetupModalVisible(true);
  };

  const closeEditTrainingSetupModal = () => {
    setIsEditTrainingSetupModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Document");

      writeFile(wb, "DocumentData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const deleteUser = (userId) => {
    dispatch(deleteDocu(userId)).then(() => {
      dispatch(getDocu());
      setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (
    parsedPermissions["extra-hrm-document"] &&
    parsedPermissions["extra-hrm-document"][0]?.permissions
  ) {
    allpermisson = parsedPermissions["extra-hrm-document"][0].permissions;
  } else {
    allpermisson = [];
  }

  const canCreateDocument = allpermisson?.includes("create");
  const canUpdateDocument = allpermisson?.includes("update");
  const canDeleteDocument = allpermisson?.includes("delete");
  const canViewDocument = allpermisson?.includes("view");

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
    }
  }, [fnddata]);

  const editfun = (idd) => {
    openEditTrainingSetupModal();
    setIdd(idd);
  };

  const getDropdownItems = (row) => {
    const items = [];

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canUpdateDocument && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(row.id),
      });
    }

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canDeleteDocument && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(row.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Role", // New column for role
      dataIndex: "role",
      render: (role) => (
        <span style={{ textTransform: "capitalize" }}>{role || "N/A"}</span>
      ),
      sorter: (a, b) => (a.role || "").localeCompare(b.role || ""),
    },
    {
      title: "description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(elm) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: "10px",
                padding: 0,
              }}
            >
              <MoreOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <style>
        {`
          .ant-dropdown-menu {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 4px;
          }

          .ant-dropdown-menu-item {
            padding: 8px 16px;
            border-radius: 4px;
            margin: 2px 0;
            transition: all 0.3s;
          }

          .ant-dropdown-menu-item:hover {
            background-color: #f5f5f5;
          }

          .ant-dropdown-menu-item-danger:hover {
            background-color: #fff1f0;
          }

          .ant-dropdown-menu-item .anticon {
            font-size: 16px;
            margin-right: 8px;
          }

          .table-responsive {
            overflow-x: auto;
          }
        `}
      </style>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}></Flex>
        <Flex gap="7px">
          {whorole === "super-admin" ||
            whorole === "client" ||
            (canCreateDocument &&
              whorole !== "super-admin" &&
              whorole !== "client") ? (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddTrainingSetupModal}
            >
              <PlusOutlined />
              <span>New</span>
            </Button>
          ) : null}

          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
            block
          >
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-4">
        {whorole === "super-admin" ||
          whorole === "client" ||
          (canViewDocument &&
            whorole !== "super-admin" &&
            whorole !== "client") ? (
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        ) : null}
      </div>

      <Modal
        title="Add Document"
        visible={isAddTrainingSetupModalVisible}
        onCancel={closeTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddDocument onClose={closeTrainingSetupModal} />
      </Modal>

      <Modal
        title="Edit Document"
        visible={isEditTrainingSetupModalVisible}
        onCancel={closeEditTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditDocument onClose={closeEditTrainingSetupModal} idd={idd} />
      </Modal>
    </Card>
  );
};

export default DocumentList;

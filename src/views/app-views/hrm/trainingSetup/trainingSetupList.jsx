import React, { useEffect, useState } from "react";
import { Card, Table, message, Button, Modal, Dropdown } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import AddTrainingSetup from "./AddTrainingSetup";
import EditTrainingSetup from "./EditTrainingSetup";
import { utils, writeFile } from "xlsx";
import { Deletetrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ViewTrainingSetup from "./ViewTrainingSetup";

const TrainingSetupList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [isAddTrainingSetupModalVisible, setIsAddTrainingSetupModalVisible] =
    useState(false);
  const [isEditTrainingSetupModalVisible, setIsEditTrainingSetupModalVisible] =
    useState(false);
  const [isViewTrainingSetupModalVisible, setIsViewTrainingSetupModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

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

  const openviewTrainingSetupModal = () => {
    setIsViewTrainingSetupModalVisible(true);
  };

  const closeViewTrainingSetupModal = () => {
    setIsViewTrainingSetupModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "TrainingSetup");
      writeFile(wb, "TrainingSetupData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const deleteUser = (userId) => {
    dispatch(Deletetrainng(userId));
    dispatch(GetallTrainng());
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  useEffect(() => {
    dispatch(GetallTrainng());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
    }
  }, [fnddata]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  let allpermisson;

  if (
    parsedPermissions["extra-hrm-trainingSetup"] &&
    parsedPermissions["extra-hrm-trainingSetup"][0]?.permissions
  ) {
    allpermisson = parsedPermissions["extra-hrm-trainingSetup"][0].permissions;
  }

  const canCreateClient = allpermisson?.includes("create");
  const canUpdateClient = allpermisson?.includes("update");
  const canDeleteClient = allpermisson?.includes("delete");
  const canViewClient = allpermisson?.includes("view");

  const editfun = (idd) => {
    openEditTrainingSetupModal();
    setIdd(idd);
  };

  const viewfun = (idd) => {
    openviewTrainingSetupModal();
    setIdd(idd);
  };

  const getDropdownItems = (record) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || canViewClient) {
      items.push({
        key: "view",
        icon: <EyeOutlined />,
        label: "View Details",
        onClick: () => viewfun(record.id),
      });
    }

    if (whorole === "super-admin" || whorole === "client" || canUpdateClient) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(record.id),
      });
    }

    if (whorole === "super-admin" || whorole === "client" || canDeleteClient) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(record.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "category",
      dataIndex: "category",
      sorter: (a, b) => a.category?.length - b.category?.length,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
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
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}></Flex>
        <Flex gap="7px">
          {(whorole === "super-admin" ||
            whorole === "client" ||
            canCreateClient) && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddTrainingSetupModal}
            >
              <PlusOutlined />
              <span>New</span>
            </Button>
          )}
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
      <div className="table-responsive mt-2">
        {(whorole === "super-admin" ||
          whorole === "client" ||
          canViewClient) && (
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        )}
      </div>

      <Modal
        title="Add Training Setup"
        visible={isAddTrainingSetupModalVisible}
        onCancel={closeTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddTrainingSetup onClose={closeTrainingSetupModal} />
      </Modal>

      <Modal
        title="Edit Training Setup"
        visible={isEditTrainingSetupModalVisible}
        onCancel={closeEditTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditTrainingSetup onClose={closeEditTrainingSetupModal} idd={idd} />
      </Modal>

      <Modal
        title=""
        visible={isViewTrainingSetupModalVisible}
        onCancel={closeViewTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewTrainingSetup onClose={closeViewTrainingSetupModal} idd={idd} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

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

  .ant-btn-text:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-btn-text:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const TrainingSetupListWithStyles = () => (
  <>
    <style>{styles}</style>
    <TrainingSetupList />
  </>
);

export default TrainingSetupListWithStyles;

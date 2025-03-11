import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import utils from "utils";
import AddPipeLine from "./AddPipeLine";
import EditPipeLine from "./EditPipeLine";
import { useDispatch, useSelector } from "react-redux";
import { Deletepip, GetPip } from "./PiplineReducer/piplineSlice";

const PipelineList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] =
    useState(false);
  const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] =
    useState(false);
  const [idd, setIdd] = useState("");
  const Allpipline = useSelector((state) => state.Piplines);
  const fnddatas = React.useMemo(() => Allpipline?.Piplines?.data || [], [Allpipline?.Piplines?.data]);
  const dispatch = useDispatch();

  const openAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(true);
  };

  const closeAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(false);
  };

  const openEditPipeLineModal = () => {
    setIsEditPipeLineModalVisible(true);
  };

  const closeEditPipeLineModal = () => {
    setIsEditPipeLineModalVisible(false);
  };

  const editfun = (idd) => {
    openEditPipeLineModal();
    setIdd(idd);
  };

  const deletfun = (userId) => {
    dispatch(Deletepip(userId)).then(() => {
      dispatch(GetPip());
      message.success("Delete pipline successfully");
    });
  };

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);


  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-trainingSetup"] && parsedPermissions["extra-hrm-trainingSetup"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-trainingSetup"][0].permissions;
    console.log('Parsed Permissions:', allpermisson);

  } else {
    console.log('extra-hrm-trainingSetup is not available');
  }


  const tableColumns = [
    {
      title: "Pipeline",
      dataIndex: "pipeline_name",
      sorter: (a, b) => utils.antdTableSorter(a, b, "pipeline_name"),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200"
            onClick={() => editfun(elm.id)}
          >
            <EditOutlined className=" text-xl" />
          </button>
          <button
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200"
            onClick={() => deletfun(elm.id)}
          >
            <DeleteOutlined className="text-xl" />
          </button>
        </div>
      ),
    },
  ];


  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(fnddatas);
  }, [fnddatas]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">Manage Pipeline</h1>
        </div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap mt-2 gap-4"
        >
          <div className="flex justify-end">
            <Button type="primary" onClick={openAddPipeLineModal}>
              <PlusOutlined />
            </Button>

          </div>
        </Flex>
      </div>
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap mt-2 gap-4"
        >

        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={filteredData}
            rowKey="id"
          />
        </div>
      </Card>

      <Modal
        title="Add Pipeline"
        visible={isAddPipeLineModalVisible}
        onCancel={closeAddPipeLineModal}
        footer={null}
        width={700}
      >
        <AddPipeLine onClose={closeAddPipeLineModal} />
      </Modal>

      <Modal
        title="Edit Pipeline"
        visible={isEditPipeLineModalVisible}
        onCancel={closeEditPipeLineModal}
        footer={null}
        width={700}
      >
        <EditPipeLine onClose={closeEditPipeLineModal} idd={idd} />
      </Modal>
    </>
  );
};

export default PipelineList;

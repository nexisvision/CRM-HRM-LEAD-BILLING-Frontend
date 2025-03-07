import React, { useState, useEffect } from "react";
import { Card, Table, Input, Button, Modal, message } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from "components/shared-components/Flex";
import utils from "utils";
// import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AddPipeLine from "./AddPipeLine";
import EditPipeLine from "./EditPipeLine";
import { useDispatch, useSelector } from "react-redux";
import { Deletepip, GetPip } from "./PiplineReducer/piplineSlice";

// const { Option } = Select;

const PipelineList = () => {
  //   const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] =
    useState(false);
  const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const Allpipline = useSelector((state) => state.Piplines);
  const fnddatas = Allpipline?.Piplines?.data || [];

  const logged = useSelector((state)=>state.user.loggedInUser.username)

  // const fnddatas = Filterpipline.filter((item)=>item.created_by === logged)

  const dispatch = useDispatch();

  // Open Add Pipeline Modal
  const openAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(true);
  };

  // Close Add Pipeline Modal
  const closeAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(false);
  };

  // Open Edit Pipeline Modal
  const openEditPipeLineModal = () => {
    setIsEditPipeLineModalVisible(true);
  };

  // Close Edit Pipeline Modal
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

   //// permission
                                              
   const roleId = useSelector((state) => state.user.loggedInUser.role_id);
   const roles = useSelector((state) => state.role?.role?.data);
   const roleData = roles?.find(role => role.id === roleId);

   const whorole = roleData.role_name;

   const parsedPermissions = Array.isArray(roleData?.permissions)
   ? roleData.permissions
   : typeof roleData?.permissions === 'string'
   ? JSON.parse(roleData.permissions)
   : [];
 
   let allpermisson;  

   if (parsedPermissions["extra-hrm-trainingSetup"] && parsedPermissions["extra-hrm-trainingSetup"][0]?.permissions) {
     allpermisson = parsedPermissions["extra-hrm-trainingSetup"][0].permissions;
   
   } else {
   }
   
   const canCreateClient = allpermisson?.includes('create');
   const canEditClient = allpermisson?.includes('edit');
   const canDeleteClient = allpermisson?.includes('delete');
   const canViewClient = allpermisson?.includes('view');

   ///endpermission

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

  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    
    if (!value) {
      setFilteredData(fnddatas); // Reset to original data when search is empty
      return;
    }

    const filtered = fnddatas.filter((item) => 
      item.pipeline_name?.toString().toLowerCase().includes(value)
    );
    
    setFilteredData(filtered);
    setSelectedRowKeys([]);
  };

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

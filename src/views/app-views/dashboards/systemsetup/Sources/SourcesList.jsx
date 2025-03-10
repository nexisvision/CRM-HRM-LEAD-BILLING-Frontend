/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Button,
  Menu,
  Modal,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import utils from "utils";
import { PaymentStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import AddSources from "./AddSources";
import EditSources from "./EditSources";
import {
  Deletemins,
  GetLable,
} from "../../project/milestone/LableReducer/LableSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const { Option } = Select;

const SourcesList = () => {
  const [list, setList] = useState();
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddSourcesModalVisible, setIsAddSourcesModalVisible] =
    useState(false);
  const [isEditSourcesModalVisible, setIsEditSourcesModalVisible] =
    useState(false);
  const [isViewSourcesModalVisible, setIsViewSourcesModalVisible] =
    useState(false);
  const [paymentStatisticData] = useState(PaymentStatisticData);

  const [idd, setIdd] = useState("");

  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;

  const lid = userdata.id;

  const user = userdata.username;



  const alltagdata = useSelector((state) => state.Lable);

  const alltaggdata = alltagdata.Lable.data || [];


  const fndddata = alltaggdata.filter(item => item.created_by === user);

  const datas = alltaggdata?.filter(item => item.lableType === "source");



  // Open Add Job Modal
  const openAddSourcesModal = () => {
    setIsAddSourcesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddSourcesModal = () => {
    setIsAddSourcesModalVisible(false);
  };

  // Open Add Job Modal
  const openEditSourcesModal = () => {
    setIsEditSourcesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditSourcesModal = () => {
    setIsEditSourcesModalVisible(false);
  };

  // Open Add Job Modal
  const openViewSourcesModal = () => {
    setIsViewSourcesModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewSourcesModal = () => {
    setIsViewSourcesModalVisible(false);
  };

  useEffect(() => {
    dispatch(GetLable(lid));
  }, [dispatch, lid]);

  useEffect(() => {
    if (datas && datas.length > 0) {
      setList(datas);
    }
  }, [datas]);

  const deletefun = async (userId) => {
    try {
      await dispatch(Deletemins(userId));
      await dispatch(GetLable(lid));
      message.success("Source deleted successfully!");
    } catch (error) {
      message.error("Failed to delete the source. Please try again.");
    }
  };

  const editfuc = (idd) => {
    openEditSourcesModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={openEditSourcesModal}>
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Source",
      dataIndex: "name",
      sorter: (a, b) => utils.antdTableSorter(a, b, "source"),
    },

    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200"
            onClick={() => editfuc(elm.id)}
          >
            <EditOutlined className=" text-xl" />
          </button>
          <button
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200"
            onClick={() => deletefun(elm.id)}
          >
            <DeleteOutlined className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">Manage Sources</h1>
        </div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap mt-2 gap-4"
        >
          <div className="flex justify-end">
            <Button type="primary" onClick={openAddSourcesModal}>
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
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >

          </Flex>
         
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
      
          />
        </div>
      </Card>

      <Modal
        title="Add Sources"
        visible={isAddSourcesModalVisible}
        onCancel={closeAddSourcesModal}
        footer={null}
        width={700}
      // className='mt-[-70px]'
      >
        <AddSources onClose={closeAddSourcesModal} />
      </Modal>
      <Modal
        title="Edit Sources"
        visible={isEditSourcesModalVisible}
        onCancel={closeEditSourcesModal}
        footer={null}
        width={700}
      // className='mt-[-70px]'
      >
        <EditSources onClose={closeEditSourcesModal} idd={idd} />
      </Modal>
    </>
  );
};

export default SourcesList;

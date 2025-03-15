/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import OrderListData from "../../../../../assets/data/order-list.data.json";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import utils from "utils";
import {
  Deletemins,
  GetLable,
} from "../../project/milestone/LableReducer/LableSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EditContractType from "./EditContractType";
import AddContractType from "./AddContractType";

const ContractTypeList = () => {
  const [list, setList] = useState(OrderListData);
  const dispatch = useDispatch();
  const [isAddSourcesModalVisible, setIsAddSourcesModalVisible] =
    useState(false);
  const [isEditSourcesModalVisible, setIsEditSourcesModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;
  const lid = userdata.id;
  const alltagdata = useSelector((state) => state.Lable);
  const fndddata = alltagdata.Lable.data || [];
  const datas = fndddata?.filter((item) => item.lableType === "contract");

  const openAddSourcesModal = () => {
    setIsAddSourcesModalVisible(true);
  };

  const closeAddSourcesModal = () => {
    setIsAddSourcesModalVisible(false);
  };

  const openEditSourcesModal = () => {
    setIsEditSourcesModalVisible(true);
  };

  const closeEditSourcesModal = () => {
    setIsEditSourcesModalVisible(false);
  };

  useEffect(() => {
    dispatch(GetLable(lid));
  }, [dispatch, lid]);

  useEffect(() => {
    if (datas) {
      setList(datas);
    }
  }, [datas]);

  const deletefun = async (userId) => {
    try {
      await dispatch(Deletemins(userId));
      await dispatch(GetLable(lid));
    } catch (error) {
      message.error("Failed to delete the source. Please try again.");
    }
  };

  const editfuc = (idd) => {
    openEditSourcesModal();
    setIdd(idd);
  };

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
          ></Flex>
        </Flex>
        <div className="table-responsive">
          <Table columns={tableColumns} dataSource={list} rowKey="id" />
        </div>
      </Card>

      <Modal
        title="Add Contract Type"
        visible={isAddSourcesModalVisible}
        onCancel={closeAddSourcesModal}
        footer={null}
        width={700}
      >
        <AddContractType onClose={closeAddSourcesModal} />
      </Modal>
      <Modal
        title="Edit Contract Type"
        visible={isEditSourcesModalVisible}
        onCancel={closeEditSourcesModal}
        footer={null}
        width={700}
      >
        <EditContractType onClose={closeEditSourcesModal} idd={idd} />
      </Modal>
    </>
  );
};

export default ContractTypeList;

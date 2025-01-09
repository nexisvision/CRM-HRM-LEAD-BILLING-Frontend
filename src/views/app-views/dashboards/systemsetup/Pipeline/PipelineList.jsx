import React, { useEffect, useState } from "react";
import { Card, Table, Input, Button, Modal } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Deletepip, GetPip } from "./PiplineReducer/piplineSlice";
import AddPipeLine from "./AddPipeLine";
import EditPipeLine from "./EditPipeLine";
import utils from "utils";

const PipelineList = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] =
    useState(false);
  const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] =
    useState(false);

  const [idd, setIdd] = useState(null);

  const alldata = useSelector((state) => state.Piplines);
  const fnddata = alldata?.Piplines?.data || [];

  // Open and Close Modals
  const openAddPipeLineModal = () => setIsAddPipeLineModalVisible(true);
  const closeAddPipeLineModal = () => setIsAddPipeLineModalVisible(false);
  const openEditPipeLineModal = () => setIsEditPipeLineModalVisible(true);
  const closeEditPipeLineModal = () => setIsEditPipeLineModalVisible(false);

  const deltfun = (userId) => {
    dispatch(Deletepip(userId));
    setList(list.filter((item) => item.id !== userId));
    dispatch(GetPip());
    dispatch(GetPip());
  };

  const editfub = (idd) => {
    openEditPipeLineModal();
    setIdd(idd);
  };

  const tableColumns = [
    {
      title: "Pipeline",
      dataIndex: "pipeline_name",
      sorter: (a, b) => utils.antdTableSorter(a, b, "pipeline_name"),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200"
            onClick={() => editfub(record.id)}
          >
            <EditOutlined className="text-xl" />
          </button>
          <button
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200"
            onClick={() => deltfun(record.id)}
          >
            <DeleteOutlined className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : fnddata;
    const filteredData = utils.wildCardSearch(searchArray, value);
    setList(filteredData);
  };

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(fnddata)) {
      setList(fnddata);
    } else {
      console.warn("fnddata is not an array:", fnddata);
      setList([]);
    }
  }, [fnddata]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Manage Pipeline</h1>
        <Button type="primary" onClick={openAddPipeLineModal}>
          <PlusOutlined /> Add Pipeline
        </Button>
      </div>
      <Card>
        <div className="mb-3">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={onSearch}
          />
        </div>
        <Table
          columns={tableColumns}
          dataSource={Array.isArray(list) ? list : []}
          rowKey="id"
        />
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

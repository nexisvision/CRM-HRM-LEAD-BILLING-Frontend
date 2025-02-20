import React, { useEffect, useState } from "react";
import { TiArrowMove } from "react-icons/ti";

import Flex from "components/shared-components/Flex";
import { Button, message, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletestages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import EditDealStages from "./EditDealStages";
import AddDealStages from "./AddDealStages";
import { Option } from "antd/es/mentions";

const DealStagesList = () => {
  const [isEditLeadStagesModalVisible, setIsEditLeadStagesModalVisible] =
    useState(false);
  const [isAddLeadStagesModalVisible, setIsAddLeadStagesModalVisible] =
    useState(false);

  const [selectedPipeline, setSelectedPipeline] = useState("all");

  const dispatch = useDispatch();

  const loggeduser = useSelector((state) => state.user.loggedInUser.username);


  const allfdata = useSelector((state) => state.StagesLeadsDeals);
  const fnddataa = allfdata?.StagesLeadsDeals?.data || [];

  const fnddata = fnddataa.filter((item)=>item.created_by === loggeduser)


  const [leadadatafilter, setLeadadatafilter] = useState([]);
  const [idd, setIdd] = useState("");

  const Allpipline = useSelector((state) => state.Piplines);
  const Filterpipline = Allpipline?.Piplines?.data || [];

  
    const filterpipline = Filterpipline.filter((item)=>item.created_by === loggeduser)

  useEffect(() => {
    dispatch(getstages());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      const filteredData = fnddata.filter((item) => item.stageType === "deal");
      setLeadadatafilter(filteredData);
    }
  }, [fnddata]);

  const openAddLeadStagesModal = () => {
    setIsAddLeadStagesModalVisible(true);
  };

  const closeAddLeadStagesModal = () => {
    setIsAddLeadStagesModalVisible(false);
  };

  const openEditLeadStagesModal = () => {
    setIsEditLeadStagesModalVisible(true);
  };

  const closeEditLeadStagesModal = () => {
    setIsEditLeadStagesModalVisible(false);
  };

  const deletefun = (userId) => {
    dispatch(deletestages(userId)).then(() => {
      setLeadadatafilter(leadadatafilter.filter((item) => item.id !== userId));
      dispatch(getstages());
      message.success("Leade stage deleted successfully");
    });
  };

  const Editfun = (idd) => {
    openEditLeadStagesModal();
    setIdd(idd);
  };

  const handlePipelineChange = (value) => {
    setSelectedPipeline(value);
    if (value === "all") {
      setLeadadatafilter(fnddata.filter((item) => item.stageType === "deal"));
    } else {
      const filtered = fnddata.filter(
        (item) => item.stageType === "deal" && item.pipeline === value
      );
      setLeadadatafilter(filtered);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Manage Lead Stages</h1>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap mt-2 gap-4"
        >
          <Button type="primary" onClick={openAddLeadStagesModal}>
            <PlusOutlined />
          </Button>
        </Flex>
      </div>

      <div className="mb-4">
        <Select
          placeholder="Select Pipeline"
          style={{ width: 200 }}
          onChange={handlePipelineChange}
          value={selectedPipeline}
        >
          <Option value="all">All Pipelines</Option>
          {filterpipline?.map((pipeline) => (
            <Option key={pipeline?.id} value={pipeline?.id}>
              {pipeline?.pipeline_name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {leadadatafilter.length > 0 ? (
              leadadatafilter.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <TiArrowMove className="text-black text-4xl font-medium cursor-move" />
                    <span className="text-black text-lg font-normal">
                      {item.stageName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200"
                      onClick={() => Editfun(item.id)}
                    >
                      <EditOutlined className="text-xl" />
                    </button>
                    <button
                      className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200"
                      onClick={() => deletefun(item.id)}
                    >
                      <DeleteOutlined className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                No lead stages available.
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Add Deal Stages"
        visible={isAddLeadStagesModalVisible}
        onCancel={closeAddLeadStagesModal}
        footer={null}
        width={700}
        className="mt-[-70px]"
      >
        <AddDealStages onClose={closeAddLeadStagesModal} />
      </Modal>

      <Modal
        title="Edit Deal Stages"
        visible={isEditLeadStagesModalVisible}
        onCancel={closeEditLeadStagesModal}
        footer={null}
        width={700}
        className="mt-[-70px]"
      >
        <EditDealStages onClose={closeEditLeadStagesModal} idd={idd} />
      </Modal>
    </>
  );
};

export default DealStagesList;

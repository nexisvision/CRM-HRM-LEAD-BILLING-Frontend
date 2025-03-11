import React, { useEffect, useMemo, useState } from "react";
import { TiArrowMove } from "react-icons/ti";
import Flex from "components/shared-components/Flex";
import { Button, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletestages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";
import EditLabels from "./EditLabels";
import AddLabels from "./AddLabels";

const { Option } = Select;

const LabelsList = () => {
  const [isEditLeadStagesModalVisible, setIsEditLeadStagesModalVisible] =
    useState(false);
  const [isAddLeadStagesModalVisible, setIsAddLeadStagesModalVisible] =
    useState(false);
  const dispatch = useDispatch();

  const allfdata = useSelector((state) => state.StagesLeadsDeals);
  const fnddata = useMemo(() => allfdata?.StagesLeadsDeals?.data || [], [allfdata?.StagesLeadsDeals?.data]);

  const Allpipline = useSelector((state) => state.Piplines);
  const Filterpipline = Allpipline?.Piplines?.data || [];

  const loggeduser = useSelector((state) => state.user.loggedInUser.username);

  const filterpipline = Filterpipline.filter((item) => item.created_by === loggeduser)

  const [leadadatafilter, setLeadadatafilter] = useState([]);
  const [idd, setIdd] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState("all");

  useEffect(() => {
    dispatch(getstages());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      const filteredData = fnddata.filter((item) => item.stageType === "lable");
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
    dispatch(deletestages(userId));
    setLeadadatafilter(leadadatafilter.filter((item) => item.id !== userId));
    dispatch(getstages());
    dispatch(getstages());
  };

  const Editfun = (idd) => {
    openEditLeadStagesModal();
    setIdd(idd);
  };

  const handlePipelineChange = (value) => {
    setSelectedPipeline(value);
    if (value === "all") {
      setLeadadatafilter(fnddata.filter((item) => item.stageType === "lable"));
    } else {
      const filtered = fnddata.filter(
        (item) => item.stageType === "lable" && item.pipeline === value
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

      {/* Pipeline Dropdown */}
      {/* Pipeline Dropdown */}
      <div className="mb-4">
        <Select
          placeholder="Select Pipeline"
          style={{ width: 200 }}
          onChange={handlePipelineChange}
          value={selectedPipeline}
        >
          <Option value="all">All Pipelines</Option>
          {filterpipline.map((pipeline) => (
            <Option key={pipeline.id} value={pipeline.id}>
              {pipeline.pipeline_name}
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
        title="Add Labels"
        visible={isAddLeadStagesModalVisible}
        onCancel={closeAddLeadStagesModal}
        footer={null}
        width={700}
        className="mt-[-70px]"
      >
        <AddLabels onClose={closeAddLeadStagesModal} />
      </Modal>

      <Modal
        title="Edit Labels"
        visible={isEditLeadStagesModalVisible}
        onCancel={closeEditLeadStagesModal}
        footer={null}
        width={700}
        className="mt-[-70px]"
      >
        <EditLabels onClose={closeEditLeadStagesModal} idd={idd} />
      </Modal>
    </>
  );
};

export default LabelsList;

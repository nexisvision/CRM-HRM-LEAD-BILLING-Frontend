import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Input, Form, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  useDroppable,
  useDraggable,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { getstages } from "../../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads, LeadsEdit } from "../../leads/LeadReducers/LeadSlice";  
import AddDealCards from "./AdddealCards"; // Assuming AddLead is an action
import { GetPip } from "../../systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { Option } from "antd/es/mentions";

const DraggableItem = ({ lead, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({
      id,
    });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    marginBottom: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <h4>{`${lead.firstName} ${lead.lastName}`}</h4>
        <p>Email: {lead.email}</p>
        <p>Phone: {lead.phone}</p>
      </Card>
    </div>
  );
};

const DroppableColumn = ({ status, leads }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  const [isAddLeadVisible, setIsAddLeadVisible] = useState(false); 
  const handleAddLeadClick = () => {
    setIsAddLeadVisible(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "100px",
        backgroundColor: "#f9f9f9",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <SortableContext
        items={leads?.map((lead) => lead?.id)}
        strategy={verticalListSortingStrategy}
      >
        {leads?.map((lead) => (
          <DraggableItem key={lead?.id} lead={lead} id={lead?.id} />
        ))}
      </SortableContext>
      {/* <Button className="mt-2 w-full"  onClick={handleAddLeadClick}>
        Add task
        <PlusOutlined />
      </Button> */}
    </div>
  );
};

const LeadCards = () => {
  const [leadData, setLeadData] = useState([]);
  const [isAddLeadCardsVisible, setIsAddLeadCardsVisible] = useState(false); // State for toggling the add lead form
  const [newLead, setNewLead] = useState({}); // State for form inputs
  const dispatch = useDispatch();
   const [selectedPipeline, setSelectedPipeline] = useState("all");
     const [leadadatafilter, setLeadadatafilter] = useState([]);

  useEffect(() => {
    dispatch(getstages());
    dispatch(GetLeads());
  }, [dispatch]);

  const allstagedata = useSelector((state) => state.StagesLeadsDeals);
  const fndata = allstagedata?.StagesLeadsDeals?.data || [];

  const allleaddata = useSelector((state) => state.Leads);
  const fndleadadat = allleaddata?.Leads?.data || [];


  useEffect(()=>{
   dispatch(GetPip());
  },[])
  
    const Allpipline = useSelector((state) => state.Piplines);
    const Filterpipline = Allpipline?.Piplines?.data || [];

    const alldatas = useSelector((state)=>state.user.loggedInUser.username)

    const fnddatss = Filterpipline.filter((item)=>item.created_by === alldatas)

  useEffect(() => {
    if (fndata.length > 0) {
      const filteredStages = selectedPipeline === "all" 
        ? fndata 
        : fndata.filter((stage) => stage.pipeline === selectedPipeline);

      const leadsGroupedByStage = filteredStages.map((stage) => ({
        status: stage.stageName,
        stageId: stage.id,
        leads: fndleadadat.filter((lead) => lead.leadStage === stage.id),
      }));

      setLeadData(leadsGroupedByStage);
    }
  }, [fndata, fndleadadat, selectedPipeline]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    let sourceGroupIndex = -1;
    let destinationGroupIndex = -1;
    let sourceLeadIndex = -1;
    let destinationLeadIndex = -1;
    let movedLead = null;
    let destinationStageId = null;

    leadData.forEach((group, groupIndex) => {
      const leadIndex = group.leads.findIndex((lead) => lead.id === activeId);
      if (leadIndex !== -1) {
        sourceGroupIndex = groupIndex;
        sourceLeadIndex = leadIndex;
        movedLead = group.leads[leadIndex];
      }
      if (
        group.status === overId ||
        group.leads.some((lead) => lead.id === overId)
      ) {
        destinationGroupIndex = groupIndex;
        destinationStageId = group.stageId;
        destinationLeadIndex = group.leads.findIndex(
          (lead) => lead.id === overId
        );
      }
    });

    const updatedLeadData = [...leadData];

    if (sourceGroupIndex === destinationGroupIndex) {
      updatedLeadData[sourceGroupIndex].leads = arrayMove(
        updatedLeadData[sourceGroupIndex].leads,
        sourceLeadIndex,
        destinationLeadIndex
      );
    } else {
      const [removedLead] = updatedLeadData[sourceGroupIndex].leads.splice(
        sourceLeadIndex,
        1
      );

      updatedLeadData[destinationGroupIndex].leads.splice(
        destinationLeadIndex === -1
          ? updatedLeadData[destinationGroupIndex].leads.length
          : destinationLeadIndex,
        0,
        removedLead
      );

      if (movedLead && destinationStageId) {
        dispatch(
          LeadsEdit({
            id: movedLead.id,
            values: { leadStage: destinationStageId },
          })
        );
      }
    }

    setLeadData(updatedLeadData);
  };

  // Handle showing the add lead form
  const handleAddLeadCardsClick = () => {
    setIsAddLeadCardsVisible(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleAddLeadCardsSubmit = () => {
    // dispatch(AddDealCards(newLead));
    setIsAddLeadCardsVisible(false); // Close the form after submission
    // setNewLead({leadtitle:"", firstName: "", lastName: "",telephone:"", leadstage: "",  emailadress: "",leadvalue:"",currency:"",assigned:"",status:"" }); // Reset form fields
  };

  const handlePipelineChange = (value) => {
    setSelectedPipeline(value);
  };
  

  return (
    <div className="p-4">
      {/* Add Lead Button */}
      <div className="mb-4">
              <Select
                placeholder="Select Pipeline"
                style={{ width: 200 }}
                onChange={handlePipelineChange}
                value={selectedPipeline}
              >
                <Option value="all">All Pipelines</Option>
                {fnddatss.map((pipeline) => (
                  <Option key={pipeline.id} value={pipeline.id}>
                    {pipeline.pipeline_name}
                  </Option>
                ))}
              </Select>
            </div>
      {/* <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddLeadCardsClick}
        style={{ marginBottom: "16px" }}
      >
        Add Lead
      </Button> */}

      {/* <Select
        placeholder="Select a pipeline"
        onChange={(value) => setSelectedPipeline(value)}
        style={{ marginBottom: "16px", width: "100%" }}
      >
        {[...new Set(fndata.map((stage) => stage.pipelineId))].map((pipelineId) => (
          <Select.Option key={pipelineId} value={pipelineId}>
            {fndata.find((stage) => stage.pipelineId === pipelineId)?.pipelineName || `Pipeline ${pipelineId}`}
          </Select.Option>
        ))}
      </Select> */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Row gutter={16}>
          {leadData?.length > 0 ? (
            leadData.map((leadGroup) => (
              <Col xs={24} sm={12} md={8} lg={6} key={leadGroup?.stageId}>
                <Card title={leadGroup?.status} className="mb-4">
                  <DroppableColumn
                    status={leadGroup?.status}
                    leads={leadGroup?.leads || []}
                  />
                </Card>
              </Col>
            ))
          ) : (
            <p>No stages or leads available</p>
          )}
        </Row>

        {/* Add Lead Modal */}
        <Modal
          title="Add Lead"
          visible={isAddLeadCardsVisible}
          onCancel={() => setIsAddLeadCardsVisible(false)}
          footer={null} // Remove the footer since AddLeadCards will have its own buttons
        >
          <AddDealCards
            visible={isAddLeadCardsVisible}
            onClose={() => setIsAddLeadCardsVisible(false)}
          />
        </Modal>
         
      </DndContext>
    </div>
  );
};

export default LeadCards;

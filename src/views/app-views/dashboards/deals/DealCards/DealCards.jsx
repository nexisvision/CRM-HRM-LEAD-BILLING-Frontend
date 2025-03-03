import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Select, Avatar } from "antd";
import { DndContext, useDroppable, useDraggable, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { getstages } from "../../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads } from "../../leads/LeadReducers/LeadSlice";
import AddDealCards from "./AdddealCards";
import { GetPip } from "../../systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { Option } from "antd/es/mentions";
import { EditDeals, GetDeals } from "../DealReducers/DealSlice";
import { CalendarOutlined, CommentOutlined } from "@ant-design/icons";

const DraggableItem = ({ lead, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    marginBottom: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className="cursor-pointer hover:shadow-md transition-all"
        bodyStyle={{ padding: '16px', paddingLeft: '20px', position: 'relative' }}
      >
        {/* Left border line */}
        <div 
          style={{ 
            position: 'absolute',
            left: "16px",
            right: 0,
            top: '15px',
            height: '3px',
            width: '50px',
            backgroundColor: '#1677ff',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px'
          }} 
        />
        
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '500',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>
            {lead.dealName}
          </h4>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '8px',
            color: '#8c8c8c',
            fontSize: '13px'
          }}>
            <CalendarOutlined style={{ marginRight: '4px' }} />
            {new Date(lead.closedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
            <div style={{ margin: '0 8px' }}>•</div>
            <CommentOutlined style={{ marginRight: '4px' }} />
            1
          </div>

          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px'
          }}>
            <div style={{ 
              fontSize: '13px',
              color: '#595959'
            }}>
              {/* {lead.currency} {lead.price} */}
            </div>
            <Avatar.Group>
              <Avatar size="small" style={{ backgroundColor: '#f56a00' }}>K</Avatar>
              <Avatar size="small" style={{ backgroundColor: '#87d068' }}>U</Avatar>
              <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>O</Avatar>
            </Avatar.Group>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DroppableColumn = ({ status, leads }) => {
  const { setNodeRef } = useDroppable({ id: status });

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
      <SortableContext items={leads?.map((lead) => lead?.id)} strategy={verticalListSortingStrategy}>
        {leads?.map((lead) => (
          <DraggableItem key={lead?.id} lead={lead} id={lead?.id} />
        ))}
      </SortableContext>
    </div>
  );
};

const DealCards = () => {
  const [leadData, setLeadData] = useState([]);
  console.log("leadData", leadData);
  const [isAddLeadCardsVisible, setIsAddLeadCardsVisible] = useState(false);
  const dispatch = useDispatch();
  const [selectedPipeline, setSelectedPipeline] = useState("all");

  const loggeduserdata = useSelector((state) => state.user.loggedInUser.username);

  useEffect(() => {
    dispatch(getstages());
    dispatch(GetLeads());
    dispatch(GetDeals());
  }, [dispatch]);

  const allstagedata = useSelector((state) => state.StagesLeadsDeals);
  const fndata = allstagedata?.StagesLeadsDeals?.data || [];



  const allleaddata = useSelector((state) => state.Deals);
  const fndleadadat = allleaddata?.Deals?.data || [];

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  const Allpipline = useSelector((state) => state.Piplines);
  const Filterpipline = Allpipline?.Piplines?.data || [];

  const fnddatss = Filterpipline.filter((item) => item.created_by === loggeduserdata);
  useEffect(() => {
    if (fndata.length > 0) {
      const filteredStages = selectedPipeline === "all"
        ? fndata.filter((stage) => stage.stageType === "deal" && stage.created_by === loggeduserdata)
        : fndata.filter((stage) => stage.pipeline === selectedPipeline && stage.stageType === "deal" && stage.created_by === loggeduserdata);

      const leadsGroupedByStage = filteredStages.map((stage) => ({
        status: stage.stageName,
        stageId: stage.id,
        leads: fndleadadat.filter((lead) => lead.stage === stage.id),
      }));
      setLeadData(leadsGroupedByStage);
    }
  }, [fndata, fndleadadat, selectedPipeline, loggeduserdata]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

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
      if (group.status === overId || group.leads.some((lead) => lead.id === overId)) {
        destinationGroupIndex = groupIndex;
        destinationStageId = group.stageId;
        destinationLeadIndex = group.leads.findIndex((lead) => lead.id === overId);
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
      const [removedLead] = updatedLeadData[sourceGroupIndex].leads.splice(sourceLeadIndex, 1);

      updatedLeadData[destinationGroupIndex].leads.splice(
        destinationLeadIndex === -1 ? updatedLeadData[destinationGroupIndex].leads.length : destinationLeadIndex,
        0,
        removedLead
      );

      if (movedLead && destinationStageId) {
        dispatch(
          EditDeals({
            id: movedLead.id,
            values: { stage: destinationStageId },
          })
        );
      }
    }

    setLeadData(updatedLeadData);
  };

  const handlePipelineChange = (value) => {
    setSelectedPipeline(value);
  };

  return (
    <div className="p-4">
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Row gutter={16}>
          {leadData?.length > 0 ? (
            leadData.map((leadGroup) => (
              <Col xs={24} sm={12} md={8} lg={6} key={leadGroup?.stageId}>
                <Card title={leadGroup?.status} className="mb-4">
                  <DroppableColumn status={leadGroup?.status} leads={leadGroup?.leads || []} />
                </Card>
              </Col>
            ))
          ) : (
            <p>No stages or leads available</p>
          )}
        </Row>

        <Modal
          title="Add Deal"
          visible={isAddLeadCardsVisible}
          onCancel={() => setIsAddLeadCardsVisible(false)}
          footer={null}
        >
          <AddDealCards visible={isAddLeadCardsVisible} onClose={() => setIsAddLeadCardsVisible(false)} />
        </Modal>
      </DndContext>
    </div>
  );
};

export default DealCards;

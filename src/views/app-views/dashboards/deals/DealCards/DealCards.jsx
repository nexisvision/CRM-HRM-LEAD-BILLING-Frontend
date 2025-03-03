import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Select, Avatar, Tag, Progress, Tooltip } from "antd";
import { DndContext, useDroppable, useDraggable, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { getstages } from "../../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads } from "../../leads/LeadReducers/LeadSlice";
import AddDealCards from "./AdddealCards";
import { GetPip } from "../../systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { Option } from "antd/es/mentions";
import { EditDeals, GetDeals } from "../DealReducers/DealSlice";
import { 
  CalendarOutlined, 
  DollarOutlined, 
  ProjectOutlined,
  UserOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

const DraggableItem = ({ lead, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    marginBottom: "12px",
    cursor: "pointer",
  };

  const daysRemaining = () => {
    const closedDate = new Date(lead.closedDate);
    const today = new Date();
    const diffTime = closedDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (days) => {
    if (days <= 7) return "#ff4d4f";
    if (days <= 14) return "#faad14";
    return "#52c41a";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="deal-card"
        bodyStyle={{ padding: "12px" }}
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          background: "#fff",
          border: "1px solid #f0f0f0",
        }}
      >
        <div className="deal-card-header" style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Avatar 
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>{lead.dealName}</h4>
                <span style={{ fontSize: "12px", color: "#8c8c8c" }}>{lead.leadTitle}</span>
              </div>
            </div>
            <Tag color="blue">{lead.pipeline}</Tag>
          </div>
        </div>

        <div className="deal-card-content" style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <Tooltip title="Deal Value">
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <DollarOutlined style={{ color: "#52c41a" }} />
                <span style={{ fontWeight: "500" }}>
                  {Number(lead.price).toLocaleString()}
                </span>
              </div>
            </Tooltip>
            <Tooltip title="Project">
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <ProjectOutlined style={{ color: "#1890ff" }} />
                <span>{lead.project}</span>
              </div>
            </Tooltip>
          </div>

          <div style={{ marginTop: "12px" }}>
            <Tooltip title="Closing Date">
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                <CalendarOutlined style={{ color: "#faad14" }} />
                <span>{new Date(lead.closedDate).toLocaleDateString()}</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: "#8c8c8c" }}>
                  {Math.abs(daysRemaining())} days {daysRemaining() >= 0 ? "remaining" : "overdue"}
                </span>
              </div>
            </Tooltip>
            {/* <Progress 
              percent={Math.min(100, Math.max(0, (30 - Math.abs(daysRemaining())) / 30 * 100))}
              strokeColor={getProgressColor(daysRemaining())}
              showInfo={false}
              size="small"
            /> */}
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
        backgroundColor: "rgba(0,0,0,0.02)",
        padding: "16px",
        borderRadius: "12px",
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
    <div className="deal-board" style={{ padding: "24px" }}>
      <div className="deal-board-header" style={{ marginBottom: "24px" }}>
        <Select
          placeholder="Select Pipeline"
          style={{ 
            width: '100%',
            maxWidth: '300px',
            marginBottom: '16px'
          }}
          onChange={handlePipelineChange}
          value={selectedPipeline}
          suffixIcon={<ArrowRightOutlined />}
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
        <Row 
          gutter={[16, 16]}
          style={{
            margin: 0,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            padding: '8px 4px'
          }}
        >
          {leadData?.length > 0 ? (
            leadData.map((leadGroup) => (
              <Col 
                key={leadGroup?.stageId}
                style={{
                  minWidth: '300px',
                  maxWidth: '350px'
                }}
              >
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{leadGroup?.status}</span>
                      <Tag color="blue">{leadGroup?.leads?.length || 0}</Tag>
                    </div>
                  }
                  className="stage-card"
                  headStyle={{ 
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '12px 16px'
                  }}
                  bodyStyle={{ 
                    padding: '16px',
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <DroppableColumn status={leadGroup?.status} leads={leadGroup?.leads || []} />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Card>
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <p style={{ color: '#8c8c8c' }}>No stages or leads available</p>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </DndContext>

      <Modal
        title="Add Deal"
        visible={isAddLeadCardsVisible}
        onCancel={() => setIsAddLeadCardsVisible(false)}
        footer={null}
        width={720}
      >
        <AddDealCards visible={isAddLeadCardsVisible} onClose={() => setIsAddLeadCardsVisible(false)} />
      </Modal>

      <style jsx>{`
        .deal-board {
          background: #fff;
          min-height: calc(100vh - 64px);
        }
        
        .stage-card {
          height: 100%;
          background: #fff;
        }

        .deal-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .deal-board {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default DealCards;

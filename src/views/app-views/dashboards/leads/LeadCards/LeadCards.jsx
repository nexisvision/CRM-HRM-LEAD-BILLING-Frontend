import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Input, Form, Select, Avatar, Tag, Badge, Tooltip, Progress } from "antd";
import { PlusOutlined, CalendarOutlined, MessageOutlined, CommentOutlined, UserOutlined, PhoneOutlined, MailOutlined, ArrowRightOutlined } from "@ant-design/icons";
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
import { GetLeads, LeadsEdit } from "../LeadReducers/LeadSlice"; 
import AddLeadCards from "./AddleadCards"; // Assuming AddLead is an action
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
    marginBottom: "12px",
    cursor: "move",
  };

  // Calculate days since creation
  const daysSinceCreation = () => {
    const createdDate = new Date(lead.createdAt);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get progress color based on days
  const getProgressColor = (days) => {
    if (days <= 7) return "#52c41a";
    if (days <= 14) return "#faad14";
    return "#ff4d4f";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className="lead-card cursor-pointer"
        bodyStyle={{ padding: '12px' }}
        bordered={false}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          border: '1px solid #e6ebf5',
          position: 'relative',
          overflow: 'hidden'
        }}
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
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium mb-2 mt-2">{lead.leadTitle}</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarOutlined className="mr-1" />
                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <CommentOutlined className="mr-1" />
                  {lead.commentCount || 1}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Avatar.Group size={35}>
              <Avatar 
                src={lead.assigned?.profilePicture || "https://www.gravatar.com/avatar/?d=mp"}
                alt={lead.assigned?.name || "User Avatar"}
              />
              <Avatar
                src="https://www.gravatar.com/avatar/?d=mp"
                alt="Team Member"
              />
              <Avatar
                src="https://www.gravatar.com/avatar/?d=mp"
                alt="Team Member"
              />
            </Avatar.Group>
          </div>
        </div>
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

  const loggeduserdata = useSelector((state) => state.user.loggedInUser.username);

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
        ? fndata.filter((stage) => stage.stageType === "lead" && stage.created_by === loggeduserdata)
        : fndata.filter((stage) => stage.pipeline === selectedPipeline && stage.stageType === "lead" && stage.created_by === loggeduserdata);

      const leadsGroupedByStage = filteredStages.map((stage) => ({
        status: stage.stageName,
        stageId: stage.id,
        leads: fndleadadat.filter((lead) => lead.leadStage === stage.id),
      }));

      setLeadData(leadsGroupedByStage);
    }
  }, [fndata, fndleadadat, selectedPipeline, loggeduserdata]);

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
            formData: { leadStage: destinationStageId },
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
    dispatch(AddLeadCards(newLead));
    setIsAddLeadCardsVisible(false); // Close the form after submission
    // setNewLead({leadtitle:"", firstName: "", lastName: "",telephone:"", leadstage: "",  emailadress: "",leadvalue:"",currency:"",assigned:"",status:"" }); // Reset form fields
  };

  const handlePipelineChange = (value) => {
    setSelectedPipeline(value);
  };
  

  return (
    <div className="lead-board" style={{ padding: "24px" }}>
      <div className="lead-board-header" style={{ marginBottom: "24px" }}>
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
        title="Add Lead"
        visible={isAddLeadCardsVisible}
        onCancel={() => setIsAddLeadCardsVisible(false)}
        footer={null}
        width={720}
      >
        <AddLeadCards visible={isAddLeadCardsVisible} onClose={() => setIsAddLeadCardsVisible(false)} />
      </Modal>

      <style jsx>{`
        .lead-board {
          background: #fff;
          min-height: calc(100vh - 64px);
        }
        
        .stage-card {
          height: 100%;
          background: #fff;
        }

        .lead-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .lead-board {
            padding: 16px;
          }
        }

        .truncate {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default LeadCards;

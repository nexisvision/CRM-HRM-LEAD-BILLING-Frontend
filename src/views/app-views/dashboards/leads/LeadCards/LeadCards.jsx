import React, { useState } from "react";
import { Card, Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const LeadCards = () => {
  const [selectedTaskStatus, setSelectedTaskStatus] = useState("All");

  const leadData = [
    {
      status: "To be processed",
      tasks: [
        { id: 1, title: "Table data incorrect", date: "11 July", comments: 2, status: "To be processed" },
        { id: 2, title: "Fix broken UI", date: "05 August", comments: 1, status: "To be processed" },
      ],
    },
    {
      status: "Processing",
      tasks: [
        { id: 3, title: "Fix dashboard layout", date: "17 April", comments: 1, status: "Processing" },
        { id: 4, title: "New design", date: "1", comments: 1, status: "Processing" },
        { id: 5, title: "Improve user experiences", date: "20 May", comments: 1, status: "Processing" },
      ],
    },
    {
      status: "Submitted",
      tasks: [
        { id: 6, title: "Update node environment", date: "", comments: 0, status: "Submitted" },
      ],
    },
    {
      status: "Completed",
      tasks: [
        { id: 7, title: "Ready to test", date: "04 April", comments: 1, status: "Completed" },
        { id: 8, title: "Slow API connection", date: "19 August", comments: 0, status: "Completed" },
        { id: 9, title: "Login failed", date: "06 May", comments: 0, status: "Completed" },
        { id: 10, title: "Locale incorrect", date: "13 August", comments: 2, status: "Completed" },
      ],
    },
  ];

  // Function to filter tasks based on selected task status
  const filterTasks = (tasks) => {
    if (selectedTaskStatus === "All") return tasks; // Return all tasks if "All" is selected
    return tasks.filter(task => task.status === selectedTaskStatus);
  };

  return (
    <div className="p-4">
      <Row gutter={16}>
        {leadData.map((leadGroup) => (
          <Col xs={24} sm={12} md={8} lg={6} key={leadGroup.status}>
            <Card title={leadGroup.status} className="mb-4">
              <Card className="inner-card p-2 bg-white rounded">
                {filterTasks(leadGroup.tasks).map((task) => (
                  <Card
                    key={task.id}
                    className="mt-2 p-2 bg-gray-100 rounded"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                  >
                    <h4 className="text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500">{task.date}</p>
                    <p className="text-xs text-gray-500">Comments: {task.comments}</p>
                  </Card>
                ))}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const taskId = e.dataTransfer.getData("taskId");
                    const task = leadData.flatMap(group => group.tasks).find(t => t.id === parseInt(taskId));
                    if (task && task.status !== leadGroup.status) {
                      task.status = leadGroup.status;
                      console.log(`Task ID: ${taskId} moved to ${leadGroup.status}`);
                     
                    }
                  }}
                  className="drop-area"
                >
                  <Button className="mt-2 w-full">
                    Add task
                    <PlusOutlined />
                  </Button>
                </div>
              </Card>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LeadCards;

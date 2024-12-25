import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Input, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddTask from './AddTask';
import EditTask from './EditTask';

const TaskList = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Task One',
      status: 'Ongoing',
      priority: 'Medium',
      date: 'Jul 12, 2021 3:00 PM',
    },
  ]);

  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Open Add Task Modal
  const openAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
  };

  // Close Add Task Modal
  const closeAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
  };

  // Open Edit Task Modal
  const openEditTaskModal = () => {
    // setSelectedTask(task);   
    setIsEditTaskModalVisible(true);
  };

  // Close Edit Task Modal
  const closeEditTaskModal = () => {
    // setSelectedTask(null);
    setIsEditTaskModalVisible(false);
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const tableColumns = [
    {
      title: 'Task Name',
      dataIndex: 'name',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'Ongoing' ? 'orange' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, task) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditTaskModal(task)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteTask(task.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" style={{ marginBottom: '20px' }}>
        <Col>
          <h1 className='font-bold text-lg mt-15px'>Tasks</h1>
        </Col>
        
        <Col>
          <Button type="primary" onClick={openAddTaskModal}>
            <PlusOutlined />
          </Button>
        </Col>
      </Row>
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Table
        dataSource={tasks}
        columns={tableColumns}
        rowKey="id"
        pagination={false}
      />
      {/* Add Task Modal */}
      {/* <Modal
        title=""
        visible={isAddTaskModalVisible}
        onCancel={closeAddTaskModal}
        footer={null}
      >

        <AddTask  onCancel={closeAddTaskModal} />
        {/* Add Task Form */}
      {/* </Modal> */}

      <Modal
        title="Add Task"
        visible={isAddTaskModalVisible}
        onCancel={closeAddTaskModal}
        footer={null}
        width={800}
      >
        <AddTask onClose={closeAddTaskModal} />
      </Modal>


      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        visible={isEditTaskModalVisible}
        onCancel={closeEditTaskModal}
        footer={null}
        width={800}
      >

        <EditTask onClose={closeEditTaskModal} />
        {/* Edit Task Form */}
      </Modal>
    </Card>
  );
};

export default TaskList;

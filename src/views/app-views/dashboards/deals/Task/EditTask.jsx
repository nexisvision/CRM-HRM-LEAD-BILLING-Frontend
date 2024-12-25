import React, { useEffect } from 'react';
import { Modal, Input, DatePicker, TimePicker, Select, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EditTask = ({ visible, onCancel, onUpdate, taskData }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    date: null,
    time: null,
    priority: '',
    status: '',
  });

  useEffect(() => {
    // Populate form data when taskData is provided
    if (taskData) {
      setFormData({
        name: taskData.name || '',
        date: taskData.date ? moment(taskData.date, 'DD-MM-YYYY') : null,
        time: taskData.time ? moment(taskData.time, 'HH:mm') : null,
        priority: taskData.priority || '',
        status: taskData.status || '',
      });
    }
  }, [taskData]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    // Pass updated data to the onUpdate callback
    onUpdate({
      ...formData,
      date: formData.date?.format('DD-MM-YYYY'),
      time: formData.time?.format('HH:mm'),
    });
  };

  return (
    // <Modal
    //   title="Edit Task"
    //   visible={visible}
    //   onCancel={onCancel}
    //   footer={null}
    //   width={600}
    // >
      <form className="space-y-6">
        {/* Task Name Input */}
        <div>
          <label className="block font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              className="w-full"
              format="DD-MM-YYYY"
              value={formData.date}
              onChange={(date) => handleChange('date', date)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <TimePicker
              className="w-full"
              format="HH:mm"
              value={formData.time}
              onChange={(time) => handleChange('time', time)}
            />
          </div>
        </div>

        {/* Priority and Status Dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Select Priority"
              className="w-full"
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </div>
          <div>
            <label className="block font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Select Status"
              className="w-full"
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
            >
              <Option value="ongoing">On Going</Option>
              <Option value="completed">Completed</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4">
          <Button onClick={onCancel} className="bg-gray-300 text-gray-700">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-blue-500 text-white"
          >
            Update
          </Button>
        </div>
      </form>
    // </Modal>
  );
};

export default EditTask;

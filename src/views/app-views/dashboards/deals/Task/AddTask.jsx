import React from 'react';
import { Modal, Input, DatePicker, TimePicker, Select, Button } from 'antd';

const { Option } = Select;

const AddTask = ({ visible, onCancel, onCreate }) => {
  return (
    // <Modal
    //   title=""
    //   visible={visible}
    //   onCancel={onCancel}
    //   footer={null}
    //   width={600}
    // >
      <form className="space-y-6">
        {/* Task Name Input */}
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <div>
          <label className="block font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input placeholder="Enter Name" />
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker className="w-full" format="DD-MM-YYYY" />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <TimePicker className="w-full" format="HH:mm" />
          </div>
        </div>

        {/* Priority and Status Dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <Select placeholder="Select Priority" className="w-full">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </div>
          <div>
            <label className="block font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <Select placeholder="Select Status" className="w-full">
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
            onClick={onCreate}
            // className="bg-green-500 text-white"
          >
            Create
          </Button>
        </div>
      </form>
    // </Modal>
  );
};

export default AddTask;

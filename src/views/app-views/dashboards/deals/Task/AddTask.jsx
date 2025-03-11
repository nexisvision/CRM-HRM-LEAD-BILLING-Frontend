import React from "react";
import { Input, DatePicker, TimePicker, Select, Button } from "antd";

const { Option } = Select;

const AddTask = ({ visible, onCancel, onCreate }) => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input placeholder="Enter Name" />
      </div>

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

      <div className="flex justify-end space-x-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-700">
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={onCreate}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default AddTask;

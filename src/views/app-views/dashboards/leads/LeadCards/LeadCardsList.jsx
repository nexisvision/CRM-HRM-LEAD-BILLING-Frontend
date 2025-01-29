import React, { useEffect } from "react";
import { Input, Button, Form, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads } from "../LeadReducers/LeadSlice"; // Adjust the import path as necessary
import { Option } from "antd/es/mentions";


const LeadCardsList = () => {
  const dispatch = useDispatch();

  const leadsData = useSelector((state) => state.Leads.data);

  useEffect(() => {
    dispatch(GetLeads());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex   mb-6">
        <div className=" w-full ">
        <Input
          placeholder="Search leads..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="w-1/3 rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        </div>
        <div className="flex justify-end gap-4"> 
        <Form.Item
          name="leadFilter"
          className="mb-0"
          rules={[
            {
              required: true,
              message: "Please select a filter",
            },
          ]}
        >
          <Select 
            placeholder="Filter Leads"
            className="w-48 rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <Option value="XYZ">XYZ</Option>
            <Option value="ABC">ABC</Option>
          </Select>
        </Form.Item>
        <Button 
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 border-0 rounded-md flex items-center gap-2 px-4 py-2 text-white font-medium "
        >
          <PlusOutlined /> New Lead
        </Button>
        </div>
      </div>

      {/* <LeadCards leadData={leadsData} /> */}
    </div>
  );
};

export default LeadCardsList; 
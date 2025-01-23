import React, { useEffect } from "react";
import { Input, Button } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads } from "../LeadReducers/LeadSlice"; // Adjust the import path as necessary
import LeadCards from "./LeadCards";

const LeadCardsList = () => {
  const dispatch = useDispatch();

  const leadsData = useSelector((state) => state.Leads.data);

  useEffect(() => {
    dispatch(GetLeads());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-1/3"
        />
        <Button type="primary">
          <PlusOutlined /> New Lead
        </Button>
      </div>

      {/* <LeadCards leadData={leadsData} /> */}
    </div>
  );
};

export default LeadCardsList; 
import React from "react";
import { Button, Checkbox, Form } from "antd";
import { useNavigate } from "react-router-dom";

const AddSources = () => {
  const navigate = useNavigate();

  const sources = ["Websites", "Facebook", "Naukri.com", "Phone", "LinkedIn"];



  return (
    <div>
      <Form layout="vertical">
        <Checkbox.Group
          options={sources}
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        />
      </Form>

      <Form.Item>
        <div className="form-buttons text-right">
          <Button
            type="default"
            className="mr-2"
            onClick={() => navigate("/deals")}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </Form.Item>
    </div>
  );
};

export default AddSources;

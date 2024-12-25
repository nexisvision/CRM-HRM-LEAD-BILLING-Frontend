import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { ClientData, Editclient } from "./CompanyReducers/CompanySlice";
import { useDispatch } from "react-redux";

const EditCompany = ({ visible, onCancel, onUpdate, clientData,comnyid,onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // const handleFinish = async(values) => {
  //   await dispatch(Editclient({ comnyid, values })).unwrap();
  //   onUpdate(values); 
  //   form.resetFields();
  // };

    const handleFinish = async (values) => {
      try {
        await dispatch(Editclient({ comnyid, values })).unwrap();
    
        console.log("Client Data Added Successfully:", values);
        form.resetFields();
  
        onClose();
    
        await dispatch(ClientData());
    
        form.resetFields();
    
     
      } catch (error) {
        console.error("Error Adding Client:", error);
      }
    };
   

   const allempdata = useSelector((state) => state.ClientData);

   const datac = allempdata.ClientData.data;
    const [singleEmp, setSingleEmp] = useState(null);
  
    useEffect(() => {
      const empData = datac || [];
      const data = empData.find((item) => item.id === comnyid);
      setSingleEmp(data || null);
    }, [datac, comnyid]);
  
    useEffect(() => {
      if (singleEmp) {
        form.setFieldsValue({
          ...singleEmp,
        });
      }
    }, [singleEmp, form]);

  return (
    
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...clientData, 
        }}
      >
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

        <Form.Item
          name="username"
          label="Name"
          rules={[{ required: true, message: "Please enter the client name" }]}
        >
          <Input placeholder="Enter client Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-Mail Address"
          rules={[
            { required: true, message: "Please enter the client email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter Client Email" />
        </Form.Item>


        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onClose}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

  );
};

export default EditCompany;

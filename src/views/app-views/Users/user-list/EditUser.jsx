import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import { Edituser, GetUsers } from "../UserReducers/UserSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const { Option } = Select;

const EditUser = ({ idd, visible, onClose, onUpdate, userData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const getalllrole = useSelector((state) => state.role);
  const fnddata = getalllrole.role.data;

  const Getalluser = useSelector((state) => state.Users);
  const fnduset = Getalluser.Users.data;

  useEffect(() => {
    const finddata = fnduset.find((item) => item.id === idd);
    if (finddata) {
      form.setFieldsValue({
        username: finddata.username,
        email: finddata.email,
        role_id: finddata.role_id,
      });
    }
  }, [fnduset]);

  useEffect(() => {
    dispatch(roledata());
    dispatch(GetUsers());
  }, []);

  const handleFinish = (values) => {
    dispatch(Edituser({ idd, values }));
    dispatch(GetUsers());
    onClose();
    // console.log("Updated Values:", values);
    onUpdate(values);
    form.resetFields();
  };

  // Set initial values if userData is available
  const initialValues = {
    username: userData?.username || "",
    email: userData?.email || "",
    role_id: userData?.role_id || "",
  };

  return (
    // <Modal
    //   title="Edit User"
    //   visible={visible}
    //   onClose={onClose}
    //   footer={null}
    //   centered
    //   destroyOnClose
    // >
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="username"
            label="Name"
            rules={[{ required: true, message: "Please enter the user name" }]}
          >
            <Input placeholder="Enter User Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the user email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter User Email" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="role_id"
            label="User Role"
            rules={[{ required: true, message: "Please select a user role" }]}
          >
            <Select placeholder="Select Role">
              {fnddata?.map((tag) => (
                <Option key={tag?.id} value={tag?.id}>
                  {tag?.role_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* <Form.Item
          name="dob"
          label="Date Of Birth"
          rules={[
            { required: true, message: "Please select the date of birth" },
          ]}
        >
          <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
        </Form.Item> */}
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
    // </Modal>
  );
};

export default EditUser;

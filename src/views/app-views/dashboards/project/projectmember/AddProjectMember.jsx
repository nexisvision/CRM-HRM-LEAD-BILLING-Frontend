import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import axios from "axios";
const { Option } = Select;
const AddProjectMember = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Get logged-in user data
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const allEmployees = useSelector((state) => state.employee?.employee?.data || []);

  // Filter employees for the logged-in client
  const clientEmployees = allEmployees.filter(
    (emp) => emp?.created_by === loggedInUser.username
  );

  console.log("Logged in user:", loggedInUser);
  console.log("Client employees:", clientEmployees);

  const initialValues = {
    project_members: [],
  };

  const validationSchema = Yup.object({
    project_members: Yup.array().required("Please select project members"),
  });

  // Fetch employees and projects on component mount
  useEffect(() => {
    dispatch(empdata());
    dispatch(GetProject());
  }, [dispatch]);

  const Addmember = async (payload) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.post(
        `http://localhost:5353/api/v1/projects/membersadd/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        project_members: values.project_members,
      };

      await Addmember(payload);
      await dispatch(GetProject()).unwrap();

      message.success("Project members added successfully!");
      resetForm();
      onClose();
    } catch (error) {
      message.error("Failed to add project members!");
      console.error("Submit Error:", error);
    }
  };

  return (
    <div className="add-project-member-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold text-dark-gray-500">
                    Add Project Member <span className="text-red-500">*</span>
                  </label>
                  <Field name="project_members">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select Project Members"
                        onChange={(value) => setFieldValue("project_members", value)}
                        value={values.project_members}
                        onBlur={() => setFieldTouched("project_members", true)}
                      >
                        {clientEmployees && clientEmployees.length > 0 ? (
                          clientEmployees.map((employee) => (
                            <Option key={employee.id} value={employee.id}>
                              {employee.firstName || employee.username || "Unnamed Employee"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Employees Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="project_members"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>
            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Members
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddProjectMember;

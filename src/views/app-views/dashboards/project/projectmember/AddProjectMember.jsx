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
import { useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

import { useDispatch } from "react-redux";
import {
  Editpro,
  GetProject,
} from "../project-list/projectReducer/ProjectSlice";
import axios from "axios";
const { Option } = Select;
const AddProjectMember = ({ onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  // const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const initialValues = {
    project_members: [],
  };
  const validationSchema = Yup.object({
    project_members: Yup.array().required(
      "Please enter AddProjectMember name."
    ),
  });

  const { id } = useParams();

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
      console.log("Addmember API response:", res.data); // Log response
      return res.data;
    } catch (error) {
      if (error.response) {
        // Server responded with a status code out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // Request was made, but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error message:", error.message);
      }
      throw error;
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      if (!values.project_members || values.project_members.length === 0) {
        message.error("Please select project members!");
        return;
      }

      const payload = {
        project_members: values,
      };

      await Addmember(payload);
      await dispatch(GetProject()).unwrap();
      
      message.success("Project added successfully!");
      resetForm();
      onClose(); // Close modal after successful submission
    } catch (error) {
      message.error("Failed to add project or fetch data!");
      console.error("Error in onSubmit:", error);
    }
  };

const loggeduserdata = useSelector((state)=>state.user.loggedInUser.username)

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const fndemp = empData.filter((item)=>item?.created_by === loggeduserdata) || [];

  const Allpeoject = useSelector((state) => state.Project);
  const Filterdta = Allpeoject?.Project?.data || [];

  const project = Filterdta.find((item) => item.id === id);

  console.log("swswswsw", project.project_members);

  useEffect(() => {
    dispatch(empdata());
    dispatch(GetProject());
  }, [dispatch]);

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
                  <Field name="project_members">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select AddProjectMember"
                        onChange={(value) =>
                          setFieldValue("project_members", value)
                        }
                        value={values.project_members}
                        onBlur={() => setFieldTouched("project_members", true)}
                      >
                        {fndemp && fndemp.length > 0 ? (
                          fndemp.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName ||
                                client.username ||
                                "Unnamed Client"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Clients Available
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
                Create
              </Button>
            </div>
            {/* <Modal
                          
                        </Modal> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddProjectMember;

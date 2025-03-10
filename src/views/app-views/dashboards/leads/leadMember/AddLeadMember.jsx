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
} from "../../project/project-list/projectReducer/ProjectSlice";
import axios from "axios";
import { GetLeads } from "../LeadReducers/LeadSlice";
import { env } from "configs/EnvironmentConfig";
const { Option } = Select;
const AddLeadMember = ({ onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const initialValues = {
    lead_members: [],
  };
  const validationSchema = Yup.object({
    lead_members: Yup.array().required(
      "Please enter AddLeadMember name."
    ),
  });

  const { id } = useParams();

  useEffect(() => {
    dispatch(GetLeads())
  }, [dispatch])

  const Addmember = async (payload) => {
    const token = localStorage.getItem("auth_token");

    try {
      const res = await axios.post(
        `${env.API_ENDPOINT_URL}/leads/membersadd/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        lead_members: {
          lead_members: values.lead_members
        }
      };

      await Addmember(payload);

      await dispatch(GetLeads()).unwrap();

      message.success("Project added successfully!");
      resetForm();
      onClose();
    } catch (error) {
      message.error("Failed to add project or fetch data!");
      console.error("Error in onSubmit:", error);
    }
  };

  const loggeduserdata = useSelector((state) => state.user.loggedInUser.username)

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const fndemp = empData.filter((item) => item?.created_by === loggeduserdata) || [];

  const Allpeoject = useSelector((state) => state.Project);
  const Filterdta = Allpeoject?.Project?.data || [];

  const project = Filterdta.find((item) => item.id === id);


  useEffect(() => {
    dispatch(empdata());
    dispatch(GetProject());
  }, [dispatch]);

  return (
    <div className="add-project-member-form">

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
                
                  <Field name="lead_members">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select AddLeadMember"
                        onChange={(value) =>
                          setFieldValue("lead_members", value)
                        }
                        value={values.lead_members}
                        onBlur={() => setFieldTouched("lead_members", true)}
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
                    name="lead_members"
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

          </Form>
        )}
      </Formik>
    </div>
  );
};
export default AddLeadMember;

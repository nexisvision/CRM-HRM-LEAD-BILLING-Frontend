import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import OrderListData from "assets/data/order-list.data.json";
import Flex from "components/shared-components/Flex";
import utils from "utils";
import AvatarStatus from "components/shared-components/AvatarStatus";
import userData from "assets/data/user-list.data.json";
import dayjs from "dayjs";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";
import {
  Addstages,
  getstages,
} from "../LeadStages/LeadsReducer/LeadsstageSlice";

const { Option } = Select;

const AddDealStages = ({ onClose }) => {
  const [users, setUsers] = useState(userData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allpipline = useSelector((state) => state.Piplines);
  const fndpip = allpipline.Piplines.data;

  useEffect(() => {
    dispatch(GetPip());
  }, []);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "deal" };
    dispatch(Addstages(payload));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    resetForm();
    console.log("Submitted values:", payload);
    message.success("Lead stage added successfully!");
  };

  const initialValues = {
    stageName: "",
    pipeline: "",
  };

  const validationSchema = Yup.object({
    stageName: Yup.string().required("Please enter lead stage name."),
    pipeline: Yup.string().required("Please select pipeline."),
  });

  return (
    <>
      <div>
        <div className="">
          <h2 className="mb-1 border-b font-medium"></h2>

          <div className="">
            <div className=" p-2">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  setFieldValue,
                  handleSubmit,
                  setFieldTouched,
                  resetForm,
                }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">
                            Deal Stage Name
                          </label>
                          <Field
                            name="stageName"
                            as={Input}
                            placeholder="Enter Lead Stage Name"
                          />
                          <ErrorMessage
                            name="stageName"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Pipeline</label>
                          <Field name="pipeline">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full"
                                placeholder="Select Pipeline"
                                onChange={(value) =>
                                  setFieldValue("pipeline", value)
                                }
                                value={values.pipeline}
                                onBlur={() => setFieldTouched("pipeline", true)}
                              >
                                {fndpip && fndpip.length > 0 ? (
                                  fndpip.map((client) => (
                                    <Option key={client.id} value={client.id}>
                                      {client.pipeline_name || "Unnamed Client"}
                                    </Option>
                                  ))
                                ) : (
                                  <Option value="" disabled>
                                    No Pipeline Available
                                  </Option>
                                )}
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="pipeline"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="form-buttons text-right">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDealStages;

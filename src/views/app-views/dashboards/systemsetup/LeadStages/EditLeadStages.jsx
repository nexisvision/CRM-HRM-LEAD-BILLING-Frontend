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
import {
  Addstages,
  Editstages,
  getstages,
} from "./LeadsReducer/LeadsstageSlice";
import { GetPip } from "../Pipeline/PiplineReducer/piplineSlice";

const { Option } = Select;

const EditLeadStages = ({ idd, onClose }) => {
  const [users, setUsers] = useState(userData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allpipline = useSelector((state) => state.StagesLeadsDeals);
  const fndpip = allpipline.StagesLeadsDeals.data;

  const allpiplines = useSelector((state) => state.Piplines);
  const fndpips = allpiplines.Piplines.data;

  useEffect(() => {
    dispatch(GetPip());
  }, []);

  useEffect(() => {
    if (fndpip && idd) {
      const fndproperdata = fndpip.find((item) => item.id === idd);

      const sssss = fndpips.find((item) => item.id === fndproperdata.pipeline);
      if (fndproperdata) {
        setInitialValues({
          stageName: fndproperdata?.stageName || "",
          pipeline: sssss?.pipeline_name || "",
        });
      }
    }
  }, [fndpip, idd]);

  const onSubmit = (values, { resetForm }) => {
    const payload = { ...values, stageType: "lead" };
    dispatch(Editstages({ idd, payload }));
    dispatch(getstages());
    dispatch(getstages());
    onClose();
    console.log("Submitted values:", payload);
    message.success("Lead stage added successfully!");
  };

  const [initialValues, setInitialValues] = useState({
    stageName: "",
    pipeline: "",
  });

  const validationSchema = Yup.object({
    stageName: Yup.string().required("Please enter lead stage name."),
    pipeline: Yup.string().required("Please select pipeline."),
  });

  return (
    <div>
      <div className="">
        <h2 className="mb-1 border-b font-medium"></h2>
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
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
                  {/* Editable Stage Name Field */}
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Lead Stage Name <span className="text-rose-500">*</span></label>
                      <Field
                        name="stageName"
                        as={Input}
                        className="w-full mt-1"
                        placeholder="Enter Lead Stage Name"
                        value={values.stageName} // Controlled by Formik
                        onChange={(e) =>
                          setFieldValue("stageName", e.target.value)
                        } // Ensure user can edit
                      />
                      <ErrorMessage
                        name="stageName"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  {/* Editable Pipeline Field */}
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Pipeline <span className="text-rose-500">*</span></label>
                      <Field name="pipeline">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1  "
                            placeholder="Select Pipeline"
                            value={values.pipeline} // Controlled by Formik
                            onChange={(value) =>
                              setFieldValue("pipeline", value)
                            } // Ensure user can select
                            onBlur={() => setFieldTouched("pipeline", true)}
                          >
                            {fndpips && fndpips.length > 0 ? (
                              fndpips.map((client) => (
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

                {/* Form Buttons */}
                <div className="form-buttons text-right mt-3">
                  <Button type="default" className="mr-2" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditLeadStages;

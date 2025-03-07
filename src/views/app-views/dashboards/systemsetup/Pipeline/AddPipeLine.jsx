import React, { useState } from "react";
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
import { AddPip, GetPip } from "./PiplineReducer/piplineSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;

const AddPipeLine = ({ onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(userData);

  const navigate = useNavigate();

  // Submit handler
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    dispatch(AddPip(values));
    dispatch(GetPip());
    dispatch(GetPip());
    resetForm();
    onClose();
    // message.success("Pipeline added successfully!");
    onClose(); // Close modal after submission
    setSubmitting(false); // Reset submitting state
  };

  const initialValues = {
    pipeline_name: "",
  };

  // Validation Schema
  const validationSchema = Yup.object({
    pipeline_name: Yup.string().required("Please enter pipeline name."),
  });

  return (
    <div>
      {/* <h2 className="mb-1 border-b font-medium">Add Pipeline</h2> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit, isSubmitting, resetForm }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24} className="">
              <h2 className="mb-3 border-b pb-1 font-medium"></h2>
                <div className="form-item">
                  <label className="font-semibold">Pipeline Name <span className="text-rose-500">*</span></label>
                  <Field
                    name="pipeline_name"
                    as={Input}
                    className="w-full mt-1"
                    placeholder="Enter Pipeline Name"
                  />
                  <ErrorMessage
                    name="pipeline_name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-3">
              <Button type="default" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPipeLine;

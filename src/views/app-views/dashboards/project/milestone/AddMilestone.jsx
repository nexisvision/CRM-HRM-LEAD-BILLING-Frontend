import React from "react";
import {
  Card,
  Row,
  Col,
  Input,
  message,
  Button,
  Select,
  DatePicker,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AddMins, Getmins } from "./minestoneReducer/minestoneSlice";

const { Option } = Select;

const AddMilestone = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddMins({ id, values }))
      .then(() => {
        dispatch(Getmins());
        message.success("Milestone added successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add Leads.");
        console.error("Add API error:", error);
      });
  };

  const initialValues = {
    milestone_title: "",
    milestone_cost: "",
    milestone_status: "",
    add_cost_to_project_budget: "",
    milestone_summary: "",
    milestone_start_date: null,
    milestone_end_date: null,
  };

  const validationSchema = Yup.object({
    milestone_title: Yup.string().required("Please enter milestone title."),
    milestone_cost: Yup.string().required("Please enter milestone cost."),
    milestone_status: Yup.string().required("Please select status."),
    add_cost_to_project_budget: Yup.string().required(
      "Please select add cost to project budget."
    ),
    milestone_summary: Yup.string().required("Please enter milestone summary."),
    milestone_start_date: Yup.date()
      .nullable()
      .required("Start Date is required."),
    milestone_end_date: Yup.date().nullable().required("End Date is required."),
  });

  return (
    <div>
      <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h2 className="border-b pb-[30px] font-medium">Add Milestone</h2>
        <div className="p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, setFieldTouched, resetForm }) => (
              <Form className="formik-form">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Milestone Title
                      </label>
                      <Field
                        name="milestone_title"
                        as={Input}
                        placeholder="Enter Milestone Title"
                        className="rounded-e-lg rounded-s-none"
                      />
                      <ErrorMessage
                        name="milestone_title"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Milestone Cost
                      </label>
                      <Field
                        name="milestone_cost"
                        as={Input}
                        placeholder="Enter Milestone Cost"
                        className="rounded-e-lg rounded-s-none"
                      />
                      <ErrorMessage
                        name="milestone_cost"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold mb-2">Status</label>
                      <Select
                        value={values.milestone_status}
                        onChange={(value) =>
                          setFieldValue("milestone_status", value)
                        }
                        onBlur={() => setFieldTouched("milestone_status", true)}
                        className="w-full"
                        placeholder="Select Status"
                      >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                      <ErrorMessage
                        name="milestone_status"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold mb-2">
                        Add Cost To Project Budget
                      </label>
                      <Select
                        value={values.add_cost_to_project_budget}
                        onChange={(value) =>
                          setFieldValue("add_cost_to_project_budget", value)
                        }
                        onBlur={() =>
                          setFieldTouched("add_cost_to_project_budget", true)
                        }
                        className="w-full"
                        placeholder="Select Option"
                      >
                        <Option value="no">No</Option>
                        <Option value="yes">Yes</Option>
                      </Select>
                      <ErrorMessage
                        name="add_cost_to_project_budget"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Milestone Summary</label>
                      <ReactQuill
                        value={values.milestone_summary}
                        onChange={(value) =>
                          setFieldValue("milestone_summary", value)
                        }
                        placeholder="Enter Milestone Summary"
                      />
                      <ErrorMessage
                        name="milestone_summary"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold mb-2">Start Date</label>
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.milestone_start_date}
                        onChange={(date) =>
                          setFieldValue("milestone_start_date", date)
                        }
                        onBlur={() =>
                          setFieldTouched("milestone_start_date", true)
                        }
                      />
                      <ErrorMessage
                        name="milestone_start_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold mb-2">End Date</label>
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.milestone_end_date}
                        onChange={(date) =>
                          setFieldValue("milestone_end_date", date)
                        }
                        onBlur={() =>
                          setFieldTouched("milestone_end_date", true)
                        }
                      />
                      <ErrorMessage
                        name="milestone_end_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="form-buttons text-right py-2">
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
  );
};

export default AddMilestone;

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetPlan } from "../plan/PlanReducers/PlanSlice";
import { addassignplan } from "./CompanyReducers/CompanySlice";
import moment from "moment"; // Import moment.js for date formatting

const { Option } = Select;

const AddUpgradePlan = ({ comnyid, onClose }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const allplandata = useSelector((state) => state.Plan);
  const fnsfdtaf = allplandata.Plan.data;

  // Fetch plan data when component is mounted
  useEffect(() => {
    dispatch(GetPlan());
  }, [dispatch]);

  const initialValues = {
    plan_id: null,
    start_date: "",
    end_date: "",
    status: "",
    payment_status: "",
  };

  const validationSchema = Yup.object({
    plan_id: Yup.string().required("Please select Plan."),
    start_date: Yup.string().required("Please Enter Startdate."),
    end_date: Yup.string().required("Please Enter Enddate."),
    status: Yup.string().required("Please select Status."),
    payment_status: Yup.string().required("Please select Payment."),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Convert the date values to strings in YYYY-MM-DD format using moment
      const payload = {
        ...values, // Include all form data
        start_date: moment(values.start_date).format("YYYY-MM-DD"),
        end_date: moment(values.end_date).format("YYYY-MM-DD"),
        client_id: comnyid, // Add client_id
      };

      // Dispatch the action with the full payload
      dispatch(addassignplan(payload)).then(() => {
        message.success("Upgrade plan created successfully!");
        onClose();
      });
    } catch (error) {
      message.error("Failed to create upgrade plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <div className="p-2">
                <Row gutter={16}>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="">Plan</label>
                      <Field name="plan_id">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className="w-full mt-2"
                            placeholder="Select Plan"
                            loading={!fnsfdtaf}
                            onChange={(value) =>
                              form.setFieldValue("plan_id", value)
                            }
                            value={values.plan_id}
                          >
                            {fnsfdtaf && fnsfdtaf.length > 0 ? (
                              fnsfdtaf.map((client) => (
                                <Option key={client.id} value={client.id}>
                                  {client.name || "Unnamed requestor"}
                                </Option>
                              ))
                            ) : (
                              <Option value="" disabled>
                                No Plan available
                              </Option>
                            )}
                          </Select>
                        )}
                      </Field>
                    </div>
                  </Col>

                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="">Start Date</label>
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.start_date}
                        onChange={(date) => setFieldValue("start_date", date)}
                      />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">End Date</label>
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.endDate}
                        onChange={(date) => setFieldValue("end_date", date)}
                        onBlur={() => setFieldTouched("end_date", true)}
                      />
                      <ErrorMessage
                        name="end_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Status"
                      validateStatus={values.status ? "" : "error"}
                      help={values.status ? "" : "Please select Status"}
                    >
                      <Select
                        name="status"
                        onChange={(value) =>
                          handleChange({
                            target: { name: "status", value },
                          })
                        }
                        onBlur={handleBlur}
                        value={values.status}
                        placeholder="Select status"
                      >
                        <Option value="active">Active</Option>
                        <Option value="trial">Trial</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Payment Status"
                      validateStatus={values.payment_status ? "" : "error"}
                      help={
                        values.payment_status
                          ? ""
                          : "Please select Payment Status"
                      }
                    >
                      <Select
                        name="payment_status"
                        onChange={(value) =>
                          handleChange({
                            target: { name: "payment_status", value },
                          })
                        }
                        onBlur={handleBlur}
                        value={values.payment_status}
                        placeholder="Select Payment Status"
                      >
                        <Option value="paid">Paid</Option>
                        <Option value="unpaid">Unpaid</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <Form.Item className="mt-3">
                <Row justify="end" gutter={16}>
                  <Col>
                    <Button onClick={onClose}>Cancel</Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Create
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUpgradePlan;

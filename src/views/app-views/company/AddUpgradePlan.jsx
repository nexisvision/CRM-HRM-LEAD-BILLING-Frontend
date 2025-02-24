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
  const fnsfdtaf = allplandata.Plan;

  console.log(fnsfdtaf, "fnsfdtaf");

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
              <div className="border-t border-gray-200 my-6 "></div>
              <div className="p-2">
                <Row gutter={16}>
                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold">Plan <span className="text-red-500">*</span></label>
                      {/* <Field name="plan_id">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
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
                      </Field> */}





                      <Field name="plan_id">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Plan"
                            loading={!fnsfdtaf}
                            onChange={(value) => {
                              const selectedPlan = fnsfdtaf.find(plan => plan.id === value);
                              if (selectedPlan) {
                                const startDate = moment(); // Today’s date
                                let endDate = moment(startDate); // Clone start date

                                // Extract duration value and unit (e.g., "3 Years" -> 3, "2 Months" -> 2)
                                const durationMatch = selectedPlan.duration.match(/^(\d+)\s*(Month|Year)s?$/i);
                                if (durationMatch) {
                                  const durationValue = parseInt(durationMatch[1], 10);
                                  const durationUnit = durationMatch[2].toLowerCase(); // 'month' or 'year'

                                  if (durationUnit === "month") {
                                    endDate.add(durationValue, "months");
                                  } else if (durationUnit === "year") {
                                    endDate.add(durationValue, "years");
                                  }
                                }

                                // Set values for start_date and end_date
                                form.setFieldValue("plan_id", value);
                                form.setFieldValue("start_date", startDate.format("YYYY-MM-DD"));
                                form.setFieldValue("end_date", endDate.format("YYYY-MM-DD"));
                              }
                            }}
                            value={values.plan_id}
                          >
                            {fnsfdtaf && fnsfdtaf.length > 0 ? (
                              fnsfdtaf.map((plan) => (
                                <Option key={plan.id} value={plan.id}>
                                  {plan.name}
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






                      {/* <Field name="plan_id">
  {({ field, form }) => (
    <Select
      {...field}
      className="w-full mt-1"
      placeholder="Select Plan"
      loading={!fnsfdtaf}
      onChange={(value) => {
        const selectedPlan = fnsfdtaf.find(plan => plan.id === value);
        if (selectedPlan) {
          const startDate = moment(); // Today’s date
          let endDate = moment(startDate); // Clone start date

          // Calculate end date based on duration
          if (selectedPlan.duration.toLowerCase().includes("month")) {
            endDate.add(1, 'months');
          } else if (selectedPlan.duration.toLowerCase().includes("year")) {
            endDate.add(1, 'years');
          }

          // Set values for start_date and end_date
          form.setFieldValue("plan_id", value);
          form.setFieldValue("start_date", startDate.format("YYYY-MM-DD"));
          form.setFieldValue("end_date", endDate.format("YYYY-MM-DD"));
        }
      }}
      value={values.plan_id}
    >
      {fnsfdtaf && fnsfdtaf.length > 0 ? (
        fnsfdtaf.map((plan) => (
          <Option key={plan.id} value={plan.id}>
            {plan.name}
          </Option>
        ))
      ) : (
        <Option value="" disabled>
          No Plan available
        </Option>
      )}
    </Select>
  )}
</Field> */}
                    </div>
                  </Col>

                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                      {/* <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        value={values.start_date}
                        onChange={(date) => setFieldValue("start_date", date)}
                      /> */}
                      <DatePicker
                        className="w-full mt-1"
                        format="DD-MM-YYYY"
                        value={values.start_date ? moment(values.start_date) : null}
                        disabled
                      />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">End Date <span className="text-red-500">*</span> </label>
                      {/* <DatePicker
                        className="w-full mt-2"
                        format="DD-MM-YYYY"
                        value={values.endDate}
                        onChange={(date) => setFieldValue("end_date", date)}
                        onBlur={() => setFieldTouched("end_date", true)}
                      /> */}

                      <DatePicker
                        className="w-full mt-2"
                        format="DD-MM-YYYY"
                        value={values.end_date ? moment(values.end_date) : null}
                        disabled
                      />
                      <ErrorMessage
                        name="end_date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="mt-3">
                    <Form.Item

                      className="font-semibold mt-2"
                    >
                      <label className="font-semibold ">Status <span className="text-red-500">*</span></label>
                      <Select

                        onChange={(value) =>
                          handleChange({
                            target: { name: "status", value },
                          })
                        }
                        onBlur={handleBlur}
                        value={values.status}
                        // className="mt-1"
                        placeholder="Select status"
                      >
                        <Option value="active">Active</Option>
                        <Option value="trial">Trial</Option>
                      </Select>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} className="">
                    <Form.Item

                      className=" font-semibold mt-2"
                    >
                      <label className="font-semibold">Payment Status <span className="text-red-500">*</span></label>
                      <Select

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
                      <ErrorMessage
                        name="payment_status"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
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

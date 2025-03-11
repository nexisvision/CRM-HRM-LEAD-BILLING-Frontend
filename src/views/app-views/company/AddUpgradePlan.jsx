import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Select,
  Button,
} from "antd";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetPlan } from "../plan/PlanReducers/PlanSlice";
import { addassignplan } from "./CompanyReducers/CompanySlice";
import moment from "moment";
import { getsubplandata } from "../subscribeduserplans/subplanReducer/subplanSlice";

const { Option } = Select;

const AddUpgradePlan = ({ comnyid, onClose }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const allplandata = useSelector((state) => state.Plan);
  const fnsfdtaf = allplandata.Plan;

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

  const calculateEndDate = (startDate, duration) => {
    if (duration.toLowerCase() === 'lifetime') {
      return moment(startDate).add(100, 'years');
    }

    let endDate = moment(startDate);

    const durationMatch = duration.match(/^(\d+)\s*(Month|Year)s?$/i);

    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2].toLowerCase();

      switch (unit) {
        case 'month':
          endDate = endDate.add(value, 'months');
          break;
        case 'year':
          endDate = endDate.add(value, 'years');
          break;
        default:
        // console.error('Unsupported duration unit:', unit);
      }
    } else {
    }

    return endDate;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);


      // Convert the date values to strings in YYYY-MM-DD format using moment
      const payload = {
        ...values,
        start_date: moment(values.start_date).format("YYYY-MM-DD"),
        end_date: moment(values.end_date).format("YYYY-MM-DD"),
        client_id: comnyid,
      };

      dispatch(addassignplan(payload)).then(() => {
        dispatch(getsubplandata());
        onClose();
      });
    } catch (error) {
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
                      <Field name="plan_id">
                        {({ field, form }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Plan"
                            loading={!fnsfdtaf}
                            onChange={(value) => {
                              const selectedPlan = fnsfdtaf.find(plan => plan.id === value);
                              form.setFieldValue("plan_id", value);

                              // If start date is selected, automatically calculate end date
                              if (selectedPlan && form.values.start_date) {
                                const startDate = moment(form.values.start_date);
                                const endDate = calculateEndDate(startDate, selectedPlan.duration);
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
                      <ErrorMessage
                        name="plan_id"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full mt-1 p-2 border rounded"
                        value={values.start_date || ''}
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue("start_date", date);

                          // If plan is selected, automatically calculate end date
                          if (date && values.plan_id) {
                            const selectedPlan = fnsfdtaf.find(plan => plan.id === values.plan_id);
                            if (selectedPlan) {
                              const endDate = calculateEndDate(date, selectedPlan.duration);
                              setFieldValue("end_date", endDate.format("YYYY-MM-DD"));
                            }
                          }
                        }}
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
                      <label className="font-semibold">End Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full mt-2 p-2 border rounded bg-gray-100"
                        value={values.end_date || ''}
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

import React from "react";
import { Formik, Form as FormikForm } from "formik";
import {
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  message,
  Select,
} from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addsholidayss, getsholidayss } from "./AttendanceReducer/holidaySlice";
import moment from "moment-timezone";

const { Option } = Select;

const AddHoliday = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

  const validationSchema = Yup.object().shape({
    holiday_name: Yup.string().required("Holiday name is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.date()
      .required("End Date is required")
      .min(Yup.ref('start_date'), "End date must be after start date"),
    leave_type: Yup.string().required("Leave type is required"),
  });

  const handleSubmit = (values, { resetForm, setFieldValue }) => {
    if (!values.start_date || !values.end_date) {
      message.error("Please select both start and end dates");
      return;
    }

    const startDate = moment(values.start_date).format("YYYY-MM-DD");
    const endDate = moment(values.end_date).format("YYYY-MM-DD");

    if (!startDate || !endDate) {
      message.error("Invalid date format");
      return;
    }

    const formattedValues = {
      holiday_name: values.holiday_name.trim(),
      start_date: startDate,
      end_date: endDate,
      leave_type: values.leave_type,
      created_by: user
    };

    if (moment(endDate).isBefore(startDate)) {
      message.error("End date cannot be before start date");
      return;
    }

    dispatch(addsholidayss(formattedValues))
      .then(() => {
        dispatch(getsholidayss());
        message.success("Holiday added successfully!");
        resetForm();
        setFieldValue("start_date", null);
        setFieldValue("end_date", null);
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add holiday.");
        console.error("Add API error:", error);
      });
  };

  return (
    <div className="add-holiday-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={{
          holiday_name: "",
          start_date: null,
          end_date: null,
          leave_type: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Holiday Name <span className="text-red-500">*</span></label>
                  <Input
                    name="holiday_name"
                    placeholder="Enter holiday name"
                    className="w-full mt-1"
                    value={values.holiday_name}
                    onChange={(e) => setFieldValue("holiday_name", e.target.value)}
                  />
                  {errors.holiday_name && touched.holiday_name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.holiday_name}
                    </div>
                  )}
                </div>
              </Col>

              <Col span={24}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Leave Type <span className="text-red-500">*</span></label>
                  <Select
                    name="leave_type"
                    placeholder="Select leave type"
                    className="w-full mt-1"
                    value={values.leave_type}
                    onChange={(value) => setFieldValue("leave_type", value)}
                  >
                    <Option value="paid">Paid</Option>
                    <Option value="unpaid">Unpaid</Option>
                  </Select>
                  {errors.leave_type && touched.leave_type && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.leave_type}
                    </div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    style={{ width: "100%" }}
                    className="w-full mt-1" 
                    placeholder="Select start date"
                    value={values.start_date || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      setFieldValue("start_date", date);
                      if (values.end_date && date && new Date(date) > new Date(values.end_date)) {
                        setFieldValue("end_date", null);
                      }
                    }}
                  />
                  {errors.start_date && touched.start_date && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.start_date}
                    </div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">End Date <span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select end date"
                    value={values.end_date || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      setFieldValue("end_date", date);
                    }}
                    min={values.start_date} // Disable dates before start date
                  />
                  {errors.end_date && touched.end_date && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.end_date}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right">
              <Button type="primary" htmlType="submit">
                Add Holiday
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddHoliday;

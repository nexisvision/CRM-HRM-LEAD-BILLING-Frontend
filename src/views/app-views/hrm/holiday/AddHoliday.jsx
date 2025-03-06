import React from "react";
import { Formik, Form as FormikForm } from "formik";
import {
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addsholidayss, getsholidayss } from "./AttendanceReducer/holidaySlice";
import moment from "moment-timezone";

const AddHoliday = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    holiday_name: Yup.string().required("Holiday name is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.date()
      .required("End Date is required")
      .min(Yup.ref('start_date'), "End date must be after start date"),
  });

  const handleSubmit = (values, { resetForm, setFieldValue }) => {
    // Check if dates are valid before formatting
    if (!values.start_date || !values.end_date) {
      message.error("Please select both start and end dates");
      return;
    }

    // Convert moment objects to proper date format
    const startDate = values.start_date ? moment(values.start_date._d || values.start_date).format("DD-MM-YYYY") : null;
    const endDate = values.end_date ? moment(values.end_date._d || values.end_date).format("DD-MM-YYYY") : null;

    if (!startDate || !endDate) {
      message.error("Invalid date format");
      return;
    }

    const formattedValues = {
      holiday_name: values.holiday_name.trim(),
      start_date: startDate,
      end_date: endDate,
      created_by: user
    };

    // Validate that end date is not before start date
    if (moment(formattedValues.end_date).isBefore(formattedValues.start_date)) {
      message.error("End date cannot be before start date");
      return;
    }

    console.log("Sending payload:", formattedValues); // Debug log

    dispatch(addsholidayss(formattedValues))
      .then(() => {
        dispatch(getsholidayss());
        message.success("Holiday added successfully!");
        // Reset form and explicitly clear DatePicker values
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
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Formik
        initialValues={{
          holiday_name: "",
          start_date: null,
          end_date: null,
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

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select start date"
                    value={values.start_date}
                    onChange={(date) => {
                      setFieldValue("start_date", date);
                      // Reset end date when start date changes
                      if (values.end_date && date && date.isAfter(values.end_date)) {
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
                  <DatePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select end date"
                    value={values.end_date}
                    onChange={(date) => setFieldValue("end_date", date)}
                    disabledDate={(current) => {
                      // Can't select days before start date
                      return values.start_date ? current && current < values.start_date.startOf('day') : false;
                    }}
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

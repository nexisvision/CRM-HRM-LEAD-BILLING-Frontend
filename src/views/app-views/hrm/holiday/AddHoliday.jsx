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

  const validationSchema = Yup.object().shape({
    holiday_name: Yup.string().required("Holiday name is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.date()
      .required("End Date is required")
      .min(Yup.ref('start_date'), "End date must be after start date"),
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
                    value={values.start_date ? moment(values.start_date) : null}
                    format="YYYY-MM-DD"
                    onChange={(date) => {
                      setFieldValue("start_date", date ? date.format("YYYY-MM-DD") : null);
                      if (values.end_date && date && moment(date).isAfter(values.end_date)) {
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
                    format="YYYY-MM-DD"
                    value={values.end_date ? moment(values.end_date) : null}
                    onChange={(date) => setFieldValue("end_date", date ? date.format("YYYY-MM-DD") : null)}
                    disabledDate={(current) => {
                      return values.start_date ? current && current.isBefore(moment(values.start_date), 'day') : false;
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

import React, { useEffect, useState } from "react";
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
import { editsholidayss, getsholidayss } from "./AttendanceReducer/holidaySlice";
import moment from "moment-timezone";

const { Option } = Select;

const EditHoliday = ({ onClose, idd }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    holiday_name: "",
    start_date: null,
    end_date: null,
    leave_type: "",
  });
  const enableReinitialize = true;

  useEffect(() => {
    dispatch(getsholidayss());
  }, [dispatch]);

  const allholidaudata = useSelector((state) => state.holidays.holidays.data);

  useEffect(() => {
    if (allholidaudata && idd) {
      const filterdata = allholidaudata.find((item) => item.id === idd);
      console.log("filterdata", filterdata);
      if (filterdata) {
        setInitialValues({
          holiday_name: filterdata.holiday_name,
          start_date: moment(filterdata.start_date),
          end_date: moment(filterdata.end_date),
          leave_type: filterdata.leave_type || '',
        });
      }
    }
  }, [allholidaudata, idd]);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    holiday_name: Yup.string().required("Holiday name is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.date()
      .required("End Date is required")
      .min(Yup.ref('start_date'), "End date must be after start date"),
    leave_type: Yup.string().required("Leave type is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const formattedValues = {
      ...values,
      start_date: moment(values.start_date).format("YYYY-MM-DD"),
      end_date: moment(values.end_date).format("YYYY-MM-DD"),
      leave_type: values.leave_type,
    };

    dispatch(editsholidayss({ idd, formattedValues }))
      .then(() => {
        dispatch(getsholidayss());
        message.success("Holiday updated successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update holiday.");
        console.error("Update API error:", error);
      });
  };

  return (
    <div className="add-holiday-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        initialValues={initialValues}
        enableReinitialize={enableReinitialize}
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
                  <DatePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select start date"
                    value={values.start_date}
                    onChange={(date) => {
                      setFieldValue("start_date", date);
                      if (values.end_date && date && moment(values.end_date).isBefore(date)) {
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
              <Button 
                onClick={onClose} 
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Holiday
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>

      <style jsx="true">{`
        .ant-select-selector {
          border-radius: 6px !important;
        }
        .ant-select:hover .ant-select-selector {
          border-color: #40a9ff !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default EditHoliday;

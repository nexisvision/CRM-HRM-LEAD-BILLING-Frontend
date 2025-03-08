import React, { useEffect, useState } from "react";
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
import { editsholidayss, getsholidayss } from "./AttendanceReducer/holidaySlice";
import moment from "moment-timezone";

const EditHoliday = ({ onClose, idd }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);
  const [initialValues, setInitialValues] = useState({
    holiday_name: "",
    start_date: null,
    end_date: null,
  });
  const [enableReinitialize, setEnableReinitialize] = useState(true);

  useEffect(() => {
    dispatch(getsholidayss());
  }, [dispatch]);

  const allholidaudata = useSelector((state) => state.holidays.holidays.data);

  useEffect(() => {
    if (allholidaudata && idd) {
      const filterdata = allholidaudata.find((item) => item.id === idd);
      if (filterdata) {
        setInitialValues({
          holiday_name: filterdata.holiday_name,
          start_date: moment(filterdata.start_date),
          end_date: moment(filterdata.end_date),
        });
      }
    }
  }, [allholidaudata, idd]);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    holiday_name: Yup.string().required("Holiday name is required"),
    start_date: Yup.date().required("Start Date is required"),
    end_date: Yup.date().required("End Date is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const formattedValues = {
      ...values,
      start_date: moment(values.start_date).format("YYYY-MM-DD"),
      end_date: moment(values.end_date).format("YYYY-MM-DD"),
    };

    dispatch(editsholidayss({idd,formattedValues}))
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
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>

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

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select start date"
                    value={values.start_date}
                    onChange={(date) => setFieldValue("start_date", date)}
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
                    onChange={(date) => setFieldValue(
                        "end_date", date)}
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
                Update Holiday
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default EditHoliday;

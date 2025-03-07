import React, { useEffect } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import {
  Select,
  DatePicker,
  TimePicker,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addAttendance,
  getAttendances,
} from "./AttendanceReducer/AttendanceSlice";
import moment from "moment-timezone";
// import moment from "moment";


const { Option } = Select;

const AddAttendance = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const user = useSelector((state) => state.user.loggedInUser.username);

  const employeeDataa = useSelector(
    (state) => state.employee?.employee?.data || []
  );

  const employeeData = employeeDataa.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    employee: Yup.string().required("Employee is required"),
    date: Yup.date().required("Start Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    late: Yup.string().required("Late field is required"),
    halfDay: Yup.string().required("Half Day selection is required"),
    comment: Yup.string().optional(),
  });
  const handleSubmit = (values, { resetForm }) => {
    if (values.halfDay === "yes") {
      values.halfDay = true;
    } else {
      values.halfDay = false;
    }

    const formattedValues = {
      ...values,
      startTime: values.startTime.format("HH:mm:ss"),
      endTime: values.endTime.format("HH:mm:ss"),
      halfDay: values.halfDay === "yes",
    };



    dispatch(addAttendance(formattedValues))


    .then(() => {

        dispatch(getAttendances());
        message.success("Attendance added successfully!");
        onClose();
        resetForm();
      })
      .catch((error) => {
        message.error("Failed to add attendance.");
        console.error("Add API error:", error);
      });
  };

  return (
    <div className="add-attendance-form">
 <h2 className="mb-3 border-b pb-1 font-medium"></h2>

      <Formik
        initialValues={{
          employee: "",
          date: "",
          startTime: "",
          endTime: "",
          late: "",
          halfDay: "",
          comment: "",
        }}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Employee <span className="text-red-500">*</span></label>
                  <Field
                    as={Select}
                    name="employee"
                    placeholder="Select employee"
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    onChange={(value) => setFieldValue("employee", value)}
                  >
                    {employeeData.map((emp) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.username}
                      </Option>
                    ))}
                  </Field>
                  {errors.employee && touched.employee && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.employee}
                    </div>
                  )}
                </div>
              </Col>

              {/* Start Date and Start Time */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Start Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select date"
                    onChange={(date) => setFieldValue("date", date)}
                  />
                  {errors.date && touched.date && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.date}
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Start Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    style={{ width: "100%" }}
                    placeholder="Select time"
                    className="w-full mt-1"
                    defaultValue={moment("09:00", "HH:mm")}
                    onChange={(time) => {
                      setFieldValue("startTime", time);
                      setFieldValue("endTime", null);
                    }}
                  />
                  {errors.startTime && touched.startTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.startTime}
                    </div>
                  )}
                </div>
              </Col>

              {/* End Time */}
              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">End Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    style={{ width: "100%" }}
                    placeholder="Select time"
                    className="w-full mt-1"
                    defaultValue={moment("18:00", "HH:mm")}
                    onChange={(time) => setFieldValue("endTime", time)}
                    disabledTime={() => {
                      const startTime = values.startTime;
                      if (!startTime) return {};
                      
                      return {
                        disabledHours: () => {
                          const hours = [];
                          for (let i = 0; i < startTime.hour(); i++) {
                            hours.push(i);
                          }
                          return hours;
                        },
                        disabledMinutes: (selectedHour) => {
                          const minutes = [];
                          if (selectedHour === startTime.hour()) {
                            for (let i = 0; i < startTime.minute(); i++) {
                              minutes.push(i);
                            }
                          }
                          return minutes;
                        }
                      };
                    }}
                  />
                  {errors.endTime && touched.endTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.endTime}
                    </div>
                  )}
                </div>
              </Col>

              {/* Late Field */}
              {/* <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Late <span className="text-red-500">*</span></label>
                  <Field
                    as={Input}
                    name="late"
                    placeholder="Enter Late Time"
                    className="w-full mt-1"
                    onChange={(e) => setFieldValue("late", e.target.value)}
                  />
                  {errors.late && touched.late && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.late}
                    </div>
                  )}
                </div>
              </Col>

              {/* Half Day Dropdown */}
              {/* <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Half Day <span className="text-red-500">*</span></label>
                  <Field
                    as={Select}
                    name="halfDay"
                    placeholder="Select Yes or No"
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    onChange={(value) => setFieldValue("halfDay", value)}
                  >
                    <Option value="yes">Yes</Option>
                    <Option value="no">No</Option>
                  </Field>
                  {errors.halfDay && touched.halfDay && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.halfDay}
                    </div>
                  )}
                </div>
              </Col> */}

              {/* Comment Field */}
              <Col span={24}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Comment <span className="text-red-500">*</span>  </label>
                  <Field
                    as={Input.TextArea}
                    name="comment"
                    placeholder="Add a comment (optional)"
                    rows={3}
                    className="w-full mt-1"
                    onChange={(e) => setFieldValue("comment", e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="text-right">
              <Button type="primary" htmlType="submit">
                Add Attendance
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddAttendance;

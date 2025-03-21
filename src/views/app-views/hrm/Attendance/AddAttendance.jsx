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
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addAttendance,
  getAttendances,
} from "./AttendanceReducer/AttendanceSlice";
import moment from "moment-timezone";


const { Option } = Select;

const AddAttendance = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

  const employeeDataa = useSelector(
    (state) => state.employee?.employee?.data || []
  );

  const employeeData = employeeDataa.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    employee: Yup.string()
      .required("Employee selection is required")
      .test('valid-employee', 'Please select a valid employee', value => 
        employeeData.some(emp => emp.id.toString() === value.toString())),
    
    date: Yup.date()
      .required("Date is required")
      
      .test('is-weekend', 'Cannot mark attendance for weekends', 
        value => value ? moment(value).day() !== 0 : true)
      .typeError("Please enter a valid date"),
    
    startTime: Yup.string()
      .required("Start time is required"),
      
    
    endTime: Yup.string()
      .required("End time is required"),
    
      
    
   
    comment: Yup.string()
      .trim()
      .min(3, "Comment must be at least 3 characters")
      .max(500, "Comment cannot exceed 500 characters")
      .test('required-if-late', 'Comment is required when marked as late', function(value) {
        const { late } = this.parent;
        if (late === 'yes' && (!value || value.length < 3)) {
          return false;
        }
        return true;
      }),
  });

  const handleSubmit = (values, { resetForm }) => {
    try {
      // Log raw values before formatting
    

      // Convert values to proper format
    const formattedValues = {
      ...values,
      startTime: values.startTime.format("HH:mm:ss"),
      endTime: values.endTime.format("HH:mm:ss"),
      halfDay: values.halfDay === "yes",
        // Use the date directly as it's already in YYYY-MM-DD format
        date: values.date,
        created_by: user
      };

      // Log the final payload with date verification
     

      // Validate date
      if (!formattedValues.date) {
        message.error("Please select a valid date");
        return;
      }

      // Validate working hours
      const startTime = moment(formattedValues.startTime, "HH:mm:ss");
      const endTime = moment(formattedValues.endTime, "HH:mm:ss");
      const hoursWorked = endTime.diff(startTime, 'hours', true);

      if (hoursWorked < 4) {
        message.error("Working hours must be at least 4 hours");
        return;
      }

    dispatch(addAttendance(formattedValues))
    .then(() => {

        dispatch(getAttendances());
        message.success("Attendance added successfully!");
        onClose();
        resetForm();
      })
      .catch((error) => {
          console.error("Add attendance error:", error);
        message.error("Failed to add attendance.");
        });
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("An error occurred while processing the form.");
    }
  };

  // Update initial values to handle date properly
  const initialValues = {
    employee: "",
    date: "",
    startTime: "",
    endTime: "",
    late: "",
    halfDay: "",
    comment: "",
  };

  return (
    <div className="add-attendance-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>

      <Formik
        
        // validationSchema={validationSchema}
        initialValues={initialValues}
        validationSchema={validationSchema}
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

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">Date <span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    placeholder="Select date"
                    value={values.date || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      console.log("Selected Date:", date);
                      setFieldValue("date", date);
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    onKeyDown={(e) => e.preventDefault()}
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
                    className="w-full mt-1"
                    format="HH:mm"
                    placeholder="Select start time"
                    minuteStep={5}
                    showNow={false}
                    allowClear={false}
                    onChange={(time) => {
                      console.log("Selected Start Time:", time ? time.format('HH:mm:ss') : null);
                      setFieldValue("startTime", time);
                    }}
                    hideDisabledOptions
                    disabledHours={() => {
                      const hours = [];
                      for (let i = 0; i < 24; i++) {
                        if (i < 7 || i > 11) hours.push(i);
                      }
                      return hours;
                    }}
                  />
                  {errors.startTime && touched.startTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.startTime}
                    </div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="font-semibold">End Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    style={{ width: "100%" }}
                    className="w-full mt-1"
                    format="HH:mm"
                    placeholder="Select end time"
                    minuteStep={5}
                    showNow={false}
                    allowClear={false}
                    onChange={(time) => {
                      console.log("Selected End Time:", time ? time.format('HH:mm:ss') : null);
                      setFieldValue("endTime", time);
                    }}
                    hideDisabledOptions
                    disabledHours={() => {
                          const hours = [];
                      for (let i = 0; i < 24; i++) {
                        if (i < 16 || i > 20) hours.push(i);
                          }
                          return hours;
                    }}
                    disabledMinutes={(selectedHour) => {
                      // If start time is selected, disable minutes before it
                      if (values.startTime && selectedHour === values.startTime.hour()) {
                          const minutes = [];
                        for (let i = 0; i < values.startTime.minute(); i++) {
                              minutes.push(i);
                          }
                          return minutes;
                        }
                      return [];
                    }}
                  />
                  {errors.endTime && touched.endTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.endTime}
                    </div>
                  )}
                </div>
              </Col>

              {/* Late and Half Day Selection */}
              

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

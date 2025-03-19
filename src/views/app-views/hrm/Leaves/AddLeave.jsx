import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
} from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { CreateL, GetLeave } from "./LeaveReducer/LeaveSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  employeeId: Yup.string().required("Employee is required"),
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref('startDate'), "End date must be after start date"),
  reason: Yup.string().required("Leave reason is required"),
  remark: Yup.string().optional("Remark is required"),
});

const AddLeave = ({ onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
    dispatch(GetLeave());
  }, [dispatch]);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];


  const filteredEmpData = empData?.filter((item) => item.created_by === user);
  // Extract employee data
  const initialValues = {
    employeeId: "",
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: "",
    remark: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(CreateL(values)).unwrap();
      dispatch(GetLeave());
      resetForm();
      onClose();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
     <div className="mb-2 border-b pb-[-10px] font-medium"></div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="space-y-2">
                  <label
                    htmlFor="employeeId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <Field name="employeeId">
                    {({ field }) => (
                      <Select
                        {...field}
                        id="employeeId"
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Select Employee"
                        onChange={(value) => setFieldValue("employeeId", value)}
                      >
                        {filteredEmpData.map((emp) => (
                          <Option key={emp.id} value={emp.id}>
                            {emp.username || "Unnamed Employee"}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="employeeId"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="space-y-2">
                  <label
                    htmlFor="leaveType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <Field name="leaveType">
                    {({ field }) => (
                      <Select
                        {...field}
                        id="leaveType"
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Select Leave Type"
                        onChange={(value) => setFieldValue("leaveType", value)}
                      >
                        <Option value="sick">Sick Leave</Option>
                        <Option value="casual">Casual Leave</Option>
                        <Option value="annual">Annual Leave</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="leaveType"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Field name="startDate">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="startDate"
                        type="date"
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue("startDate", date);
                          if (values.endDate && date && new Date(values.endDate) < new Date(date)) {
                            setFieldValue("endDate", null);
                          }
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Field name="endDate">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="endDate"
                        type="date"
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue("endDate", date);
                        }}
                        min={values.startDate} // Disable dates before start date
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="space-y-2">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Leave Reason <span className="text-red-500">*</span>
                  </label>
                  <Field name="reason">
                    {({ field }) => (
                      <TextArea
                        {...field}
                        id="reason"
                        rows={4}
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter leave reason"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="space-y-2">
                  <label
                    htmlFor="remark"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Remark <span className="text-red-500">*</span>
                  </label>
                  <Field name="remark">
                    {({ field }) => (
                      <TextArea
                        {...field}
                        id="remark"
                        rows={4}
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter remark"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="remark"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Submit Leave Request
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddLeave;

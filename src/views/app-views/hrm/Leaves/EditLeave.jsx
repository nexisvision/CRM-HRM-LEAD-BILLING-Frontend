import React, { useEffect } from "react";
import moment from "moment";
import { Button, DatePicker, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { EditLeave as EditLeaveAction, GetLeave } from "./LeaveReducer/LeaveSlice";

const { Option } = Select;

const LeaveSchema = Yup.object().shape({
  employeeId: Yup.string().required("Employee is required"),
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  reason: Yup.string().required("Reason is required"),
  remark: Yup.string().required("Remark is required"),
});

const EditLeave = ({ editid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);
  const leaveData = useSelector((state) => state.Leave);
  const empData = useSelector((state) => state.employee || []);
  const employeedata = empData.employee.data;
  const filteredEmpData = employeedata?.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(GetLeave());
  }, [dispatch]);

  const initialValues = {
    employeeId: "",
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: "",
    remark: "",
  };

  const formikRef = React.useRef();

  useEffect(() => {
    if (editid && leaveData?.Leave?.data.length > 0 && filteredEmpData.length > 0) {
      const leave = leaveData.Leave.data.find((item) => item.id === editid);
      if (leave && formikRef.current) {
        const { setFieldValue } = formikRef.current;
        Object.entries({
          employeeId: leave.employeeId,
          leaveType: leave.leaveType,
          startDate: leave.startDate ? moment(leave.startDate) : null,
          endDate: leave.endDate ? moment(leave.endDate) : null,
          reason: leave.reason,
          remark: leave.remark,
        }).forEach(([field, value]) => setFieldValue(field, value));
      }
    }
  }, [editid, leaveData, filteredEmpData]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const id = editid;
      const formattedValues = {
        ...values,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
        endDate: moment(values.endDate).format('YYYY-MM-DD'),
      };

      await dispatch(EditLeaveAction({ id, values: formattedValues }));
      dispatch(GetLeave());
      onClose();
      navigate("/app/hrm/leave");
    } catch (error) {
      message.error("Failed to update leave: " + (error.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <hr className="border-b border-gray-200 mb-4"></hr>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={LeaveSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full"
                  placeholder="Select Employee"
                  onChange={(value) => setFieldValue("employeeId", value)}
                  value={values.employeeId}
                >
                  {filteredEmpData.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.username}
                    </Option>
                  ))}
                </Select>
                {errors.employeeId && touched.employeeId && (
                  <div className="text-red-500 text-sm mt-1">{errors.employeeId}</div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <Select
                  className="w-full"
                  placeholder="Select Leave Type"
                  onChange={(value) => setFieldValue("leaveType", value)}
                  value={values.leaveType}
                >
                  <Option value="sick">Sick Leave</Option>
                  <Option value="casual">Casual Leave</Option>
                  <Option value="annual">Annual Leave</Option>
                </Select>
                {errors.leaveType && touched.leaveType && (
                  <div className="text-red-500 text-sm mt-1">{errors.leaveType}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  className="w-full"
                  value={values.startDate}
                  onChange={(e) => setFieldValue("startDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && touched.startDate && (
                  <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  className="w-full"
                  value={values.endDate}
                  onChange={(e) => setFieldValue("endDate", e.target.value)}
                  min={values.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && touched.endDate && (
                  <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
                {errors.reason && touched.reason && (
                  <div className="text-red-500 text-sm mt-1">{errors.reason}</div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="remark"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
                {errors.remark && touched.remark && (
                  <div className="text-red-500 text-sm mt-1">{errors.remark}</div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="default"
                onClick={onClose}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="px-4 py-2"
              >
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditLeave;

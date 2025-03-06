import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddNote, GetNote } from "./NotesReducer/NotesSlice";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;

const AddNotes = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // const employeeData = useSelector((state) => 
  //   (state.employee?.employee?.data || []).filter((employee) => employee.employeeId)
  // );



  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const employeeData = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });


  // const user = useSelector((state) => state.user.loggedInUser.username);

  // const { data: employee } = useSelector((state) => state.employee.employee);

  // const employeeData = employee?.filter((item) => item.created_by === user) || [];

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetUsers());
  }, []);

  // const { data: employee } = useSelector((state) => state.employee.employee);

  // const filterdata = useSelector((state)=>state.employee.employee.data)

  // const loggeduesr = useSelector((state)=>state.user.loggedInUser.username)

  // const employee = filterdata.filter((item)=>item.created_by === loggeduesr)




  const initialValues = {
    note_title: "",
    notetype: "public",
    description: "",
    employees: {},
  };

  const validationSchema = Yup.object({
    note_title: Yup.string().required("Please enter Note Title."),
    notetype: Yup.string().required("Please select Note Type."),
    description: Yup.string().optional("Please enter Description."),
    // employees: Yup.string().required("Please select Employee."),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const employeeObject =
        values.employees.length > 0 ? { id: values.employees[0] } : null;

      values.employees = employeeObject;

      // console.log("Dispatching AddNote with values:", { id, values });
      // const result = await dispatch(AddNote({ id, values })).unwrap();
      // dispatch(GetNote(id));
      // onClose();
      // // console.log("Dispatch result:", result);

      // if (result) {
      //   // message.success("Note added successfully!");
      //   resetForm();

      // }

      dispatch(AddNote({ id, values }))
        .then(() => {
          // message.success("Note added successfully!");
          dispatch(GetNote(id))
          resetForm();
          onClose();
        })

    } catch (error) {
      console.error("Error adding note:", error);
      message.error("Failed to add note: " + error.message);
    }
  };

  return (
    <div className="add-expenses-form">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Note Title <span className="text-red-500">*</span></label>
                  <Field
                    name="note_title"
                    as={Input}
                    placeholder="Enter Note Title"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="note_title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>


              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Employee</label>
                  <div className="flex gap-2">
                    <Field name="employees">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Employee"
                          onChange={(value) => {
                            const selectedEmployee = employeeData.find((e) => e.id === value);
                            setFieldValue("employees", selectedEmployee ? [selectedEmployee.id] : []);
                          }}
                          onBlur={() => setFieldTouched("employees", true)}
                        >
                          {Array.isArray(employeeData) && employeeData.map((emp) => (
                            <Option key={emp.id} value={emp.id}>
                              {emp.username}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="employees"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    className="mt-1"
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Description"
                    onBlur={() => setFieldTouched("description", true)}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>
            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddNotes;

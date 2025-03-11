import React, { useEffect, useMemo, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditeNotes, GetNote } from "./NotesReducer/NotesSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;

const EditNotes = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const allempdataa = useSelector((state) => state.Users);
  const empData = allempdataa?.Users?.data || [];
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

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    note_title: "",
    notetype: "public",
    description: "",
    employees: null,
  });

  const validationSchema = Yup.object({
    note_title: Yup.string().required("Please enter Note Title."),
    notetype: Yup.string().required("Please select Note Type."),
    description: Yup.string().optional("Please enter Description."),
  });

  const allempdata = useSelector((state) => state.Notes);
  const Expensedata = useMemo(() => allempdata?.Notes?.data || [], [allempdata?.Notes?.data]);

  useEffect(() => {
    if (!Expensedata.length || !idd) {
      return;
    }

    const noteData = Expensedata.find((item) => item.id === idd);

    if (noteData) {
      setInitialValues({
        note_title: noteData.note_title || "",
        notetype: noteData.notetype || "public",
        description: noteData.description || "",
        employees: noteData.employees?.id || null,
      });
    } else {
      message.error("Note not found!");
      navigate("/apps/sales/expenses");
    }
  }, [idd, Expensedata, navigate]);

  const onSubmit = async (values, { resetForm }) => {
    try {
      const employeesObject = values.employees ? { id: values.employees } : null;

      const payload = {
        ...values,
        employees: employeesObject
      };
      const result = await dispatch(EditeNotes({ idd, values: payload })).unwrap();
      message.success("Note updated successfully!");
      dispatch(GetNote(id));
      onClose();

      if (result) {
        resetForm();
      }
    } catch (error) {
      console.error("Error updating note:", error);
      message.error("Failed to update note: " + error.message);
    }
  };

  return (
    <div className="add-expenses-form">
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        enableReinitialize={true}
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
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="note_title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold mb-2">Employee</label>
                  <div className="flex gap-2">
                    <Field name="employees">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Employee"
                          onChange={(value) => {
                            form.setFieldValue("employees", value);
                          }}
                        >
                          {Array.isArray(employeeData) &&
                            employeeData.map((emp) => (
                              <Option key={emp.id} value={emp.id}>
                                {emp.username}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="employees"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditNotes;

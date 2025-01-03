import React, { useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AddNote, GetNote } from "./NotesReducer/NotesSlice";

const { Option } = Select;

const AddNotes = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    note_title: "",
    notetype: "public",
    description: "",
    employees: {},
  };

  const validationSchema = Yup.object({
    note_title: Yup.string().required("Please enter Note Title."),
    notetype: Yup.string().required("Please select Note Type."),
    description: Yup.string().required("Please enter Description."),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const employeeObject =
        values.employees.length > 0 ? { id: values.employees[0] } : null;

      values.employees = employeeObject;

      console.log("Dispatching AddNote with values:", { id, values });
      const result = await dispatch(AddNote({ id, values })).unwrap();
      dispatch(GetNote(id));
      onClose();
      console.log("Dispatch result:", result);

      if (result) {
        message.success("Note added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error adding note:", error);
      message.error("Failed to add note: " + error.message);
    }
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
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
                  <label className="font-semibold">Note Title</label>
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

              <Col span={24}>
                <div className="mt-4">
                  <label className="font-semibold">Employees</label>
                  <Select
                    mode="multiple"
                    placeholder="Select Employees"
                    className="w-full mt-2"
                    onChange={(value) => setFieldValue("employees", value)}
                    value={values.employees}
                  >
                    <Option value="xyz">XYZ</Option>
                    <Option value="abc">ABC</Option>
                  </Select>
                  <ErrorMessage
                    name="employees"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-5">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
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

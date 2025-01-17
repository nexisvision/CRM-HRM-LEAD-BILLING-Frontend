// import React, { useEffect, useState } from "react";
// import {
//   Input,
//   Button,
//   DatePicker,
//   Select,
//   message,
//   Row,
//   Col,
//   Switch,
//   Upload,
//   Modal,
//   Checkbox,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// import { useNavigate, useParams } from "react-router-dom";

// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { EditeNotes } from "./NotesReducer/NotesSlice";
// import { useDispatch, useSelector } from "react-redux";

// const { Option } = Select;

// const EditNotes = ({ idd, onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
//   const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
//   const [showReceiptUpload, setShowReceiptUpload] = useState(false);
//   // const [uploadModalVisible, setUploadModalVisible] = useState(false);

//   const { id } = useParams();

//   const [initialValues, setInitialValues] = useState({
//     note_title: "",
//     notetype: "public",
//     description: "",
//     employees: {},
//   });

//   const validationSchema = Yup.object({
//     note_title: Yup.string().required("Please enter Note Title."),
//     notetype: Yup.string().required("Please select Note Type."),
//     description: Yup.string().required("Please enter Description."),
//   });
//   const onSubmit = (values, { resetForm }) => {
//     dispatch(EditeNotes({ id, values }));
//     console.log("Submitted values:", values);
//     message.success("Expenses added successfully!");
//     resetForm();
//     navigate("/app/dashboards/project/list");
//   };

//   const allempdata = useSelector((state) => state.Notes);
//   const Expensedata = allempdata?.Notes?.data || [];

//   useEffect(() => {
//     if (Expensedata.length > 0 && idd) {
//       const expdata = Expensedata.find((item) => item.id === idd);

//       console.log("eeee", expdata);

//       if (expdata) {
//         setInitialValues({
//           note_title: expdata.note_title || "",
//           notetype: expdata.notetype || "public", // Set the notetype as well
//           description: expdata.description || "",
//           employees: expdata.employees || [], // Assuming employees is an array
//         });
//       } else {
//         message.error("Expense not found!");
//         navigate("/apps/sales/expenses");
//       }
//     }
//   }, [idd, Expensedata, navigate]);

//   return (
//     <div className="add-expenses-form">
//       <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form className="formik-form" onSubmit={handleSubmit}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Note Title</label>
//                   <Field
//                     name="note_title"
//                     as={Input}
//                     placeholder="Enter Note Title"
//                     className="mt-2"
//                   />
//                   <ErrorMessage
//                     name="note_title"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={24}>
//                 <div className="mt-4">
//                   <label className="font-semibold">Employees</label>
//                   <Select
//                     mode="multiple"
//                     placeholder="Select Employees"
//                     className="w-full mt-2"
//                     onChange={(value) => setFieldValue("employees", value)}
//                     value={values.employees}
//                   >
//                     <Option value="xyz">XYZ</Option>
//                     <Option value="abc">ABC</Option>
//                   </Select>
//                   <ErrorMessage
//                     name="employees"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={24} className="mt-5">
//                 <div className="form-item">
//                   <label className="font-semibold">Description</label>
//                   <ReactQuill
//                     value={values.description}
//                     onChange={(value) => setFieldValue("description", value)}
//                     placeholder="Enter Description"
//                     onBlur={() => setFieldTouched("description", true)}
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//             </Row>
//             <div className="form-buttons text-right mt-4">
//               <Button type="default" className="mr-2" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default EditNotes;

import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditeNotes, GetNote } from "./NotesReducer/NotesSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const EditNotes = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState({
    note_title: "",
    notetype: "public",
    description: "",
    employees: {},
  });

  const validationSchema = Yup.object({
    note_title: Yup.string().required("Please enter Note Title."),
    notetype: Yup.string().required("Please select Note Type."),
    description: Yup.string().required("Please enter Description."),
  });

  const allempdata = useSelector((state) => state.Notes);
  const Expensedata = allempdata?.Notes?.data || [];

  useEffect(() => {
    // Only proceed if we have data and an ID to look for
    if (!Expensedata.length || !idd) {
      return;
    }

    // Find the note data
    const noteData = Expensedata.find((item) => item.id === idd);

    if (noteData) {
      // Update all form fields with existing data
      setInitialValues({
        note_title: noteData.note_title || "",
        notetype: noteData.notetype || "public",
        description: noteData.description || "",
        employees:
          typeof noteData.employees === "object" && noteData.employees !== null
            ? Object.values(noteData.employees)[0] // Extract only the value without id
            : {}, // Default empty object if not valid
      });
    } else {
      message.error("Note not found!");
      navigate("/apps/sales/expenses");
    }
  }, [idd, Expensedata, navigate]);

  const onSubmit = (values, { resetForm }) => {
    const employeeObject =
      values.employees.length > 0 ? { id: values.employees[0] } : null;

    values.employees = employeeObject;

    console.log("va", values);

    dispatch(EditeNotes({ idd, values }));
    onClose();
    dispatch(GetNote(id));
    console.log("Submitted values:", values);
    message.success("Note updated successfully!");
    resetForm();
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
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

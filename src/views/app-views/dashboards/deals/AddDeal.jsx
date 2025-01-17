import React, { useEffect } from "react";
import { Input, Button, Select, DatePicker, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddDeals, GetDeals } from "./DealReducers/DealSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

const { Option } = Select;

const AddDeal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tabledata = useSelector((state) => state?.SubClient);
  const clientdata = tabledata?.SubClient?.data;

  const initialValues = {
    dealName: "",
    phoneNumber: "",
    price: "",
    leadTitle: "",
    currency: "",
    pipeline: "",
    stage: "",
    closedDate: null,
    project: "",
  };

  const validationSchema = Yup.object({
    dealName: Yup.string().required("Please enter a Deal Name."),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Telephone number must be exactly 10 digits")
      .nullable(),
    price: Yup.string().required("Please enter a Price."),
    leadTitle: Yup.string().required("Please select a Lead Title."),
    currency: Yup.string().required("Please select a Currency."),
    pipeline: Yup.string().required("Please select a Pipeline."),
    stage: Yup.string().required("Please select a Stage."),
    closedDate: Yup.date().required("Please select a Closed Date."),
    project: Yup.string().required("Please select a Project."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddDeals(values))
      .then(() => {
        dispatch(GetDeals());
        message.success("Deal added successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add Deal.");
        console.error("Add API error:", error);
      });
  };

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            {/* <h2 className="mb-4 border-b pb-2 font-medium">Add Deal</h2> */}

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Deal Name</label>
                  <Field
                    name="dealName"
                    as={Input}
                    placeholder="Enter Deal Name"
                  />
                  <ErrorMessage
                    name="dealName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <Field
                    name="phoneNumber"
                    as={Input}
                    placeholder="Enter Phone Number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Price</label>
                  <Field
                    name="price"
                    as={Input}
                    placeholder="Enter Price"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Lead Title</label>
                  <Field name="leadTitle">
                    {({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select Lead Title"
                        onChange={(value) => setFieldValue("leadTitle", value)}
                      >
                        <Option value="Lead A">Lead A</Option>
                        <Option value="Lead B">Lead B</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="leadTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Currency</label>
                  <Field name="currency">
                    {({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select Currency"
                        onChange={(value) => setFieldValue("currency", value)}
                      >
                        <Option value="USD">USD</Option>
                        <Option value="EUR">EUR</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Pipeline</label>
                  <Field name="pipeline">
                    {({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select Pipeline"
                        onChange={(value) => setFieldValue("pipeline", value)}
                      >
                        <Option value="Pipeline 1">Pipeline 1</Option>
                        <Option value="Pipeline 2">Pipeline 2</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="pipeline"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Stage</label>
                  <Field name="stage">
                    {({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select Stage"
                        onChange={(value) => setFieldValue("stage", value)}
                      >
                        <Option value="Stage 1">Stage 1</Option>
                        <Option value="Stage 2">Stage 2</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="stage"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Closed Date</label>
                  <Field name="closedDate">
                    {({ field }) => (
                      <DatePicker
                        {...field}
                        style={{ width: "100%" }}
                        onChange={(date) => setFieldValue("closedDate", date)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="closedDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project</label>
                  <Field name="project">
                    {({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Select Project"
                        onChange={(value) => setFieldValue("project", value)}
                      >
                        <Option value="Project X">Project X</Option>
                        <Option value="Project Y">Project Y</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="project"
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

export default AddDeal;









// import React, { useEffect, useState } from "react";
// import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import utils from "utils";
// import OrderListData from "assets/data/order-list.data.json";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { AddDeals, GetDeals } from "./DealReducers/DealSlice";
// import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

// const { Option } = Select;

// const AddDeal = ({ onClose }) => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const tabledata = useSelector((state) => state?.SubClient);
//   const clientdata = tabledata?.SubClient?.data;

//   console.log("gfgfh", clientdata);

//   const initialValues = {
//     dealName: "",
//     phoneNumber: "",
//     price: "",
//     clients: "",
//   };

//   const validationSchema = Yup.object({
//     dealName: Yup.string().optional("Please enter a Deal Name."),
//     phoneNumber: Yup.string()
//       .matches(/^\d{10}$/, "telephone number must be exactly 10 digits")
//       .nullable(),
//     price: Yup.string().optional("Please enter a Price."),
//     clients: Yup.string().optional("Please select clients."),
//   });

//   const onSubmit = (values, { resetForm }) => {
//     dispatch(AddDeals(values))
//       .then(() => {
//         dispatch(GetDeals()); // Refresh leave data
//         message.success("Deal added successfully!");
//         resetForm();
//         onClose(); // Close modal
//       })
//       .catch((error) => {
//         message.error("Failed to add Leads.");
//         console.error("Add API error:", error);
//       });
//   };
//   // console.log("object",Option)

//   useEffect(() => {
//     dispatch(ClientData());
//   }, [dispatch]);

//   return (
//     <div className="add-job-form">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({
//           values,
//           setFieldValue,
//           handleSubmit,
//           handleChange,
//           setFieldTouched,
//           resetForm,
//         }) => (
//           <Form className="formik-form" onSubmit={handleSubmit}>
//             <h2 className="mb-4 border-b pb-2 font-medium"></h2>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Deal Name</label>
//                   <Field
//                     name="dealName"
//                     as={Input}
//                     placeholder="Enter Deal Name"
//                     rules={[{ required: true }]}
//                   />
//                   <ErrorMessage
//                     name="dealName"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Phone</label>
//                   <Field
//                     name="phoneNumber"
//                     as={Input}
//                     placeholder="Enter Phone Number"
//                   />

//                   <ErrorMessage
//                     name="phoneNumber"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Price</label>
//                   <Field
//                     name="price"
//                     as={Input}
//                     placeholder="Enter Price"
//                     rules={[{ required: true }]}
//                   />
//                   <ErrorMessage
//                     name="price"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Clients</label>
//                   <Field name="clients">
//                     {({ field }) => (
//                       <Select
//                         style={{ width: "100%" }}
//                         placeholder="Select Client"
//                         loading={!clientdata}
//                         value={values.clients} // Bind value to Formik's field
//                         onChange={(value) => setFieldValue("clients", value)} // Update Formik's field value
//                         onBlur={() => setFieldTouched("clients", true)} // Set touched state
//                       >
//                         {clientdata && clientdata.length > 0 ? (
//                           clientdata.map((client) => (
//                             <Option key={client.id} value={client.id}>
//                               {client.firstName ||
//                                 client.username ||
//                                 "Unnamed Client"}
//                             </Option>
//                           ))
//                         ) : (
//                           <Option value="" disabled>
//                             No Clients Available
//                           </Option>
//                         )}
//                       </Select>
//                     )}
//                   </Field>
//                   {/* <Field name="user" as={Select} className='w-full' placeholder="Select User">
//                                         <Option value="xyz">xyz</Option>
//                                         <Option value="abc">abc</Option>
//                                     </Field> */}
//                   <ErrorMessage
//                     name="user"
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

// export default AddDeal;

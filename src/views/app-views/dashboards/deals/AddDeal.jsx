//SHURSTI
import React, { useEffect } from "react";
import { Input, Button, Select, DatePicker, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddDeals, GetDeals } from "./DealReducers/DealSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { GetPip } from "../../dashboards/systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads } from "../leads/LeadReducers/LeadSlice";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
const { Option } = Select;
const AddDeal = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabledata = useSelector((state) => state?.SubClient);
  const { currencies } = useSelector((state) => state.currencies);
  const { data: Piplines, isLoading } = useSelector(
    (state) => state.Piplines.Piplines
  );
  const { data: StagesLeadsDeals } = useSelector(
    (state) => state.StagesLeadsDeals.StagesLeadsDeals
  );
  const { data: Leads } = useSelector((state) => state.Leads.Leads);
  const { data: Project } = useSelector((state) => state.Project.Project);
  const clientdata = tabledata?.SubClient?.data;
  const initialValues = {
    dealName: "",
    phoneNumber: "",
    price: "",
    leadTitle: "",
    currency: "",
    category:"",
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
    category: Yup.string().required("Please select a Category."),
    pipeline: Yup.string().required("Please select a Pipeline."),
    stage: Yup.string().required("Please select a Stage."),
    closedDate: Yup.date().required("Please select a Closed Date."),
    project: Yup.string().optional("Please select a Project."),
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
  useEffect(() => {
    dispatch(GetLeads());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);
  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getstages());
  }, [dispatch]);
  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);
  const LeadValueField = ({ field, form }) => (
    <Col span={24} className="mt-2">
      <div className="form-item">
        <div className="flex gap-2">
          <Field
            name="leadValue"
            type="number"
            as={Input}
            placeholder="Enter Lead Value"
            className="w-full"
          />
          <Field name="currencyId">
            {({ field, form }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Currency"
                onChange={(value) => form.setFieldValue("currencyId", value)}
              >
                {currencies?.map((currency) => (
                  <Option key={currency.id} value={currency.id}>
                    {currency.currencyCode} ({currency.currencyIcon})
                  </Option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <ErrorMessage
          name="leadValue"
          component="div"
          className="error-message text-red-500 my-1"
        />
      </div>
    </Col>
  );
  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
            {/* <h2 className="mb-4 border-b pb-2 font-medium">Add Deal</h2> */}
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Deal Name</label>
                  <Field
                    className="mt-2"
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
                    className="mt-2"
                    placeholder="Enter Phone Number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-4 mb-4">
                <div className="form-item">
                  <label className="font-semibold">Price</label>
                  <Field
                    name="price"
                    as={Input}
                    className="mt-2"
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
                  <label className="font-semibold mb-2">Currency</label>
                  <div className="flex gap-2">
                    <Field name="currency">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Currency"
                          onChange={(value) => {
                            const selectedCurrency = currencies.find(
                              (c) => c.id === value
                            );
                            form.setFieldValue(
                              "currency",
                              selectedCurrency?.currencyCode || ""
                            );
                          }}
                        >
                          {currencies?.map((currency) => (
                            <Option key={currency.id} value={currency.id}>
                              {currency.currencyCode}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4 mb-4">
                <div className="form-item">
                  <label className="font-semibold">Category</label>
                  <Field
                    name="category"
                    as={Input}
                    className="mt-2"
                    placeholder="Enter Category"
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              
              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Lead Title</label>
                  <div className="flex gap-2">
                    <Field name="leadTitle">
                      {({ field, form }) => (
                        <Select
                          {...field} // Spread Formik field props to manage the value
                          className="w-full mt-2"
                          placeholder="Select Lead Title"
                          value={field.value || ""} // Ensure the select value is controlled by Formik
                          onChange={(value) => {
                            // Find the selected lead from the Leads array
                            const selectedLead =
                              Array.isArray(Leads) &&
                              Leads.find((e) => e.id === value);
                            // Update Formik's field value with the selected lead's title
                            form.setFieldValue(
                              "leadTitle",
                              selectedLead?.leadTitle || ""
                            );
                          }}
                        >
                          {Array.isArray(Leads) &&
                            Leads.map((lead) => (
                              <Option key={lead.id} value={lead.id}>
                                {lead.leadTitle}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="leadTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Pipeline</label>
                  <div className="flex gap-2">
                    <Field name="pipeline">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Pipeline"
                          onChange={(value) => {
                            const selectedPipeline =
                              Array.isArray(Piplines) &&
                              Piplines.find((e) => e.id === value);
                            form.setFieldValue(
                              "pipeline",
                              selectedPipeline?.pipeline_name || ""
                            );
                          }}
                        >
                          {Array.isArray(Piplines) &&
                            Piplines.map((pipeline) => (
                              <Option key={pipeline.id} value={pipeline.id}>
                                {pipeline.pipeline_name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Stage</label>
                  <div className="flex gap-2">
                    <Field name="stage">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Stage"
                          value={field.value} // Ensure the select value is controlled
                          onChange={(value) => {
                            // Find the selected stage based on the id
                            const selectedStage =
                              Array.isArray(StagesLeadsDeals) &&
                              StagesLeadsDeals.find((e) => e.id === value);
                            // Update the form with the selected stage id
                            form.setFieldValue(
                              "stage",
                              selectedStage?.id || ""
                            );
                          }}
                        >
                          {Array.isArray(StagesLeadsDeals) &&
                            StagesLeadsDeals.map((stage) => (
                              <Option key={stage.id} value={stage.id}>
                                {stage.stageName}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
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
                        className="mt-2"
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
                  <div className="flex gap-2">
                    <Field name="project">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Project"
                          onChange={(value) => {
                            const selectedProject =
                              Array.isArray(Project) &&
                              Project.find((e) => e.id === value);
                            form.setFieldValue(
                              "project",
                              selectedProject?.project_name || ""
                            );
                          }}
                        >
                          {Array.isArray(Project) &&
                            Project.map((project) => (
                              <Option key={project.id} value={project.id}>
                                {project.project_name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Field>
                  </div>
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

// import React, { useEffect } from "react";
// import { Input, Button, Select, DatePicker, message, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
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

//   const initialValues = {
//     dealName: "",
//     phoneNumber: "",
//     price: "",
//     leadTitle: "",
//     currency: "",
//     pipeline: "",
//     stage: "",
//     closedDate: null,
//     project: "",
//   };

//   const validationSchema = Yup.object({
//     dealName: Yup.string().required("Please enter a Deal Name."),
//     phoneNumber: Yup.string()
//       .matches(/^\d{10}$/, "Telephone number must be exactly 10 digits")
//       .nullable(),
//     price: Yup.string().required("Please enter a Price."),
//     leadTitle: Yup.string().required("Please select a Lead Title."),
//     currency: Yup.string().required("Please select a Currency."),
//     pipeline: Yup.string().required("Please select a Pipeline."),
//     stage: Yup.string().required("Please select a Stage."),
//     closedDate: Yup.date().required("Please select a Closed Date."),
//     project: Yup.string().required("Please select a Project."),
//   });

//   const onSubmit = (values, { resetForm }) => {
//     dispatch(AddDeals(values))
//       .then(() => {
//         dispatch(GetDeals());
//         message.success("Deal added successfully!");
//         resetForm();
//         onClose();
//       })
//       .catch((error) => {
//         message.error("Failed to add Deal.");
//         console.error("Add API error:", error);
//       });
//   };

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
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form className="formik-form" onSubmit={handleSubmit}>
//             {/* <h2 className="mb-4 border-b pb-2 font-medium">Add Deal</h2> */}

//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Deal Name</label>
//                   <Field
//                     name="dealName"
//                     as={Input}
//                     placeholder="Enter Deal Name"
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
//                   <label className="font-semibold">Lead Title</label>
//                   <Field name="leadTitle">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select Lead Title"
//                         onChange={(value) => setFieldValue("leadTitle", value)}
//                       >
//                         <Option value="Lead A">Lead A</Option>
//                         <Option value="Lead B">Lead B</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="leadTitle"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Currency</label>
//                   <Field name="currency">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select Currency"
//                         onChange={(value) => setFieldValue("currency", value)}
//                       >
//                         <Option value="USD">USD</Option>
//                         <Option value="EUR">EUR</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="currency"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Pipeline</label>
//                   <Field name="pipeline">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select Pipeline"
//                         onChange={(value) => setFieldValue("pipeline", value)}
//                       >
//                         <Option value="Pipeline 1">Pipeline 1</Option>
//                         <Option value="Pipeline 2">Pipeline 2</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="pipeline"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Stage</label>
//                   <Field name="stage">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select Stage"
//                         onChange={(value) => setFieldValue("stage", value)}
//                       >
//                         <Option value="Stage 1">Stage 1</Option>
//                         <Option value="Stage 2">Stage 2</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="stage"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Closed Date</label>
//                   <Field name="closedDate">
//                     {({ field }) => (
//                       <DatePicker
//                         {...field}
//                         style={{ width: "100%" }}
//                         onChange={(date) => setFieldValue("closedDate", date)}
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="closedDate"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Project</label>
//                   <Field name="project">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select Project"
//                         onChange={(value) => setFieldValue("project", value)}
//                       >
//                         <Option value="Project X">Project X</Option>
//                         <Option value="Project Y">Project Y</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="project"
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

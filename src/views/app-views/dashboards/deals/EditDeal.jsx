import React, { useEffect, useState } from "react";
import { Input, Button, Select, message, Row, Col, DatePicker, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { EditDeals, GetDeals } from "./DealReducers/DealSlice";
import { GetPip } from "../../dashboards/systemsetup/Pipeline/PiplineReducer/piplineSlice"
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads } from "../leads/LeadReducers/LeadSlice";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import {getallcountries} from "../../setting/countries/countriesreducer/countriesSlice";
import AddDealStages from "../systemsetup/DealStages/AddDealStages";
import { PlusOutlined } from "@ant-design/icons";
import AddPipeLine from "../systemsetup/Pipeline/AddPipeLine";

import dayjs from "dayjs";
const { Option } = Select;
const EditDeal = ({ onClose, id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currencies } = useSelector((state) => state.currencies);
  const { data: Piplines, isLoading } = useSelector((state) => state.Piplines.Piplines);
  const { data: StagesLeadsDeals } = useSelector((state) => state.StagesLeadsDeals.StagesLeadsDeals);
  const { data: Leads } = useSelector((state) => state.Leads.Leads);
  const { data: Project } = useSelector((state) => state.Project.Project);
  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    dealName: "",
    phoneNumber: "",
    price: "",
    clients: "",
    leadTitle: "",
    currency: "",
    pipeline: "",
    stage: "",
    closedDate: null,
    project: "",
  });
  const allempdata = useSelector((state) => state.Deals);
  const datac = allempdata.Deals.data;
  const tabledata = useSelector((state) => state?.SubClient);
  const clientdata = tabledata?.SubClient?.data;
  useEffect(() => {
    // Check if the deal data exists for the given `id`
    const dealData = datac.find((item) => item.id === id);
    if (dealData) {
      setInitialValues({
        dealName: dealData.dealName || "",
        phoneNumber: dealData.phoneNumber || "",
        price: dealData.price || "",
        clients: dealData.clients || "",
        leadTitle: dealData.leadTitle || "",
        currency: dealData.currency || "",
        pipeline: dealData.pipeline || "",
        stage: dealData.stage || "",
        closedDate: dealData.closedDate || "",
        project: dealData.project || "",
      });
    }
  }, [id, datac]);
  const validationSchema = Yup.object({
    dealName: Yup.string().optional("Please enter a Deal Name."),
    phoneNumber: Yup.string()
      .nullable(),
    price: Yup.string().optional("Please enter a Price."),
    clients: Yup.string().required("Please select clients."),
    leadTitle: Yup.string().required("Please select a Lead Title."),
    currency: Yup.string().required("Please select a Currency."),
    pipeline: Yup.string().required("Please select a Pipeline."),
    stage: Yup.string().required("Please select a Stage."),
    closedDate: Yup.date().required("Please select a Closed Date."),
    project: Yup.string().required("Please select a Project."),
  });
  const onSubmit = (values) => {
    dispatch(EditDeals({ id, values }))
      .then(() => {
        dispatch(GetDeals());
        // message.success("Deal updated successfully!");
        onClose();
      })
      .catch((error) => {
        // message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };
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

  const [isAddDealStagesModalVisible, setIsAddDealStagesModalVisible] = useState(false);
  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] = useState(false);

  const openAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(true);
  };

  const closeAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(false);
  };

  const openAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(true);
  };

  const closeAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(false);
  };

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true} // Allow Formik to reset the initialValues when they change
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          handleChange,
          setFieldTouched,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Deal Name <span className="text-rose-500">*</span></label>
                  <Field
                    name="dealName"
                    className="mt-1"
                    as={Input}
                    placeholder="Enter Deal Name"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="dealName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-rose-500">*</span></label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phoneCode"
                      className="mt-1"  
                      onChange={(value) => setFieldValue('phoneCode', value)}
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.phoneCode}>
                          (+{country.phoneCode})
                        </Option>
                      ))}
                    </Select>
                    <Field name="phoneNumber">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          style={{ width: '70%' }}
                          placeholder="Enter phone number"
                          onKeyPress={(e) => {
                            // Allow only numbers
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Price <span className="text-rose-500">*</span></label>
                  <Field
                    name="price"
                    as={Input}
                    className="mt-1"
                    placeholder="Enter Price"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Clients <span className="text-rose-500">*</span></label>
                  <Field name="clients">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select User"
                        loading={!clientdata}
                        value={values.clients} // Ensure this matches the `clients` field
                        onChange={(value) => setFieldValue("clients", value)} // Update `clients` in Formik
                        onBlur={() => setFieldTouched("clients", true)}
                      >
                        {clientdata && clientdata.length > 0 ? (
                          clientdata.map((employee) => (
                            <Option key={employee.id} value={employee.id}>
                              {employee.firstName ||
                                employee.username ||
                                "Unnamed User"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Users Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="user"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Lead Title <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <Field name="leadTitle">
                      {({ field, form }) => (
                        <Select
                          {...field} // Spread Formik field props to manage the value
                          className="w-full mt-1"
                          placeholder="Select Lead Title"
                          value={field.value || ""} // Ensure the select value is controlled by Formik
                          onChange={(value) => {
                            // Find the selected lead from the Leads array
                            const selectedLead = Array.isArray(Leads) && Leads.find((e) => e.id === value);
                            // Update Formik's field value with the selected lead's title
                            form.setFieldValue("leadTitle", selectedLead?.leadTitle || "");
                          }}
                        >
                          {Array.isArray(Leads) && Leads.map((lead) => (
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
              {/* <Col span={12} className="">
                <div className="form-item">
                  <label className="font-semibold">Lead Value</label>
                  <Field name="leadValue"
                    className="mt-2" component={LeadValueField} />
                  <ErrorMessage
                    name="leadValue.amount"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                  <ErrorMessage
                    name="leadValue.currencyId"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Pipeline <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <Field name="pipeline">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                          dropdownRender={(menu) => (
                            <div>
                              {menu}
                              <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                <Button
                                  type="link"
                                  icon={<PlusOutlined />}
                                  className="w-full mt-1"
                                  onClick={openAddPipeLineModal}
                                >
                                  Add New Pipeline
                                </Button>
                              </div>
                            </div>
                          )}
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
                    name="pipeline"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Stage <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <Field name="stage">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
                          placeholder="Select Stage"
                          value={field.value} // Ensure the select value is controlled
                          onChange={(value) => {
                            const selectedStage =
                              Array.isArray(StagesLeadsDeals) &&
                              StagesLeadsDeals.find((e) => e.id === value);
                            form.setFieldValue("stage", selectedStage?.id || "");
                          }}
                          dropdownRender={(menu) => (
                            <div>
                              {menu}
                              <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                <Button
                                  type="link"
                                  icon={<PlusOutlined />}
                                  className="w-full mt-1"
                                  onClick={openAddDealStagesModal}
                                >
                                  Add New Deal Stage
                                </Button>
                              </div>
                            </div>
                          )}
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
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Closed Date <span className="text-rose-500">*</span></label>
                  <Field name="closedDate">
                    {({ field, form }) => (
                      <DatePicker
                        className="mt-1"
                        style={{ width: "100%" }}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          form.setFieldValue("closedDate", date ? date.toISOString() : null);
                        }}
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
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Project <span className="text-rose-500">*</span> </label>
                  <div className="flex gap-2">
                    <Field name="project">
                      {({ field, form }) => (
                        <Select
                          {...field}
                            className="w-full mt-1"
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Add Deal Stages Modal */}
      <Modal
        title="Add Deal Stages"
        visible={isAddDealStagesModalVisible}
        onCancel={closeAddDealStagesModal}
        footer={null}
        width={700}
        className="mt-[-70px]"
      >
        <AddDealStages onClose={closeAddDealStagesModal} />
      </Modal>

      {/* Add Pipeline Modal */}
      <Modal
        title="Add Pipeline"
        visible={isAddPipeLineModalVisible}
        onCancel={closeAddPipeLineModal}
        footer={null}
        width={700}
      >
        <AddPipeLine onClose={closeAddPipeLineModal} />
      </Modal>
    </div>
  );
};
export default EditDeal;













// import React, { useEffect, useState } from "react";
// import { Input, Button, Select, message, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { EditDeals, GetDeals } from "./DealReducers/DealSlice";

// const { Option } = Select;

// const EditDeal = ({ onClose, id }) => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const [initialValues, setInitialValues] = useState({
//     dealName: "",
//     phoneNumber: "",
//     price: "",
//     clients: "",
//   });

//   const allempdata = useSelector((state) => state.Deals);
//   const datac = allempdata.Deals.data;

//   const tabledata = useSelector((state) => state?.SubClient);
//   const clientdata = tabledata?.SubClient?.data;

//   useEffect(() => {
//     // Check if the deal data exists for the given `id`
//     const dealData = datac.find((item) => item.id === id);
//     if (dealData) {
//       setInitialValues({
//         dealName: dealData.dealName || "",
//         phoneNumber: dealData.phoneNumber || "",
//         price: dealData.price || "",
//         clients: dealData.clients || "",
//       });
//     }
//   }, [id, datac]);

//   const validationSchema = Yup.object({
//     dealName: Yup.string().optional("Please enter a Deal Name."),
//     phoneNumber: Yup.string()
//       .matches(/^\d{10}$/, "telephone number must be exactly 10 digits")
//       .nullable(),
//     price: Yup.string().optional("Please enter a Price."),
//     clients: Yup.string().required("Please select clients."),
//   });

//   const onSubmit = (values) => {
//     dispatch(EditDeals({ id, values }))
//       .then(() => {
//         dispatch(GetDeals());
//         message.success("Deal updated successfully!");
//         onClose();
//       })
//       .catch((error) => {
//         message.error("Failed to update Employee.");
//         console.error("Edit API error:", error);
//       });
//   };

//   return (
//     <div className="add-job-form">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         enableReinitialize={true} // Allow Formik to reset the initialValues when they change
//         onSubmit={onSubmit}
//       >
//         {({
//           values,
//           setFieldValue,
//           handleSubmit,
//           handleChange,
//           setFieldTouched,
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
//                         {...field}
//                         style={{ width: "100%" }}
//                         placeholder="Select User"
//                         loading={!clientdata}
//                         value={values.clients} // Ensure this matches the `clients` field
//                         onChange={(value) => setFieldValue("clients", value)} // Update `clients` in Formik
//                         onBlur={() => setFieldTouched("clients", true)}
//                       >
//                         {clientdata && clientdata.length > 0 ? (
//                           clientdata.map((employee) => (
//                             <Option key={employee.id} value={employee.id}>
//                               {employee.firstName ||
//                                 employee.username ||
//                                 "Unnamed User"}
//                             </Option>
//                           ))
//                         ) : (
//                           <Option value="" disabled>
//                             No Users Available
//                           </Option>
//                         )}
//                       </Select>
//                     )}
//                   </Field>

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
//                 Update
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default EditDeal;

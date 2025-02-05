//SHURSTI
import React, { useEffect,useState } from "react";
import { Input, Button, Select, DatePicker, message, Row, Col,Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AddDeals, GetDeals } from "./DealReducers/DealSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { GetPip } from "../../dashboards/systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetLeads } from "../leads/LeadReducers/LeadSlice";
import { AddLable, GetLable } from "../../dashboards/sales/LableReducer/LableSlice";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import {getallcountries} from "../../setting/countries/countriesreducer/countriesSlice";
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
  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

   // category start
   const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
   const [newCategory, setNewCategory] = useState("");
   const [categories, setCategories] = useState([]);
 
   const AllLoggedData = useSelector((state) => state.user);
 
   const lid = AllLoggedData.loggedInUser.id;
 
   const fetchLables = async (lableType, setter) => {
     try {
       const lid = AllLoggedData.loggedInUser.id;
       const response = await dispatch(GetLable(lid));
 
       if (response.payload && response.payload.data) {
         const uniqueCategories = response.payload.data
           .filter((label) => label && label.name) // Filter out invalid labels
           .map((label) => ({
             id: label.id,
             name: label.name.trim(),
           }))
           .filter(
             (label, index, self) =>
               index === self.findIndex((t) => t.name === label.name)
           ); // Remove duplicates
 
         setCategories(uniqueCategories);
       }
     } catch (error) {
       console.error("Failed to fetch categories:", error);
       message.error("Failed to load categories");
     }
   };
 
   useEffect(() => {
     fetchLables("category", setCategories);
   }, []);
 
   const handleAddNewCategory = async () => {
     if (!newCategory.trim()) {
       message.error("Please enter a category name");
       return;
     }
 
     try {
       const lid = AllLoggedData.loggedInUser.id;
       const payload = {
         name: newCategory.trim(),
         labelType: "status",
       };
 
       await dispatch(AddLable({ lid, payload }));
       message.success("Category added successfully");
       setNewCategory("");
       setIsCategoryModalVisible(false);
 
       // Fetch updated categories
       await fetchLables();
     } catch (error) {
       console.error("Failed to add Category:", error);
       message.error("Failed to add Category");
     }
   };
 
   // category end

  const initialValues = {
    dealName: "",
    phoneNumber: "",
    phoneCode: "",
    price: "",
    leadTitle: "",
    currency: "",
    category: "",
    pipeline: "",
    stage: "",
    closedDate: null,
    project: "",
  };
  const validationSchema = Yup.object({
    dealName: Yup.string().required("Please enter a Deal Name."),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    phoneCode: Yup.string().required("Phone code is required"),
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
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phoneCode"
                      value={values.phoneCode}
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
                          maxLength={10}
                          onInput={(e) => {
                            // Limit input to 10 digits
                            e.target.value = e.target.value.slice(0, 10);
                            setFieldValue('phoneNumber', e.target.value);
                          }}
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
                    name="phoneCode"
                    component="div"
                    className="error-message text-red-500 my-1"
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
                            const selectedCurrency = Array.isArray(currencies?.data) && 
                              currencies?.data?.find((c) => c.id === value);
                            form.setFieldValue(
                              "currency",
                              selectedCurrency?.currencyCode || ""
                            );
                          }}
                        >
                          {Array.isArray(currencies?.data) && currencies?.data?.length > 0 ? (
                            currencies.data.map((currency) => (
                              <Option key={currency.id} value={currency.id}>
                                {currency.currencyCode}
                              </Option>
                            ))
                          ) : (
                            <Option value="" disabled>No Currencies Available</Option>
                          )}
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

              <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold">Category</label>
                      <Select
                        style={{ width: "100%" }}
                        className="w-full mt-2"
                        placeholder="Select or add new category"
                        value={values.category}
                        onChange={(value) => setFieldValue("category", value)}
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                className="w-full mt-2"
                                onClick={() => setIsCategoryModalVisible(true)}
                              >
                                Add New Category
                              </Button>
                            </div>
                          </div>
                        )}
                      >
                        {categories.map((category) => (
                          <Option key={category.id} value={category.name}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="project_category"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
              
              <Col span={12} className="">
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

              <Col span={12} className="mt-4">
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
                    name="pipeline"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-4">
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

       {/* Add Category Modal */}
       <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewCategory("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>
    </div>
  );
};
export default AddDeal;

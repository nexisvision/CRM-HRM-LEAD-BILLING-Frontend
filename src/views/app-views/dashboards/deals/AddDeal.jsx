import React, { useEffect, useState } from "react";
import { Input, Button, Select, DatePicker, message, Row, Col, Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import AddDealStages from "../systemsetup/DealStages/AddDealStages";
import AddPipeLine from "../systemsetup/Pipeline/AddPipeLine";
import AddCurrencies from "views/app-views/setting/currencies/AddCurrencies";
import AddCountries from "views/app-views/setting/countries/AddCountries";
const { Option } = Select;
const AddDeal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { data: Piplines = [] } = useSelector((state) => state.Piplines.Piplines || {});
  const allpipline = Piplines || [];

  const logged = useSelector((state) => state.user?.loggedInUser?.username);

  const fnddatas = logged && Array.isArray(allpipline)
    ? allpipline.filter((item) => item?.created_by === logged)
    : [];

  const { data: StagesLeadsDealss = [] } = useSelector(
    (state) => state.StagesLeadsDeals.StagesLeadsDeals || {}
  );
  const StagesLeadsDeals = logged && Array.isArray(StagesLeadsDealss)
    ? StagesLeadsDealss.filter((item) =>
      item?.created_by === logged && item?.stageType === "deal"
    )
    : [];


  const { data: Leadss = [] } = useSelector((state) => state.Leads.Leads || {});

  const Leads = logged && Array.isArray(Leadss)
    ? Leadss.filter((item) => item?.created_by === logged)
    : [];



  const { data: Projectt = [] } = useSelector((state) => state.Project.Project || {});

  const Project = logged && Array.isArray(Projectt)
    ? Projectt.filter((item) => item?.created_by === logged)
    : [];


  const countries = useSelector((state) => state.countries?.countries || []);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);
  useEffect(() => {
    const fetchLables = async () => {
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

    fetchLables();
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  const handleAddNewCategory = async (newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error("Please enter a category name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType: "category",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Category added successfully");
      setter(""); // Reset input field
      modalSetter(false); // Close modal

      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredCategories = response.payload.data
          .filter((label) => label.lableType === "category")
          .map((label) => ({ id: label.id, name: label.name.trim() }));

        setCategories(filteredCategories);
        setFieldValue("category", newValue.trim()); // Set the newly created category in the form
      }
    } catch (error) {
      console.error("Failed to add Category:", error);
      message.error("Failed to add Category");
    }
  };


  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const initialValues = {
    dealName: "",
    phoneNumber: "",
    phoneCode: getInitialCountry(),
    price: "",
    leadTitle: "",
    currency: getInitialCurrency(),
    category: "",
    pipeline: "",
    stage: "",
    closedDate: null,
    project: "",
  };
  const onSubmit = (values, { resetForm }) => {
    dispatch(AddDeals(values))
      .then(() => {
        dispatch(GetDeals());
        resetForm();
        onClose();
      })
      .catch((error) => {
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

  const [isAddDealStagesModalVisible, setIsAddDealStagesModalVisible] = useState(false);

  const openAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(true);
  };

  const closeAddDealStagesModal = () => {
    setIsAddDealStagesModalVisible(false);
  };

  const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] = useState(false);

  const openAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(true);
  };

  const closeAddPipeLineModal = () => {
    setIsAddPipeLineModalVisible(false);
  };

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phoneNumber', value);
    }
  };

  return (
    <div className="add-job-form">
          <div className="mb-2 border-b pb-[10px] font-medium"></div>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item mt-3">
                  <label className="font-semibold">Deal Name <span className="text-rose-500">*</span></label>
                  <Field
                    className="mt-1"
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
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Phone
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-0">
                    <Field name="phoneCode">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="phone-code-select"
                          style={{
                            width: '80px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">+91</span>}
                          onChange={(value) => {
                            if (value === 'add_new') {
                              setIsAddPhoneCodeModalVisible(true);
                            } else {
                              setFieldValue('phoneCode', value);
                            }
                          }}
                          value={values.phoneCode || getInitialCountry()}
                          dropdownStyle={{ minWidth: '180px' }}
                          suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                          loading={!countries}
                          dropdownRender={menu => (
                            <div>
                              <div
                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                onClick={() => setIsAddPhoneCodeModalVisible(true)}
                              >
                                <PlusOutlined className="mr-2" />
                                <span className="text-sm">Add New</span>
                              </div>
                              {menu}
                            </div>
                          )}
                        >
                          {countries?.map((country) => (
                            <Option key={country.id} value={country.phoneCode}>
                              <div className="flex items-center w-full px-1">
                                <span className="text-base min-w-[40px]">{country.phoneCode}</span>
                                <span className="text-gray-600 text-sm ml-3">{country.countryName}</span>
                                <span className="text-gray-400 text-xs ml-auto">{country.countryCode}</span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <Field name="phoneNumber">
                      {({ field, form }) => (
                        <Input
                          {...field}
                          className="phone-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: 0,
                            width: 'calc(100% - 80px)'
                          }}
                          type="text"
                          placeholder="Enter 10-digit number"
                          onChange={(e) => handlePhoneNumberChange(e, form.setFieldValue)}
                          onKeyPress={(e) => {
                            const charCode = e.which ? e.which : e.keyCode;
                            if (charCode < 48 || charCode > 57) {
                              e.preventDefault();
                            }
                          }}
                          value={field.value}
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-1 block">Currency & Amount <span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="currency-select"
                          style={{
                            width: '80px',
                            height: '40px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">₹</span>}
                          onChange={(value) => {
                            if (value === 'add_new') {
                              setIsAddCurrencyModalVisible(true);
                            } else {
                              setFieldValue("currency", value);
                            }
                          }}
                          value={values.currency || getInitialCurrency()}
                          dropdownStyle={{ minWidth: '180px' }}
                          suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                          loading={!fnddatass}
                          dropdownRender={menu => (
                            <div>
                              <div
                                className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                onClick={() => setIsAddCurrencyModalVisible(true)}
                              >
                                <PlusOutlined className="mr-2" />
                                <span className="text-sm">Add New</span>
                              </div>
                              {menu}
                            </div>
                          )}
                        >
                          {fnddatass?.map((currency) => (
                            <Option key={currency.id} value={currency.id}>
                              <div className="flex items-center w-full px-1">
                                <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <Field name="price">
                      {({ field, form }) => (
                        <Input
                          {...field}
                          className="price-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                              form.setFieldValue('price', value);
                            }
                          }}
                          onKeyPress={(e) => {
                            const charCode = e.which ? e.which : e.keyCode;
                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                              e.preventDefault();
                            }
                            if (charCode === 46 && field.value.includes('.')) {
                              e.preventDefault();
                            }
                          }}
                          prefix={
                            values.currency && (
                              <span className="text-gray-600 font-medium mr-1">
                                {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                              </span>
                            )
                          }
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Category </label>
                  <Select
                    name="category"
                    style={{ width: "100%" }}
                    className="w-full mt-1"
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
                            className="w-full mt-1"
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
                            const selectedLead =
                              Array.isArray(Leads) &&
                              Leads.find((e) => e.id === value);
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
                  <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>

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
                              Array.isArray(fnddatas) &&
                              fnddatas.find((e) => e.id === value);
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
                          {Array.isArray(fnddatas) &&
                            fnddatas.map((pipeline) => (
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
                            form.setFieldValue(
                              "stage",
                              selectedStage?.id || ""
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
                    {({ field }) => (
                      <DatePicker
                        {...field}
                        className="mt-1"
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
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Category Modal */}
      <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewCategory(newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

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

      {/* Add Currency Modal */}
      <Modal
        title="Add New Currency"
        visible={isAddCurrencyModalVisible}
        onCancel={() => setIsAddCurrencyModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCurrencies
          onClose={() => {
            setIsAddCurrencyModalVisible(false);
            dispatch(getcurren()); // Refresh currency list after adding
          }}
        />
      </Modal>

      {/* Add Phone Code Modal */}
      <Modal
        title="Add New Country"
        visible={isAddPhoneCodeModalVisible}
        onCancel={() => setIsAddPhoneCodeModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCountries
          onClose={() => {
            setIsAddPhoneCodeModalVisible(false);
            dispatch(getallcountries());
          }}
        />
      </Modal>

      <style jsx>{`
        .phone-code-select .ant-select-selector {
          background-color: #f8fafc !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-right: 0 !important;
        }

        .phone-code-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .phone-code-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .phone-code-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        .phone-input {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }

        .phone-input:focus {
          border-color: #d9d9d9 !important;
          box-shadow: none !important;
        }

        .phone-input:hover {
          border-color: #d9d9d9 !important;
        }

        /* Currency select styles */
        .currency-select .ant-select-selector {
          height: 40px !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
          display: flex !important;
          align-items: center !important;
        }

        .currency-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
          line-height: 32px !important;
        }

        .currency-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        /* Price input styles */
        // .price-input {
        //   height: 40px !important;
        // }

        /* Dropdown styles */
        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }

        /* Make all form fields consistent height */
      
        .ant-select-selector,
        .ant-picker,
        .ant-input-number,
        .ant-input-affix-wrapper {
          height: 40px !important;
          line-height: 40px !important;
        }

        .ant-select:not(.ant-select-customize-input) .ant-select-selector {
          height: 40px !important;
          padding: 4px 11px !important;
        }

        .ant-select-selection-search-input {
          height: 38px !important;
        }

        /* Remove number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }

        input[type="number"] {
          -moz-appearance: textfield !important;
        }
      `}</style>
    </div>
  );
};

export default AddDeal;

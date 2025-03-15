import React, { useEffect, useState } from "react";
import { Input, Button, Select, Row, Col, DatePicker, Modal } from "antd";
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
import { getallcountries } from "../../setting/countries/countriesreducer/countriesSlice";
import AddDealStages from "../systemsetup/DealStages/AddDealStages";
import { PlusOutlined } from "@ant-design/icons";
import AddPipeLine from "../systemsetup/Pipeline/AddPipeLine";
import AddCurrencies from '../../setting/currencies/AddCurrencies';
import AddCountries from "views/app-views/setting/countries/AddCountries";


import dayjs from "dayjs";
const { Option } = Select;
const EditDeal = ({ onClose, id }) => {
  const dispatch = useDispatch();
  const { data: Piplines } = useSelector((state) => state.Piplines.Piplines);
  const { data: StagesLeadsDeals } = useSelector((state) => state.StagesLeadsDeals.StagesLeadsDeals);
  const { data: Leads } = useSelector((state) => state.Leads.Leads);
  const { data: Project } = useSelector((state) => state.Project.Project);
  const countries = useSelector((state) => state.countries.countries);

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
  const getInitialCountry = React.useCallback(() => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  }, [countries]);

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phoneNumber', value);
    }
  };

  const [initialValues, setInitialValues] = useState({
    dealName: "",
    phoneNumber: "",
    phoneCode: getInitialCountry(),
    price: "",
    clients: "",
    leadTitle: "",
    currency: getInitialCurrency(),
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
    const dealData = datac.find((item) => item.id === id);
    if (dealData) {
      setInitialValues({
        dealName: dealData.dealName || "",
        phoneNumber: dealData.phoneNumber || "",
        phoneCode: dealData.phoneCode || getInitialCountry(),
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
  }, [id, datac, getInitialCountry]);
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
        onClose();
      })
      .catch((error) => {
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
          <div className="mb-2 border-b pb-[-10px] font-medium"></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
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
              <Col span={12}>
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Phone <span className="text-red-500">*</span></label>
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
                          value={values.phoneCode}
                          dropdownStyle={{ minWidth: '180px' }}
                          suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
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
                      {({ field }) => (
                        <Input
                          {...field}
                          className="phone-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="number"
                          placeholder="Enter phone number"
                          onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                          value={field.value || ''}
                        // prefix={
                        //   values.phoneCode && (
                        //     <span className="text-gray-600 font-medium mr-1">
                        //       {values.phoneCode}
                        //     </span>
                        //   )
                        // }
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>
              <Col span={12} className="mt-3">
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Currency <span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="currency-select"
                          style={{
                            width: '60px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">$</span>}
                          onChange={(value) => {
                            if (value === 'add_new') {
                              setIsAddCurrencyModalVisible(true);
                            } else {
                              setFieldValue("currency", value);
                            }
                          }}
                          value={values.currency}
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
                            const selectedLead = Array.isArray(Leads) && Leads.find((e) => e.id === value);
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

    </div>
  );
};

export default EditDeal;

<style jsx>{`
  .currency-select .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
  }

  .currency-select .ant-select-selection-item > div {
    display: flex !important;
    align-items: center !important;
  }

  .currency-select .ant-select-selection-item span:not(:first-child) {
    display: none !important;
  }

  .ant-select-dropdown .ant-select-item {
    padding: 8px 12px !important;
  }

  .ant-select-dropdown .ant-select-item-option-content > div {
    display: flex !important;
    align-items: center !important;
    width: 100% !important;
  }

        //.contract-select .ant-select-selection-item {
        //   display: flex !important;
        //   align-items: center !important;
        //   justify-content: center !important;
        //   font-size: 16px !important;
        // }

        // .contract-select .ant-select-selection-item > div {
        //   display: flex !important;
        //   align-items: center !important;
        // }

        // .contract-select .ant-select-selection-item span:not(:first-child) {
        //   display: none !important;
        // }

        .phone-code-select .ant-select-selector {
          // height: 32px !important;
          // padding: 0 8px !important;
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

        // .phone-input::-webkit-inner-spin-button,
        // .phone-input::-webkit-outer-spin-button {
        //   -webkit-appearance: none;
        //   margin: 0;
        // }

        // .phone-input {
        //   -moz-appearance: textfield;
        // }
`}</style>

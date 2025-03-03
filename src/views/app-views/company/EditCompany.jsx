import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  TimePicker,
  Upload,
  Form as AntForm,
} from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Editclients, ClientData } from "./CompanyReducers/CompanySlice";
import { UploadOutlined } from '@ant-design/icons';
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";

const { Option } = Select;

const EditCompany = ({ comnyid, initialData, onClose }) => {
  const [form] = AntForm.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (auth.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [auth.token]);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    bankname: "",
    phone: "",
    ifsc: "",
    banklocation: "",
    accountholder: "",
    accountnumber: "",
    gstIn: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    profilePic: "",
    address: "",
    website: "",
    accountType: ""
  });

  useEffect(() => {
    if (initialData || loggedInUser) {
      setInitialValues(prev => ({
        firstName: initialData?.firstName || loggedInUser?.firstName || "",
        lastName: initialData?.lastName || loggedInUser?.lastName || "",
        bankname: initialData?.bankname || loggedInUser?.bankname || "",
        phone: initialData?.phone || loggedInUser?.phone || "",
        ifsc: initialData?.ifsc || loggedInUser?.ifsc || "",
        banklocation: initialData?.banklocation || loggedInUser?.banklocation || "",
        accountholder: initialData?.accountholder || loggedInUser?.accountholder || "",
        accountnumber: initialData?.accountnumber || loggedInUser?.accountnumber || "",
        gstIn: initialData?.gstIn || loggedInUser?.gstIn || "",
        city: initialData?.city || loggedInUser?.city || "",
        state: initialData?.state || loggedInUser?.state || "",
        country: initialData?.country || loggedInUser?.country || "",
        zipcode: initialData?.zipcode || loggedInUser?.zipcode || "",
        profilePic: initialData?.profilePic || loggedInUser?.profilePic || "",
        address: initialData?.address || loggedInUser?.address || "",
        website: initialData?.website || loggedInUser?.website || "",
        accountType: initialData?.accountType || loggedInUser?.accountType || ""
      }));

      form.setFieldsValue({
        firstName: initialData?.firstName || loggedInUser?.firstName || "",
        lastName: initialData?.lastName || loggedInUser?.lastName || "",
        bankname: initialData?.bankname || loggedInUser?.bankname || "",
        phone: initialData?.phone || loggedInUser?.phone || "",
        ifsc: initialData?.ifsc || loggedInUser?.ifsc || "",
        banklocation: initialData?.banklocation || loggedInUser?.banklocation || "",
        accountholder: initialData?.accountholder || loggedInUser?.accountholder || "",
        accountnumber: initialData?.accountnumber || loggedInUser?.accountnumber || "",
        gstIn: initialData?.gstIn || loggedInUser?.gstIn || "",
        city: initialData?.city || loggedInUser?.city || "",
        state: initialData?.state || loggedInUser?.state || "",
        country: initialData?.country || loggedInUser?.country || "",
        zipcode: initialData?.zipcode || loggedInUser?.zipcode || "",
        profilePic: initialData?.profilePic || loggedInUser?.profilePic || "",
        address: initialData?.address || loggedInUser?.address || "",
        website: initialData?.website || loggedInUser?.website || "",
        accountType: initialData?.accountType || loggedInUser?.accountType || ""
      });
    }
  }, [initialData, loggedInUser, form]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a First Name."),
    lastName: Yup.string().required("Please enter a Last Name."),
    phone: Yup.string().required("Please enter a Phone."),
    bankname: Yup.string().required("Please enter a Bankname."),
    city: Yup.string().required("Please enter a City."),
    state: Yup.string().required("Please enter a State."),
    country: Yup.string().required("Please enter a Country."),
    zipcode: Yup.string().required("Please enter a Zipcode."),
    address: Yup.string().required("Please enter an Address."),
    website: Yup.string().required("Please enter a Website."),
  });

  const handleSubmit = async (values) => {
    try {
      if (!auth.token) {
        message.error("Please login to continue");
        return;
      }

      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'profilePic' && typeof values[key] === 'object') {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const result = await dispatch(Editclients({ comnyid, formData })).unwrap();
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to update company');
      }

      message.success("Company updated successfully!");
      await dispatch(ClientData()).unwrap();
      onClose();
    } catch (error) {
      if (error.message === "Unauthorized access" || error.response?.status === 401) {
        message.error("Session expired. Please login again");
      } else {
        message.error(error.message || "Failed to update company");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-company-modal">
      <div className="modal-body">
        <AntForm form={form}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-section">
                  <div className="section-title">
                    <h2>Personal Information</h2>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Field name="firstName">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter First Name"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Field name="lastName">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Last Name"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Select
                            style={{ width: '30%' }}
                            placeholder="Code"
                            className="rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                          >
                            {countries.map((country) => (
                              <Option key={country.id} value={country.phoneCode}>
                                (+{country.phoneCode})
                              </Option>
                            ))}
                          </Select>
                          <Field name="phone">
                            {({ field }) => (
                              <Input
                                {...field}
                                style={{ width: '70%' }}
                                placeholder="Enter phone number"
                                className="rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website <span className="text-red-500">*</span>
                        </label>
                        <Field name="website">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Website"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="website" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <Field name="address">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Address"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number <span className="text-red-500">*</span>
                        </label>
                        <Field name="gstIn">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter GST Number"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="gstIn" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={6}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <Field name="city">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter City"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <Field name="state">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter State"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <Field name="country">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Country"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="country" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zipcode <span className="text-red-500">*</span>
                        </label>
                        <Field name="zipcode">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Zipcode"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="zipcode" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Bank Details Section */}
                <div className="form-section">
                  <div className="section-title">
                    <h2>Bank Details</h2>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <Field name="accountholder">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Account Holder Name"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="accountholder" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <Field name="accountnumber">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Account Number"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="accountnumber" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <Field name="bankname">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Bank Name"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="bankname" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <Field name="ifsc">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter IFSC Code"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="ifsc" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Location <span className="text-red-500">*</span>
                        </label>
                        <Field name="banklocation">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter Bank Location"
                              className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="banklocation" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Type <span className="text-red-500">*</span>
                        </label>
                        <Field name="accountType">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                            >
                              <Option value="current">Current</Option>
                              <Option value="saving">Saving</Option>
                              <Option value="business">Business</Option>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage name="accountType" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Picture
                        </label>
                        <Field name="profilePic">
                          {({ field, form }) => (
                            <Upload
                              accept="image/*"
                              beforeUpload={(file) => {
                                form.setFieldValue('profilePic', file);
                                return false;
                              }}
                              showUploadList={true}
                              className="mt-1"
                            >
                              <Button icon={<UploadOutlined />} className="mt-1">
                                Upload Profile Picture
                              </Button>
                            </Upload>
                          )}
                        </Field>
                        <ErrorMessage name="profilePic" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="modal-footer">
                  <Button onClick={onClose} className="btn-cancel">
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" className="btn-submit">
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </AntForm>
      </div>

      <style jsx="true">{`
        .edit-company-modal {
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .modal-body {
          padding: 16px;
          background: white;
        }

        .form-section {
          margin-bottom: 24px;
          background: white;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-title h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 0 16px;
          height: 36px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #4b5563;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-submit {
          padding: 0 16px;
          height: 36px;
          border-radius: 4px;
          background: #3b82f6;
          border: none;
          color: white;
          transition: all 0.2s ease;
        }

        .btn-submit:hover {
          background: #2563eb;
        }

        /* Form field styles */
        .ant-input,
        .ant-select-selector {
          border-radius: 4px !important;
          border: 1px solid #e5e7eb !important;
          transition: all 0.2s ease !important;
          box-shadow: none !important;
        }

        .ant-input:hover,
        .ant-select-selector:hover {
          border-color: #3b82f6 !important;
        }

        .ant-input:focus,
        .ant-select-selector:focus,
        .ant-select-focused .ant-select-selector {
          border-color: #3b82f6 !important;
          box-shadow: none !important;
        }

        /* Label styles */
        label {
          color: #374151;
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          display: block;
        }

        /* Error message styles */
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 2px;
        }

        /* Upload button styles */
        .ant-upload-select {
          width: 100%;
        }

        .ant-upload-select .ant-btn {
          width: 100%;
          border: 1px dashed #d1d5db;
          background: #f9fafb;
          border-radius: 4px;
          height: 36px;
        }

        .ant-upload-select .ant-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        /* Row spacing */
        .ant-row {
          margin-bottom: 12px;
        }

        .mb-4 {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default EditCompany;
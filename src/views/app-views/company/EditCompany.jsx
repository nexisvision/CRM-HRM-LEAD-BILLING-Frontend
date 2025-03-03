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
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import CompanyService from "./CompanyReducers/CompanyService";
import axios from "axios";
import { Editclients, ClientData } from "./CompanyReducers/CompanySlice";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditCompany = ({ comnyid, initialData, onClose }) => {
  const [form] = AntForm.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const clientData = useSelector((state) => state.ClientData?.data?.find(item => item.id === comnyid));

  // Setup axios interceptor for token
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.token) {
          message.error("Please login to continue");
          navigate('/auth/login');
          return;
        }

        const result = await dispatch(ClientData()).unwrap();
        if (!result?.success) {
          throw new Error(result?.message || 'Failed to fetch client data');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client data:", error);
        if (error.message === "Unauthorized access" || error.response?.status === 401) {
          message.error("Session expired. Please login again");
          navigate('/auth/login');
        } else {
          message.error(error.message || "Failed to fetch client data");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, comnyid, auth.token, navigate]);

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
    if (clientData || initialData || loggedInUser) {
      setInitialValues(prev => ({
        firstName: initialData?.firstName || clientData?.firstName || loggedInUser?.firstName || "",
        lastName: initialData?.lastName || clientData?.lastName || loggedInUser?.lastName || "",
        bankname: initialData?.bankname || clientData?.bankname || loggedInUser?.bankname || "",
        phone: initialData?.phone || clientData?.phone || loggedInUser?.phone || "",
        ifsc: initialData?.ifsc || clientData?.ifsc || loggedInUser?.ifsc || "",
        banklocation: initialData?.banklocation || clientData?.banklocation || loggedInUser?.banklocation || "",
        accountholder: initialData?.accountholder || clientData?.accountholder || loggedInUser?.accountholder || "",
        accountnumber: initialData?.accountnumber || clientData?.accountnumber || loggedInUser?.accountnumber || "",
        gstIn: initialData?.gstIn || clientData?.gstIn || loggedInUser?.gstIn || "",
        city: initialData?.city || clientData?.city || loggedInUser?.city || "",
        state: initialData?.state || clientData?.state || loggedInUser?.state || "",
        country: initialData?.country || clientData?.country || loggedInUser?.country || "",
        zipcode: initialData?.zipcode || clientData?.zipcode || loggedInUser?.zipcode || "",
        profilePic: initialData?.profilePic || clientData?.profilePic || loggedInUser?.profilePic || "",
        address: initialData?.address || clientData?.address || loggedInUser?.address || "",
        website: initialData?.website || clientData?.website || loggedInUser?.website || "",
        accountType: initialData?.accountType || clientData?.accountType || loggedInUser?.accountType || ""
      }));

      // Update AntD form values
      form.setFieldsValue({
        firstName: initialData?.firstName || clientData?.firstName || loggedInUser?.firstName || "",
        // ... set other fields similarly
      });
    }
  }, [clientData, initialData, loggedInUser, form]);

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
        navigate('/auth/login');
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
        navigate('/auth/login');
      } else {
        message.error(error.message || "Failed to update company");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-job-form">
      <AntForm form={form}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <hr style={{ marginBottom: "10px", border: "1px solid #e8e8e8" }} />
              <Row gutter={16}>
                <Col span={12} className="">
                  <div className="form-item ">
                    <label className="font-semibold ">First Name <span className="text-red-500">*</span></label>
                    <Field name="firstName" as={Input} placeholder="Enter First Name" className="mt-1" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="">
                  <div className="form-item">
                    <label className="font-semibold">Last Name <span className="text-red-500">*</span></label>
                    <Field name="lastName" as={Input} placeholder="Enter Last Name" className="mt-1" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                    <Field name="phone" as={Input} placeholder="Enter Phone" className="mt-1" />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                    <Field name="bankname" as={Input} placeholder="Enter  Bank Name" className="mt-1" />
                    <ErrorMessage
                      name="bankname"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Ifsc <span className="text-red-500">*</span></label>
                    <Field name="ifsc" as={Input} placeholder="Enter  Ifsc" type="string" className="mt-1" />
                    <ErrorMessage
                      name="ifsc"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Bank Location <span className="text-red-500">*</span></label>
                    <Field name="banklocation" as={Input} placeholder="Enter  Bank Location" className="mt-1" />
                    <ErrorMessage
                      name="banklocation"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Account Holder <span className="text-red-500">*</span></label>
                    <Field name="accountholder" as={Input} placeholder="Enter  Account Holder" className="mt-1" />
                    <ErrorMessage
                      name="accountholder"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                    <Field name="accountnumber" as={Input} placeholder="Enter  Account Number" type="number" className="mt-1" />
                    <ErrorMessage
                      name="accountnumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">GstIn <span className="text-red-500">*</span></label>
                    <Field name="gstIn" as={Input} placeholder="Enter  GstIn" className="mt-1" />
                    <ErrorMessage
                      name="gstIn"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">City <span className="text-red-500">*</span></label>
                    <Field name="city" as={Input} placeholder="Enter  City" className="mt-1" />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">State <span className="text-red-500">*</span></label>
                    <Field name="state" as={Input} placeholder="Enter  State" className="mt-1" />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Country <span className="text-red-500">*</span></label>
                    <Field name="country" as={Input} placeholder="Enter  Country" className="mt-1" />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Zipcode <span className="text-red-500">*</span></label>
                    <Field name="zipcode" as={Input} placeholder="Enter  Zipcode" type="string" className="mt-1" />
                    <ErrorMessage
                      name="zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                    <Field name="address" as={Input} placeholder="Enter  address" className="mt-1" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold ">Website <span className="text-red-500">*</span></label>
                    <Field name="website" as={Input} placeholder="Enter  Website" className="mt-2" />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Account Type <span className="text-red-500">*</span></label>
                    <Field name="accountType" as={Select} placeholder="Select Account Type" className="w-full rounded-md border-gray-300  focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <Option value="current">Current</Option>
                      <Option value="saving">Saving</Option>
                      <Option value="business">Business</Option>
                    </Field>
                    <ErrorMessage
                      name="accountType"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-3">
                  <div className="flex flex-col gap-3">
                    <label className="font-semibold text-gray-700">Profile Picture <span className="text-red-500">*</span></label>
                    <Field name="profilePic">
                      {({ field, form }) => (
                        <Upload
                          accept="image/*"
                          beforeUpload={(file) => {
                            form.setFieldValue('profilePic', file);
                            return false;
                          }}
                          showUploadList={true}
                        >
                          <Button icon={<UploadOutlined />} className="flex items-center gap-2">
                            Upload Profile Picture
                          </Button>
                        </Upload>
                      )}
                    </Field>
                    <ErrorMessage
                      name="profilePic"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </Col>
              </Row>
              <div className="form-buttons text-right mt-2">
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
      </AntForm>
    </div>
  );
};

export default EditCompany;
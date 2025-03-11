import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { ClientData, Editclients } from "./CompanyReducers/CompanySlice";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";

const { Option } = Select;

const EditCompany = ({ comnyid, onClose }) => {
  const dispatch = useDispatch();
  const countries = useSelector((state) => state.countries.countries);
  const [fileList, setFileList] = useState([]);
  const [existingProfilePic, setExistingProfilePic] = useState(null);

  useEffect(() => {
    dispatch(ClientData());
    dispatch(getallcountries());
  }, [dispatch]);

  const alldatas = useSelector((state) => state.ClientData.ClientData.data);

  const loggedInUser = alldatas?.find((item) => item?.id === comnyid);

  useEffect(() => {
    if (loggedInUser?.profilePic) {
      setExistingProfilePic(loggedInUser.profilePic);
      setFileList([{
        uid: '-1',
        name: 'Profile Picture',
        status: 'done',
        url: loggedInUser.profilePic,
      }]);
    }
  }, [loggedInUser]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneCode: '',
      phone: '',
      website: '',
      address: '',
      gstIn: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      accountholder: '',
      accountnumber: '',
      bankname: '',
      ifsc: '',
      banklocation: '',
      accounttype: '',
    },
    enableReinitialize: true,
    onSubmit: values => {
      const formData = new FormData();

      // Add all form values except profilePic
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      // Handle profile picture
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          // New file uploaded
          formData.append('profilePic', fileList[0].originFileObj);
        } else if (fileList[0].url) {
          // Using existing profile picture
          formData.append('profilePic', existingProfilePic);
        }
      } else if (existingProfilePic) {
        // No new file, but have existing picture
        formData.append('profilePic', existingProfilePic);
      }

      dispatch(Editclients({ comnyid, formData }))
        .then((response) => {
          if (response.payload?.success || response.payload?.status === 200) {
            message.success('Company updated successfully');
            dispatch(ClientData());
            onClose();
          } else {
            message.error(response.payload?.message || 'Failed to update company');
          }
        })
        .catch((error) => {
          console.error('Update error:', error);
          message.error('Failed to update company');
        });
    },
  });

  useEffect(() => {
    if (loggedInUser && formik) {
      const newValues = {
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        phoneCode: loggedInUser.phoneCode || '',
        phone: loggedInUser.phone || '',
        website: loggedInUser.website || '',
        address: loggedInUser.address || '',
        gstIn: loggedInUser.gstIn || '',
        city: loggedInUser.city || '',
        state: loggedInUser.state || '',
        country: loggedInUser.country || '',
        zipcode: loggedInUser.zipcode || '',
        accountholder: loggedInUser.accountholder || '',
        accountnumber: loggedInUser.accountnumber || '',
        bankname: loggedInUser.bankname || '',
        ifsc: loggedInUser.ifsc || '',
        banklocation: loggedInUser.banklocation || '',
        accounttype: loggedInUser.accounttype || '',
      };

      if (JSON.stringify(newValues) !== JSON.stringify(formik.values)) {
        formik.setValues(newValues);
      }
    }
  }, [loggedInUser, formik]);

  const uploadProps = {
    beforeUpload: file => {
      const isValid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isValid) {
        message.error('Please upload JPG/PNG/WEBP file');
        return false;
      }

      if (!isLt2M) {
        message.error('Image must be smaller than 2MB');
        return false;
      }

      setFileList([{
        originFileObj: file,
        uid: '-1',
        name: file.name,
        status: 'done',
        url: URL.createObjectURL(file)
      }]);
      return false;
    },
    onRemove: () => {
      if (existingProfilePic) {
        // If removing uploaded file, revert to existing profile pic
        setFileList([{
          uid: '-1',
          name: 'Profile Picture',
          status: 'done',
          url: existingProfilePic
        }]);
      } else {
        setFileList([]);
      }
      return true;
    },
    fileList
  };

  return (
    <div className="edit-company-modal">
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
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
                  <Input
                    name="firstName"
                    placeholder="Enter First Name"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="text-red-500">{formik.errors.firstName}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Enter Last Name"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="text-red-500">{formik.errors.lastName}</div>
                  ) : null}
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
                      name="phoneCode"
                      style={{ width: '30%' }}
                      placeholder="Code"
                      defaultValue="91"
                      className="rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                      onChange={value => formik.setFieldValue('phoneCode', value)}
                      onBlur={() => formik.setFieldTouched('phoneCode', true)}
                      value={formik.values.phoneCode}
                    >
                      {countries && countries.length > 0 ? (
                        countries.map((country) => (
                          <Option key={country.id} value={country.phoneCode}>
                            {country.phoneCode}
                          </Option>
                        ))
                      ) : (
                        <Option value="91">+91</Option>
                      )}
                    </Select>
                    <Input
                      name="phone"
                      style={{ width: '70%' }}
                      placeholder="Enter phone number"
                      className="rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500">{formik.errors.phone}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="website"
                    placeholder="Enter Website"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.website}
                  />
                  {formik.touched.website && formik.errors.website ? (
                    <div className="text-red-500">{formik.errors.website}</div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    placeholder="Enter Address"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-500">{formik.errors.address}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="gstIn"
                    placeholder="Enter GST Number"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gstIn}
                  />
                  {formik.touched.gstIn && formik.errors.gstIn ? (
                    <div className="text-red-500">{formik.errors.gstIn}</div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    placeholder="Enter City"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <div className="text-red-500">{formik.errors.city}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={6}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="state"
                    placeholder="Enter State"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.state}
                  />
                  {formik.touched.state && formik.errors.state ? (
                    <div className="text-red-500">{formik.errors.state}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={6}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="country"
                    placeholder="Enter Country"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                  />
                  {formik.touched.country && formik.errors.country ? (
                    <div className="text-red-500">{formik.errors.country}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={6}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zipcode <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="zipcode"
                    placeholder="Enter Zipcode"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.zipcode}
                  />
                  {formik.touched.zipcode && formik.errors.zipcode ? (
                    <div className="text-red-500">{formik.errors.zipcode}</div>
                  ) : null}
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
                  <Input
                    name="accountholder"
                    placeholder="Enter Account Holder Name"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.accountholder}
                  />
                  {formik.touched.accountholder && formik.errors.accountholder ? (
                    <div className="text-red-500">{formik.errors.accountholder}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="accountnumber"
                    placeholder="Enter Account Number"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.accountnumber}
                  />
                  {formik.touched.accountnumber && formik.errors.accountnumber ? (
                    <div className="text-red-500">{formik.errors.accountnumber}</div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="bankname"
                    placeholder="Enter Bank Name"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bankname}
                  />
                  {formik.touched.bankname && formik.errors.bankname ? (
                    <div className="text-red-500">{formik.errors.bankname}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={8}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="ifsc"
                    placeholder="Enter IFSC Code"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ifsc}
                  />
                  {formik.touched.ifsc && formik.errors.ifsc ? (
                    <div className="text-red-500">{formik.errors.ifsc}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={8}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="banklocation"
                    placeholder="Enter Bank Location"
                    className="w-full rounded-lg border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.banklocation}
                  />
                  {formik.touched.banklocation && formik.errors.banklocation ? (
                    <div className="text-red-500">{formik.errors.banklocation}</div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="accounttype"
                    className="w-full rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                    onChange={value => formik.setFieldValue('accounttype', value)}
                    onBlur={() => formik.setFieldTouched('accounttype', true)}
                    value={formik.values.accounttype}
                  >
                    <Option value="current">Current</Option>
                    <Option value="saving">Saving</Option>
                    <Option value="business">Business</Option>
                  </Select>
                  {formik.touched.accounttype && formik.errors.accounttype ? (
                    <div className="text-red-500">{formik.errors.accounttype}</div>
                  ) : null}
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <Upload
                    {...uploadProps}
                    accept="image/*"
                    showUploadList={true}
                    className="mt-1"
                  >
                    <Button icon={<UploadOutlined />} className="mt-1">
                      Upload Profile Picture
                    </Button>
                  </Upload>
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
        </form>
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
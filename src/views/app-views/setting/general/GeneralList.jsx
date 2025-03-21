import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Upload, message, Row, Col, Avatar, Input } from 'antd';
import { DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { creategenaralsett, deletesettingss, getgeneralsettings } from './generalReducer/generalSlice';
import { useDispatch, useSelector } from 'react-redux';
import EditSetting from './EditSetting';

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  title: Yup.string().required('Site title is required'),
  description: Yup.string().required('Description is required'),
});

const GeneralList = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFavicon, setSelectedFavicon] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSettingId, setSelectedSettingId] = useState(null);
  const dispatch = useDispatch();

  const initialValues = {
    companyName: '',
    title: '',
    description: '',
  };

  useEffect(() => {
    dispatch(getgeneralsettings())
  }, [dispatch])

  const alldata = useSelector((state) => state.generalsetting.generalsetting.data);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (selectedFile) {
        formData.append('companylogo', selectedFile);
      }
      if (selectedFavicon) {
        formData.append('favicon', selectedFavicon);
      }
      formData.append('companyName', values.companyName);
      formData.append('title', values.title);
      formData.append('termsandconditions', values.description);

      await dispatch(creategenaralsett(formData));
      await dispatch(getgeneralsettings());
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleFileChange = (info, type) => {
    const file = info.file;
    if (file) {
      if (type === 'logo') {
        setSelectedFile(file);
      } else if (type === 'favicon') {
        setSelectedFavicon(file);
      }
      message.success(`${file.name} selected successfully`);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deletesettingss(alldata[0].id));
      await dispatch(getgeneralsettings());
    } catch (error) {
      message.error('Failed to delete settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6">
      <Row gutter={[24, 0]} className="mb-6">
        <Col span={24}>
          <h1 className="text-2xl font-medium text-gray-800 border-b pb-4">
            General Settings
          </h1>
        </Col>
      </Row>

      {alldata && alldata.length > 0 ? (
        <div className="mb-6">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Current Settings</h2>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedSettingId(alldata[0].id);
                      setIsEditModalVisible(true);
                    }}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    onClick={handleDelete}
                    loading={loading}
                    className="px-4 py-1"
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-medium mb-2">Company Logo</h3>
                  <Avatar
                    size={100}
                    src={alldata[0].companylogo}
                    icon={!alldata[0].companylogo && <UserOutlined />}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Terms and Conditions</h3>
                  <div dangerouslySetInnerHTML={{ __html: alldata[0].termsandconditions }} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, isSubmitting, errors, touched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Card className="mb-4">
              <Row gutter={[24, 24]}>
                {/* Company Name */}
                <Col span={12}>
                  <div className="form-item">
                    <label className="block  font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="companyName"
                      as={Input}
                      placeholder="Enter company name"
                      className="w-full"
                    />
                    {errors.companyName && touched.companyName && (
                      <div className="text-red-500 text-sm mt-1">{errors.companyName}</div>
                    )}
                  </div>
                </Col>

                {/* Site Title */}
                <Col span={12}>
                  <div className="form-item">
                    <label className="block  font-medium text-gray-700 mb-2">
                      Site Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="title"
                      as={Input}
                      placeholder="Enter site title"
                      className="w-full"
                    />
                    {errors.title && touched.title && (
                      <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                    )}
                  </div>
                </Col>

                {/* Company Logo */}
                <Col span={12}>
                  <div className="form-item">
                    <label className="block  font-medium text-gray-700 mb-2">
                      Company Logo <span className="text-red-500">*</span>
                    </label>
                    <Upload
                      accept="image/*"
                      beforeUpload={(file) => {
                        handleFileChange({ file }, 'logo');
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                    {selectedFile && <p className="mt-2 text-sm text-gray-500">{selectedFile.name}</p>}
                  </div>
                </Col>

                {/* Favicon */}
                <Col span={12}>
                  <div className="form-item">
                    <label className="block  font-medium text-gray-700 mb-2">
                      Favicon Icon <span className="text-red-500">*</span>
                    </label>
                    <Upload
                      accept=".ico,.png"
                      beforeUpload={(file) => {
                        handleFileChange({ file }, 'favicon');
                        return false;
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload Favicon</Button>
                    </Upload>
                    {selectedFavicon && <p className="mt-2 text-sm text-gray-500">{selectedFavicon.name}</p>}
                  </div>
                </Col>

                {/* Description */}
                <Col span={24}>
                  <div className="form-item">
                    <label className="block  font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={values.description}
                      onChange={(content) => setFieldValue('description', content)}
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Buttons */}
            <Row>
              <Col span={24}>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="default"
                    className="px-6 py-2 hover:bg-gray-50"
                    onClick={() => window.location.reload()}
                  >
                    Discard
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>}

      <EditSetting
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        settingId={selectedSettingId}
        onSuccess={() => {
          setIsEditModalVisible(false);
          dispatch(getgeneralsettings());
        }}
      />

    </div>
  );
};

export default GeneralList; 
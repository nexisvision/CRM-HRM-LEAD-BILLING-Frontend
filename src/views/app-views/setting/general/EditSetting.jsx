import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { updategeneralsetting } from './generalReducer/generalSlice';

const EditSetting = ({ visible, onCancel, settingId, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFavicon, setSelectedFavicon] = useState(null);
  const dispatch = useDispatch();

  const alldata = useSelector((state) => state.generalsetting.generalsetting.data);
  const currentSetting = alldata?.find(setting => setting.id === settingId);

  useEffect(() => {
    if (currentSetting) {
      form.setFieldsValue({
        companyName: currentSetting.companyName,
        title: currentSetting.title,
        description: currentSetting.termsandconditions,
      });
    }
  }, [currentSetting, form]);

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

  const handleSubmit = async (values) => {
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

      await dispatch(updategeneralsetting({ id: settingId, data: formData }));
      message.success('Settings updated successfully');
      onSuccess();
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit General Settings"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="title"
          label="Site Title"
          rules={[{ required: true, message: 'Please enter site title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Company Logo"
        >
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
        </Form.Item>

        <Form.Item
          label="Favicon"
        >
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
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <ReactQuill
            theme="snow"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]
            }}
          />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSetting; 
import React, { useEffect } from "react";
import { Row, Col, Button, Select, Input } from "antd";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { Edituser, GetUsers } from "../UserReducers/UserSlice";
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import Upload from "antd/es/upload/Upload";
import { message } from "antd";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phone: Yup.string().required('Phone number is required'),
  role_id: Yup.string().required('Role is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipcode: Yup.string().required('Zipcode is required'),
});

const EditUser = ({ idd, onClose, onUpdate }) => {
  const dispatch = useDispatch();

  const getalllrole = useSelector((state) => state.role);
  const fnddata = getalllrole.role?.data || [];
  const loggeduser = useSelector((state) => state?.user?.loggedInUser?.username);
  const rolefnd = fnddata?.filter((item) => item?.created_by === loggeduser) || [];
  const Getalluser = useSelector((state) => state.Users);
  const fnduset = Getalluser.Users?.data || [];

  useEffect(() => {
    dispatch(roledata());
    dispatch(GetUsers());
  }, [dispatch]);

  const finddata = fnduset.find((item) => item.id === idd);
  const fndroleee = fnddata.find((item) => item.id === finddata?.role_id);

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    // Generate 6 characters
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Ensure at least one number
    const randomNum = Math.floor(Math.random() * 10).toString();
    password = password.slice(0, 7) + randomNum;

    return password;
  };

  const initialValues = {
    username: finddata?.username || '',
    firstName: finddata?.firstName || '',
    lastName: finddata?.lastName || '',
    phone: finddata?.phone || '',
    role_id: fndroleee?.id || '',
    password: '',
    address: finddata?.address || '',
    city: finddata?.city || '',
    state: finddata?.state || '',
    country: finddata?.country || '',
    zipcode: finddata?.zipcode || '',
    profilePic: finddata?.profilePic || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      
      formData.append('username', values.username);
      
      Object.keys(values).forEach(key => {
        if (key !== 'profilePic' && key !== 'username') {
          formData.append(key, values[key]);
        }
      });

      if (values.profilePic && values.profilePic instanceof File) {
        formData.append('profilePic', values.profilePic);
      }

      await dispatch(Edituser({ idd, values: formData }));
      dispatch(GetUsers());
      onClose();
      onUpdate(values);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (file, setFieldValue) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }

    setFieldValue('profilePic', file);
    return false;
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="space-y-4" encType="multipart/form-data">
            <div className="mb-6 border-b pb-2">
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Profile Picture</label>
                  <div className="mt-2">
                    <Upload
                      name="profilePic"
                      listType="picture"
                      maxCount={1}
                      beforeUpload={(file) => handleFileUpload(file, setFieldValue)}
                      onRemove={() => setFieldValue('profilePic', '')}
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                        showDownloadIcon: false
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                    </Upload>
                    {values.profilePic && typeof values.profilePic === 'string' && (
                      <div className="mt-2">
                        <img
                          src={values.profilePic}
                          alt="Current profile"
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="profilePic" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">First Name <span className="text-red-500">*</span></label>
                  <Field
                    name="firstName"
                    as={Input}
                    placeholder="Enter First Name"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Last Name <span className="text-red-500">*</span></label>
                  <Field
                    name="lastName"
                    as={Input}
                    placeholder="Enter Last Name"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                  <Field
                    name="phone"
                    as={Input}
                    placeholder="Enter Phone"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>
            </Row>

            <div className="mb-6 border-b pb-2 mt-6">
              <h3 className="text-lg font-semibold">Address Information</h3>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                  <Field
                    name="address"
                    as={Input.TextArea}
                    placeholder="Enter Address"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">City <span className="text-red-500">*</span></label>
                  <Field
                    name="city"
                    as={Input}
                    placeholder="Enter City"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="city" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">State <span className="text-red-500">*</span></label>
                  <Field
                    name="state"
                    as={Input}
                    placeholder="Enter State"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="state" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Country <span className="text-red-500">*</span></label>
                  <Field
                    name="country"
                    as={Input}
                    placeholder="Enter Country"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="country" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Zipcode <span className="text-red-500">*</span></label>
                  <Field
                    name="zipcode"
                    as={Input}
                    placeholder="Enter Zipcode"
                    className="w-full mt-2"
                  />
                  <ErrorMessage name="zipcode" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>
            </Row>

            <div className="mb-6 border-b pb-2 mt-6">
              <h3 className="text-lg font-semibold">Account Information</h3>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Role <span className="text-red-500">*</span></label>
                  <Select
                    className="w-full mt-2"
                    placeholder="Select Role"
                    value={values.role_id}
                    onChange={(value) => setFieldValue('role_id', value)}
                  >
                    {rolefnd.map((tag) => (
                      <Option key={tag?.id} value={tag?.id}>
                        {tag?.role_name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="role_id" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Password</label>
                  <div className="relative">
                    <Field
                      name="password"
                      as={Input.Password}
                      placeholder="Leave blank to keep current password"
                      className="w-full mt-2"
                    />
                    <Button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setFieldValue("password", generatePassword())}
                      icon={<ReloadOutlined />}
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUser;

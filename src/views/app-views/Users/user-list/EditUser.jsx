import React, { useEffect } from "react";
import { Row, Col, Button, Select, Input } from "antd";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { Edituser, GetUsers } from "../UserReducers/UserSlice";
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import { ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  role_id: Yup.string()
    .required('Role is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
});

const EditUser = ({ idd, visible, onClose, onUpdate }) => {
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
    role_id: fndroleee?.id || '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        username: values.username,
        role_id: values.role_id,
        ...(values.password && { password: values.password })
      };

      await dispatch(Edituser({ idd, values: updateData }));
      dispatch(GetUsers());
      onClose();
      onUpdate(updateData);
      dispatch(GetUsers());
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div className="mb-3 border-b pb-[-10px] font-medium"></div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="space-y-2">
                  <div className="form-item">
                    <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                    <Field
                      name="username"
                      as={Input}
                      placeholder="Enter Name"
                      className="w-full mt-2"
                      rules={[{ required: true }]}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Select Role"
                    value={values.role_id}
                    onChange={(value) => setFieldValue('role_id', value)}
                    status={errors.role_id && touched.role_id ? 'error' : ''}
                  >
                    {rolefnd.map((tag) => (
                      <Option key={tag?.id} value={tag?.id}>
                        {tag?.role_name}
                      </Option>
                    ))}
                  </Select>
                  {errors.role_id && touched.role_id && (
                    <div className="text-red-500 text-sm mt-1">{errors.role_id}</div>
                  )}
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-4">
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Password</label>
                  <div className="relative">
                    <Field
                      name="password"
                      as={Input.Password}
                      placeholder="Leave blank to keep current password"
                      className="mt-1 w-full"
                    />
                    <Button
                      className="absolute right-5 top-1/2 border-0 bg-transparent ring-0 hover:none -translate-y-1/2 flex items-center z-10"
                      onClick={() => setFieldValue("password", generatePassword())}
                    >
                      <ReloadOutlined />
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
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

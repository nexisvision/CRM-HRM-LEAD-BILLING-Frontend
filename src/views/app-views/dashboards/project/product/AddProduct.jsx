import React, { useState, useEffect } from "react";
import { Input, Button, Select, message, Row, Col, Modal, Upload } from "antd";
import { PlusOutlined, UploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { AddProdu, GetProdu } from "./ProductReducer/ProductsSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddLable, GetLable } from "../../sales/LableReducer/LableSlice";

const { Option } = Select;

const AddProduct = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const AllLoggedData = useSelector((state) => state?.user);
  const lid = AllLoggedData?.loggedInUser?.id;
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(getcurren());
    fetchLables();
  }, [dispatch]);

  const fetchLables = async () => {
    try {
      const response = await dispatch(GetLable(lid));
      if (response?.payload?.data) {
        const uniqueCategories = response?.payload?.data
          .filter((label) => label && label?.name)
          .map((label) => ({
            id: label?.id,
            name: label?.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t?.name === label?.name)
          );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to load categories");
    }
  };

  const handleAddNewCategory = async (setFieldValue) => {
    if (!newCategory.trim()) {
      message.error("Please enter a category name");
      return;
    }

    try {
      const payload = { name: newCategory.trim(), labelType: "status" };
      const response = await dispatch(AddLable({ lid, payload }));
      
      if (response.payload && response.payload.success) {
        message.success("Category added successfully");
        
        // Fetch updated categories immediately
        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLabels = labelsResponse.payload.data
            .filter((label) => label && label?.name)
            .map((label) => ({
              id: label?.id,
              name: label?.name.trim(),
            }))
            .filter(
              (label, index, self) =>
                index === self.findIndex((t) => t?.name === label?.name)
            );
          
          setCategories(filteredLabels);
          if (setFieldValue) {
            setFieldValue("category", newCategory.trim());
          }
        }
        
        setNewCategory("");
        setIsCategoryModalVisible(false);
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      message.error("Failed to add category");
    }
  };

  const initialValues = {
    name: "",
    price: "",
    category: "",
    sku: "",
    hsn_sac: "",
    description: "",
    image: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name."),
    price: Yup.number()
      .required("Please enter Price.")
      .positive("Price must be positive")
      .typeError("Price must be a number"),
    category: Yup.string().required("Please select Category."),
    sku: Yup.string()
      .required("Please enter SKU.")
      .matches(/^\d{6,8}$/, "SKU must be between 6 to 8 digits"),
    hsn_sac: Yup.string()
      .required("Please enter HSN/SAC.")
      .matches(/^\d{6,8}$/, "HSN/SAC must be between 6 to 8 digits"),
    description: Yup.string().required("Please enter Description."),
  });

  const onSubmit = (values, { resetForm }) => {
    if (fileList.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    
    Object.keys(values).forEach(key => {
      if (key !== 'image') {
        formData.append(key, values[key]);
      }
    });

    if (fileList[0]?.originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    dispatch(AddProdu({ id, formData })).then(() => {
      dispatch(GetProdu(id));
      resetForm();
      setFileList([]); // Reset file list
      onClose();
    });
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
};

  const CustomInput = ({ field, form, ...props }) => <Input {...field} {...props} />;

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik initialValues={initialValues} 
      validationSchema={validationSchema}
       onSubmit={onSubmit}>
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <>
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Name <span className="text-red-500">*</span> </label>
                    <Field
                      className="mt-1"
                      name="name"
                      as={Input}
                      placeholder="Enter Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Price <span className="text-red-500">*</span></label>
                    <Field
                      className="mt-1"
                      type="number"
                      name="price"
                      as={Input}
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
                  <div className="form-item mt-2">
                    <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      className="mt-1"
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
                      name="category"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">SKU <span className="text-red-500">*</span></label>
                    <Field 
                      className="mt-2" 
                      name="sku" 
                      as={CustomInput} 
                      placeholder="Enter SKU"
                      validate={(value) => {
                        if (!value) {
                          return 'SKU is required';
                        }
                        if (!/^\d{6,8}$/.test(value)) {
                          return 'SKU must be between 6 to 8 digits';
                        }
                      }}
                    />
                    <ErrorMessage name="sku" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">HSN/SAC <span className="text-red-500">*</span></label>
                    <Field 
                      className="mt-2" 
                      name="hsn_sac" 
                      as={CustomInput} 
                      placeholder="Enter HSN/SAC"
                      validate={(value) => {
                        if (!value) {
                          return 'HSN/SAC is required';
                        }
                        if (!/^\d{6,8}$/.test(value)) {
                          return 'HSN/SAC must be between 6 to 8 digits';
                        }
                      }}
                    />
                    <ErrorMessage name="hsn_sac" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>
                <Col span={24} className="mt-4">
                  <div className="form-item">
                      <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                    <ReactQuill
                      className="mt-1"
                      value={values.description}
                      onChange={(value) => setFieldValue("description", value)}
                      placeholder="Enter Description"
                      onBlur={() => setFieldTouched("description", true)}
                    />
                    <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                  </div>
                </Col>

<div className="mt-4 w-full">
                  <span className="block font-semibold p-2">Product Image</span>
                  <Col span={24}>
                    <Upload
                      beforeUpload={() => false} // Prevent auto upload
                      listType="picture"
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxCount={1}
                      fileList={fileList}
                      onChange={handleFileChange}
                      showUploadList={{ 
                        showRemoveIcon: true,
                        showPreviewIcon: true,
                        className: "upload-list-inline"
                      }}
                      className="border-2 flex flex-col justify-center items-center p-10"
                    >
                      <Button icon={<UploadOutlined />}>Choose File</Button>
                    </Upload>
                  </Col>
                </div>
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

            {/* Add Category Modal */}
            <Modal
              title="Add New Category"
              open={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() => handleAddNewCategory(setFieldValue)}
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Upload,
  Modal,
  Space,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { EditProdu, GetProdu } from "./ProductReducer/ProductsSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddLable, GetLable } from "../../sales/LableReducer/LableSlice";

const { Option } = Select;

const EditProduct = ({ idd, onClose }) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const CustomInput = ({ field, form, ...props }) => <Input {...field} {...props} />;
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const AllLoggedData = useSelector((state) => state.user);
  const [fileList, setFileList] = useState([]);
  const fetchLables = React.useCallback(async (lableType, setter) => {
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
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLables("category", setCategories);
  }, [fetchLables]);

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      message.error("Please enter a category name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newCategory.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Category added successfully");
      setNewCategory("");
      setIsCategoryModalVisible(false);

      await fetchLables();
    } catch (error) {
      console.error("Failed to add Category:", error);
      message.error("Failed to add Category");
    }
  };


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
    price: "",
    category: "",
    sku: "",
    hsn_sac: "",
    description: "",
  });

  const allempdata = useSelector((state) => state.Product);
  const milestones = allempdata.Product.data;

  useEffect(() => {
    if (idd) {
      const milestone = milestones.find((item) => item.id === idd);

      if (milestone) {
        setInitialValues({
          id: milestone.id,
          name: milestone.name || "",
          price: milestone.price || "",
          category: milestone.category || "",
          sku: milestone.sku || "",
          hsn_sac: milestone.hsn_sac || "",
          description: milestone.description || "",
        });
      } else {
        message.error("Product not found!");
      }
    }
  }, [idd, milestones]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name."),
    price: Yup.number().required("Please enter Price."),
    category: Yup.string().required("Please enter Category."),
    sku: Yup.string().optional("Please enter Sku."),
    hsn_sac: Yup.string().optional("Please enter Hsn/Sac."),
    description: Yup.string().optional("Please enter Description."),
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

    dispatch(EditProdu({ idd, formData })).then(() => {
      dispatch(GetProdu(id));
      onClose();
    });
  };

  return (
    <div className="add-expenses-form">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true} // Ensure form is reinitialized when initialValues change
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Name <span className="text-red-500">*</span></label>
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
                <div className="form-item">
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
                    name="project_category"
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
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Description"
                    onBlur={() => setFieldTouched("description", true)}
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
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

              <Row justify="end" className="mt-6">
                <Col>
                  <Space>
                    <Button
                      onClick={onClose}
                      className="px-4"
                      style={{
                        borderRadius: '6px',
                        color: '#666666',
                        borderColor: '#d9d9d9',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="px-4"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: '#3366FF'
                      }}
                    >
                      Update
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Row>
          </Form>
        )}
      </Formik>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewCategory("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

    </div>
  );
};

export default EditProduct;

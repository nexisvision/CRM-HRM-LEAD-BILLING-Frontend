import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Modal,
} from "antd";
import { CloudUploadOutlined, QuestionCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { AddProdu, GetProdu } from "./ProductReducer/ProductsSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddLable, GetLable } from "../../sales/LableReducer/LableSlice";

const { Option } = Select;

const AddProduct = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  // category start
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);

  const lid = AllLoggedData.loggedInUser.id;

  const fetchLables = async (lableType, setter) => {
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
  };

  useEffect(() => {
    fetchLables("category", setCategories);
  }, []);

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

      // Fetch updated categories
      await fetchLables();
    } catch (error) {
      console.error("Failed to add Category:", error);
      message.error("Failed to add Category");
    }
  };

  // category end

  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);
  // const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const initialValues = {
    name: "",
    price: "",
    category: "",
    sku: "",
    hsn_sac: "",
    description: "",
    // files: '',
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name."),
    price: Yup.number().required("Please enter Price."),
    category: Yup.string().required("Please enter Category."),
    sku: Yup.string().required("Please enter Sku."),
    hsn_sac: Yup.string().required("Please enter Hsn/Sac."),
    description: Yup.string().required("Please enter Description."),
    // files: Yup.string().required('Please enter Files.'),
  });
  const onSubmit = (values, { resetForm }) => {
    dispatch(AddProdu({ id, values }))
      .then(() => {
        dispatch(GetProdu(id))
          .then(() => {
            // message.success("Project added successfully!");
            resetForm();
            onClose();
          })
          .catch((error) => {
            // message.error("Failed to fetch the latest meeting data.");
            console.error("MeetData API error:", error);
          });
      })
      .catch((error) => {
        message.error("Failed to add meeting.");
        console.error("AddMeet API error:", error);
      });
  };
  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Name</label>
                  <Field
                    className="mt-2"
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
                  <label className="font-semibold">Price</label>
                  <Field
                    className="mt-2"
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
                  <label className="font-semibold">Category</label>
                  <Select
                    style={{ width: "100%" }}
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
                  <label className="font-semibold">Sku</label>
                  <Field
                    className="mt-2"
                    name="sku"
                    as={Input}
                    placeholder="Enter Sku"
                  />
                  <ErrorMessage
                    name="sku"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Hsn/Sac </label>
                  <Field
                    className="mt-2"
                    name="hsn_sac"
                    as={Input}
                    placeholder="Enter Hsn/Sac"
                  />
                  <ErrorMessage
                    name="hsn_sac"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
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
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <div className="mt-4 w-full">
                <span className="block  font-semibold p-2">
                  Add <QuestionCircleOutlined />
                </span>
                <Col span={24} className="mt-2">
                  <Upload
                    name="files"
                    action="http://localhost:5500/api/users/upload-cv"
                    listType="picture"
                    accept=".pdf"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    className="border-2 flex justify-center items-center p-10 "
                  >
                    <CloudUploadOutlined className="text-4xl" />
                    <span className="text-xl">Choose File</span>
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
export default AddProduct;

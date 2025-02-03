// import React, { useState, useEffect } from "react";
// import {
//   Input,
//   Button,
//   DatePicker,
//   Select,
//   message,
//   Row,
//   Col,
//   Switch,
//   Upload,
//   Modal,
// } from "antd";
// import { CloudUploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useSelector, useDispatch } from "react-redux";
// import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";

// const { Option } = Select;

// const EditProduct = ({ idd, onClose }) => {
//   const navigate = useNavigate();
//   const [showReceiptUpload, setShowReceiptUpload] = useState(false);

//   const { currencies } = useSelector((state) => state.currencies);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getallcurrencies());
//   }, [dispatch]);
//   // const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [initialValues, setInitialValues] = useState({
//     name: "",
//     price: "",
//     category: "",
//     sku: "",
//     hsn_sac: "",
//     description: "",
//     // files: '',
//   });

//   const allempdata = useSelector((state) => state.Product);
//   const milestones = allempdata.Product.data;

//   useEffect(() => {
//     const milestone = milestones.find((item) => item.id === idd);

//     console.log("qwqwqwqwwq", milestone);
//     if (milestone) {
//       setInitialValues({
//         id: milestone.id, // Include ID for update
//         name: milestone.name || "",
//         price: milestone.price || "",
//         category: milestone.category || "",
//         sku: milestone.sku || "",
//         hsn_sac: milestone.hsn_sac || "",
//         description: milestone.description || "",
//       });
//     } else {
//       message.error("Milestone not found!");
//     }
//   }, [idd, milestones]);
//   const validationSchema = Yup.object({
//     name: Yup.string().required("Please enter Name."),
//     price: Yup.number().required("Please enter Price."),
//     category: Yup.string().required("Please enter Category."),
//     sku: Yup.string().required("Please enter Sku."),
//     hsn_sac: Yup.string().required("Please enter Hsn/Sac."),
//     description: Yup.string().required("Please enter Description."),
//     // files: Yup.string().required('Please enter Files.'),
//   });
//   const onSubmit = (values, { resetForm }) => {
//     console.log("Submitted values:", values);
//     message.success("Payment added successfully!");
//     resetForm();
//   };

//   return (
//     <div className="add-expenses-form">
//       <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form className="formik-form" onSubmit={handleSubmit}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Name</label>
//                   <Field
//                     className="mt-2"
//                     name="name"
//                     as={Input}
//                     placeholder="Enter Name"
//                   />
//                   <ErrorMessage
//                     name="name"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Price</label>
//                   <Field
//                     className="mt-2"
//                     type="number"
//                     name="price"
//                     as={Input}
//                     placeholder="Enter Price"
//                   />
//                   <ErrorMessage
//                     name="price"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Category</label>
//                   <Field name="category">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         placeholder="Select Category"
//                         className="w-full mt-2"
//                         onChange={(value) => setFieldValue("category", value)}
//                         value={values.category}
//                         onBlur={() => setFieldTouched("category", true)}
//                         allowClear={false}
//                       >
//                         <Option value="xyz">XYZ</Option>
//                         <Option value="abc">ABC</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage
//                     name="category"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Sku</label>
//                   <Field
//                     className="mt-2"
//                     name="sku"
//                     as={Input}
//                     placeholder="Enter Sku"
//                   />
//                   <ErrorMessage
//                     name="sku"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>
//               <Col span={12} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Hsn/Sac </label>
//                   <Field
//                     className="mt-2"
//                     name="hsn_sac"
//                     as={Input}
//                     placeholder="Enter Hsn/Sac"
//                   />
//                   <ErrorMessage
//                     name="hsn_sac"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               <Col span={24} className="mt-4">
//                 <div className="form-item">
//                   <label className="font-semibold">Description</label>
//                   <ReactQuill
//                     value={values.description}
//                     onChange={(value) => setFieldValue("description", value)}
//                     placeholder="Enter Description"
//                     onBlur={() => setFieldTouched("description", true)}
//                     className="mt-2"
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className="error-message text-red-500 my-1"
//                   />
//                 </div>
//               </Col>

//               {/* <div className='mt-4 w-full'>
//                                 <span className='block  font-semibold p-2'>Add <QuestionCircleOutlined /></span>
//                                 <Col span={24} className='mt-2'>
//                                     <Upload
//                                         name='files'
//                                         action="http://localhost:5500/api/users/upload-cv"
//                                         listType="picture"
//                                         accept=".pdf"
//                                         maxCount={1}
//                                         showUploadList={{ showRemoveIcon: true }}
//                                         className='border-2 flex justify-center items-center p-10 '
//                                     >
//                                         <CloudUploadOutlined className='text-4xl' />
//                                         <span className='text-xl'>Choose File</span>
//                                     </Upload>
//                                 </Col>
//                             </div> */}
//             </Row>
//             <div className="form-buttons text-right mt-4">
//               <Button type="default" className="mr-2" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };
// export default EditProduct;

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
import { EditProdu, GetProdu } from "./ProductReducer/ProductsSlice";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { AddLable, GetLable } from "../../sales/LableReducer/LableSlice";

const { Option } = Select;

const EditProduct = ({ idd, onClose }) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

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

  const { currencies } = useSelector((state) => state.currencies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  // Declare state for initial values
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
        // Set initial values only when milestone is found
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

  // Define validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter Name."),
    price: Yup.number().required("Please enter Price."),
    category: Yup.string().required("Please enter Category."),
    sku: Yup.string().required("Please enter Sku."),
    hsn_sac: Yup.string().required("Please enter Hsn/Sac."),
    description: Yup.string().required("Please enter Description."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(EditProdu({ idd, values }))
      .then(() => {
        dispatch(GetProdu(id));
        message.success("Product updated successfully!");
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
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

              <div className="form-buttons text-right mt-4">
                <Button type="default" className="mr-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </div>
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

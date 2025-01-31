import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Upload,
  Select,
  DatePicker,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  CloudUploadOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  FilterOutlined,
  EditOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useSelector, useDispatch } from "react-redux";
import { createquotations } from "./estimatesReducer/EstimatesSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";

import * as Yup from "yup";
import { AddLable, GetLable } from "../LableReducer/LableSlice";

const { Option } = Select;

const AddEstimates = ({ onClose }) => {
  const [discountType, setDiscountType] = useState("%");
   const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [newTag, setNewTag] = useState("");
  
    const [tags, setTags] = useState([]);
      const AllLoggeddtaa = useSelector((state) => state.user);
    
  const [loading, setLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountRate, setDiscountRate] = useState(10);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    totalTax: 0,
    finalTotal: 0,
  });


  
    useEffect(() => {
      dispatch(Getcus());
    }, []);
  
    const customerdata = useSelector((state) => state.customers);
    const fnddata = customerdata.customers.data;
  

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: "",
      tax: 0,
      amount: "0",
      description: "",
    },
  ]);

  const lid = AllLoggeddtaa.loggedInUser.id;


  const handleFinish = async (values) => {
    try {
      setLoading(true);
  
      const subTotal = calculateSubTotal();
      const totalTax = calculateTotalTax();
      const discount = (subTotal * discountRate) / 100;
      const totalAmount = subTotal - discount + totalTax;
  
      // Prepare the `items` field as an object
      const itemsObject = tableData.reduce((acc, item, index) => {
        acc[`item_${index + 1}`] = {
          description: item.item,
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          tax: parseFloat(item.tax) || 0,
          amount: parseFloat(item.amount) || 0,
        };
        return acc;
      }, {});
  
      // Check if the selected tag (category) exists
      const selectedTag = tags.find((tag) => tag.name === values.category);
  
      const prepareQuotationData = () => ({
        issueDate: values.issueDate.format("YYYY-MM-DD"), // Ensure date format
        customer: values.customer,
        category: values.category,
        items: itemsObject,
        discount: parseFloat(discount.toFixed(2)) || 0,
        tax: parseFloat(totalTax.toFixed(2)) || 0,
        total: parseFloat(totalAmount.toFixed(2)) || 0,
      });
  
      if (!selectedTag) {
        // If the tag (category) doesn't exist, add it first
        const newTagPayload = { name: values.category.trim() };
  
        await dispatch(AddLable({ lid, payload: newTagPayload }));
        message.success("Category added successfully!");
  
        // After adding the tag, create the quotation
        const quotationData = prepareQuotationData();
        await dispatch(createquotations(quotationData));
        message.success("Quotation created successfully!");
      } else {
        // If the tag exists, directly create the quotation
        const quotationData = prepareQuotationData();
        await dispatch(createquotations(quotationData));
        message.success("Quotation created successfully!");
      }
  
      // Close the modal and navigate after successful creation
      onClose();
      navigate("/app/dashboards/sales/estimates");
    } catch (error) {
      console.error("Estimate Creation Error:", error);
      message.error("Failed to create Quotation: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  


  const [rows, setRows] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: "",
      price: "",
      discount: "",
      tax: "",
      amount: "0",
      description: "",
      isNew: false,
    },
  ]);

  // Function to handle adding a new row
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        item: "",
        quantity: "",
        price: "",
        discount: "",
        tax: "",
        amount: "0",
        description: "",
        isNew: true,
      },
    ]);
  };

  // Delete row
  const handleDeleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    } else {
      message.warning("At least one item is required");
    }
  };

  const navigate = useNavigate();

  // Calculate discount amount
  const calculateDiscount = () => {
    const subTotal = calculateSubTotal();
    if (discountType === "%") {
      return (subTotal * (parseFloat(discountValue) || 0)) / 100;
    }
    return parseFloat(discountValue) || 0;
  };

  // Calculate total tax
  const calculateTotalTax = () => {
    const subTotal = calculateSubTotal();
    const discount = calculateDiscount();
    const taxableAmount =
      form.getFieldValue("calctax") === "before"
        ? subTotal
        : subTotal - discount;

    return tableData.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = parseFloat(row.tax) || 0;
      const rowAmount = quantity * price;
      return sum + rowAmount * (tax / 100);
    }, 0);
  };

  // Calculate subtotal (sum of all row amounts before discount)
  const calculateSubTotal = () => {
    return rows.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity || 0);
      const price = parseFloat(row.price || 0);
      return sum + quantity * price;
    }, 0);
  };

  const calculateTotal = (data, discountRate) => {
    let subtotal = 0;
    let totalTax = 0;

    data.forEach((row) => {
      const amount = row.quantity * row.price;
      const taxAmount = (amount * row.tax) / 100;

      row.amount = amount; // Update the row's amount
      subtotal += amount;
      totalTax += taxAmount;
    });

    const discount = (subtotal * discountRate) / 100;
    const finalTotal = subtotal - discount + totalTax;

    setTotals({ subtotal, discount, totalTax, finalTotal });
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]:
              field === "quantity" || field === "price" || field === "tax"
                ? parseFloat(value) || 0
                : value,
          }
        : row
    );

    setTableData(updatedData);
    calculateTotal(updatedData, discountRate); // Recalculate totals
  };


  
  
    const fetchTags = async () => {
      try {
        const lid = AllLoggeddtaa.loggedInUser.id;
        const response = await dispatch(GetLable(lid));
  
        if (response.payload && response.payload.data) {
          const uniqueTags = response.payload.data
            .filter((label) => label && label.name) // Filter out invalid labels
            .map((label) => ({
              id: label.id,
              name: label.name.trim(),
            }))
            .filter(
              (label, index, self) =>
                index === self.findIndex((t) => t.name === label.name)
            ); // Remove duplicates
  
          setTags(uniqueTags);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        message.error("Failed to load tags");
      }
    };
  
  
    const handleAddNewTag = async () => {
      if (!newTag.trim()) {
        message.error("Please enter a tag name");
        return;
      }
  
      try {
        const lid = AllLoggeddtaa.loggedInUser.id;
        const payload = {
          name: newTag.trim(),
          labelType: "status",
        };
  
        await dispatch(AddLable({ lid, payload }));
        message.success("Status added successfully");
        setNewTag("");
        setIsTagModalVisible(false);
  
        // Fetch updated tags
        await fetchTags();
      } catch (error) {
        console.error("Failed to add Status:", error);
        message.error("Failed to add Status");
      }
    };
  

  return (
    <>
      <div>
        <div className=" ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
          <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              loginEnabled: true,
            }}
          >
            {/* <Card className="border-0 mt-2"> */}
            <div className="">
              <div className=" p-2">
                <Row gutter={16}>
                  <Col span={24} className="mt-1">
                               <Form.Item
                                 label="Customer"
                                 name="customer"
                                 rules={[
                                   { required: true, message: "Please select a customer" },
                                 ]}
                               >
                                 <Select
                                   style={{ width: "100%" }}
                                   placeholder="Select Client"
                                   loading={!fnddata}
                                 >
                                   {fnddata && fnddata.length > 0 ? (
                                     fnddata.map((client) => (
                                       <Option key={client.id} value={client.id}>
                                         {client.name || "Unnamed Client"}
                                       </Option>
                                     ))
                                   ) : (
                                     <Option value="" disabled>
                                       No customers available
                                     </Option>
                                   )}
                                 </Select>
                               </Form.Item>
                             </Col>

                  <Col span={12}>
                    <Form.Item
                      name="issueDate"
                      label="Issue Date"
                      rules={[
                        { required: true, message: "Please select the date" },
                      ]}
                    >
                      <DatePicker className="w-full" format="DD-MM-YYYY" />
                    </Form.Item>
                  </Col>

                  
                              <Col span={12} className="">
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: "Please select or add a category" }]}
                    >
                      <Select
                        placeholder="Select or add new category"
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <div
                              style={{
                                padding: "8px",
                                borderTop: "1px solid #e8e8e8",
                              }}
                            >
                              <Button
                                type="link"
                                onClick={() => setIsTagModalVisible(true)}
                                block
                              >
                                Add New Category
                              </Button>
                            </div>
                          </div>
                        )}
                      >
                        {tags &&
                          tags.map((tag) => (
                            <Option key={tag.id} value={tag.name}>
                              {tag.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Description<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Quantity<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Unit Price <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        TAX (%)
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Amount<span className="text-red-500">*</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <React.Fragment key={row.id}>
                        <tr>
                          <td className="px-4 py-2 border-b">
                            <input
                              type="text"
                              value={row.item}
                              onChange={(e) =>
                                handleTableDataChange(
                                  row.id,
                                  "item",
                                  e.target.value
                                )
                              }
                              placeholder="Item Name"
                              className="w-full p-2 border rounded-s"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) =>
                                handleTableDataChange(
                                  row.id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="Qty"
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                handleTableDataChange(
                                  row.id,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="Price"
                              className="w-full p-2 border rounded-s"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <select
                              value={row.tax}
                              onChange={(e) =>
                                handleTableDataChange(
                                  row.id,
                                  "tax",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border"
                            >
                              <option value="0">Nothing Selected</option>
                              <option value="10">GST:10%</option>
                              <option value="18">CGST:18%</option>
                              <option value="10">VAT:10%</option>
                              <option value="10">IGST:10%</option>
                              <option value="10">UTGST:10%</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 border-b">
                            <span>{row.amount}</span>
                          </td>
                          <td className="px-2 py-1 border-b text-center">
                            <Button
                              danger
                              onClick={() => handleDeleteRow(row.id)}
                            >
                              <DeleteOutlined />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="px-4 py-2 border-b">
                            <textarea
                              rows={2}
                              value={row.description}
                              onChange={(e) =>
                                handleTableDataChange(
                                  row.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                              className="w-[70%] p-2 border"
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="form-buttons text-left mt-2">
                <Button
                  className="border-0 text-blue-500"
                  onClick={handleAddRow}
                >
                  <PlusOutlined /> Add Items
                </Button>
              </div>

              {/* Summary Section */}
              <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                <table className="w-full lg:w-[50%] p-2">
                  {/* Sub Total */}
                  <tr className="flex justify-between px-2 py-2 border-x-2">
                    <td className="font-medium">Sub Total</td>
                    <td className="font-medium px-4 py-2">
                      ₹{totals.subtotal.toFixed(2)}
                    </td>
                  </tr>

                  {/* Discount */}
                  <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                    <td className="font-medium">Discount</td>
                    <td className="flex items-center space-x-2">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Discount Rate (%)
                        </label>
                        <input
                          type="number"
                          value={discountRate}
                          onChange={(e) => {
                            setDiscountRate(parseFloat(e.target.value) || 0);
                            calculateTotal(
                              tableData,
                              parseFloat(e.target.value) || 0
                            ); // Recalculate with new discount rate
                          }}
                          className="mt-1 block w-full p-2 border rounded"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Tax */}
                  <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                    <td className="font-medium">Total Tax</td>
                    <td className="font-medium px-4 py-2">
                      ₹{totals.totalTax.toFixed(2)}
                    </td>
                  </tr>

                  {/* Total */}
                  <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                    <td className="font-bold text-lg">Total Amount</td>
                    <td className="font-bold text-lg px-4">
                      ₹{totals.finalTotal.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <Form.Item className="mt-2">
              <Row justify="end" gutter={16}>
                <Col>
                  <Button
                    onClick={() => navigate("/app/dashboards/sales/estimates")}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          
        </div>
         <Modal
                    title="Add New Category"
                    open={isTagModalVisible}
                    onCancel={() => setIsTagModalVisible(false)}
                    onOk={handleAddNewTag}
                    okText="Add Category"
                  >
                    <Input
                      placeholder="Enter new Category"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                  </Modal>
      </div>
    </>
  );
};

export default AddEstimates;

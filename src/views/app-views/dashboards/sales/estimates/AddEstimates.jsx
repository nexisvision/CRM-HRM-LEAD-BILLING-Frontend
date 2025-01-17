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
import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";
import { useSelector, useDispatch } from "react-redux";
import { createquotations } from "./estimatesReducer/EstimatesSlice";
import * as Yup from "yup";

const { Option } = Select;

const AddEstimates = ({ onClose }) => {
  const [discountType, setDiscountType] = useState("%");
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

  const handleFinish = async (values) => {
    try {
      console.log("Form Values:", values);
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

      const quotationData = {
        issueDate: values.issueDate.format("YYYY-MM-DD"), // Ensure date format
        customer: values.customer,
        category: values.category,
        items: itemsObject,
        discount: parseFloat(discount.toFixed(2)) || 0,
        tax: parseFloat(totalTax.toFixed(2)) || 0,
        total: parseFloat(totalAmount.toFixed(2)) || 0,
      };
      console.log("Quotation Data Prepared:", quotationData);
      await dispatch(createquotations(quotationData));
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
                  <Col span={12}>
                    <Form.Item
                      name="customer"
                      label="Customer Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the customer name",
                        },
                      ]}
                    >
                      <Input placeholder="Enter customer name" />
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

                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[
                        { required: true, message: "Please select a Category" },
                      ]}
                    >
                      <Select placeholder="Select Category">
                        <Option value="abc">abc</Option>
                        <Option value="xyz">xyz</Option>
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

            <Form.Item className="mt-4">
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
      </div>
    </>
  );
};

export default AddEstimates;

// import React, { useState, useEffect } from 'react';
// import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
// import {  DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import { createestimate } from './estimatesReducer/EstimatesSlice';
// import * as Yup from 'yup';

// const { Option } = Select;

// const AddEstimates = ({ onClose }) => {

//     const { id } = useParams();

//     const [discountType, setDiscountType] = useState("%");
//     const [loading, setLoading] = useState(false);
//     const [discountValue, setDiscountValue] = useState(0);
//     const { currencies } = useSelector((state) => state.currencies);
//     const [discountRate, setDiscountRate] = useState(10);
//     const dispatch = useDispatch();
//     const [form] = Form.useForm();
//     const [totals, setTotals] = useState({
//         subtotal: 0,
//         discount: 0,
//         totalTax: 0,
//         finalTotal: 0,
//     });

//     const [tableData, setTableData] = useState([
//         {
//             id: Date.now(),
//             item: "",
//             quantity: 1,
//             price: "",
//             tax: 0,
//             amount: "0",
//             description: "",
//         }
//     ]);

//     // Fetch currencies
//     useEffect(() => {
//         dispatch(getallcurrencies());
//     }, [dispatch]);

//     const handleFinish = async (values) => {
//         try {
//             // console.log("Form Values:", values);
//             setLoading(true);

//             const subTotal = calculateSubTotal();
//             const totalTax = calculateTotalTax();
//             const discount = (subTotal * discountRate) / 100;
//             const totalAmount = subTotal - discount + totalTax;

//             const estimateData = {
//                 valid_till: values.valid_till.format('YYYY-MM-DD'), // Ensure date format
//                 currency: values.currency,
//                 project: values.project,
//                 client: values.client,
//                 items: tableData.map(item => ({
//                     description: item.item,
//                     quantity: parseFloat(item.quantity) || 0,
//                     price: parseFloat(item.price) || 0,
//                     tax: parseFloat(item.tax) || 0,
//                     amount: parseFloat(item.amount) || 0
//                 })),
//                 discount: parseFloat(discount.toFixed(2)) || 0,
//                 tax: parseFloat(totalTax.toFixed(2)) || 0,
//                 total: parseFloat(totalAmount.toFixed(2)) || 0
//             };

//             console.log("Estimate Data Prepared:", estimateData);

//             const result = await dispatch(createestimate({ id, estimateData }));

//             if (result.payload?.success) {
//                 message.success('Estimate created successfully');
//                 form.resetFields();
//                 navigate('/app/dashboards/project/list');
//             } else {
//                 throw new Error(result.payload?.message || 'Failed to create estimate');
//             }
//         } catch (error) {
//             console.error("Estimate Creation Error:", error);
//             message.error('Failed to create Estimate: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const handleFinish = async (values) => {
//     //     try {
//     //         console.log("opopopopopo",values)
//     //         setLoading(true);
//     //         const subTotal = calculateSubTotal();
//     //         const totalTax = calculateTotalTax();
//     //         // const discount = calculateDiscount();
//     //         // const totalAmount = calculateTotal();
//     //         const discount = (subTotal * discountRate) / 100; // Discount calculation
//     //         const totalAmount = subTotal - discount + totalTax; // Final total calculation

//     //         const estimatesData = {
//     //             projectId: id,
//     //             client: values.client,
//     //             currency: values.currency,
//     //             project: values.project,
//     //             valid_till: values.valid_till.format('YYYY-MM-DD'),
//     //             items: tableData.map(item => ({
//     //                 description: item.item,
//     //                 quantity: parseFloat(item.quantity),
//     //                 price: parseFloat(item.price),
//     //                 tax: parseFloat(item.tax),
//     //                 amount: parseFloat(item.amount),
//     //                 description: item.description
//     //             })),
//     //             sub_total: subTotal.toFixed(2),
//     //             discount: discount.toFixed(2),
//     //             total_tax: totalTax.toFixed(2),
//     //             total: totalAmount.toFixed(2),
//     //             status: 'pending'
//     //         };

//     //         console.log('Estimate Data:', estimatesData);

//     //         const result = await dispatch(createestimate({ id, estimatesData }));
//     //          console.log("iddddd",id);

//     //         if (result) {
//     //             message.success('Estimate created successfully');
//     //             form.resetFields();
//     //             navigate('/app/dashboards/project/list');
//     //         }
//     //     } catch (error) {
//     //         message.error('Failed to create Estimate: ' + error.message);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     // const handleFinish = async (values) => {
//     //     try {
//     //       setLoading(true);

//     //       const subTotal = calculateSubTotal();
//     //       const totalTax = calculateTotalTax();
//     //       const discount = (subTotal * discountRate) / 100;
//     //       const totalAmount = subTotal - discount + totalTax;

//     //       const estimateData = {
//     //         projectId: projectId,
//     //         valid_till: values.valid_till.format('YYYY-MM-DD'),
//     //         client: values.client,
//     //         currency: values.currency,
//     //         project: values.project,
//     //         items: tableData.map((item) => ({
//     //           description: item.item,
//     //           quantity: parseFloat(item.quantity),
//     //           price: parseFloat(item.price),
//     //           tax: parseFloat(item.tax),
//     //           amount: parseFloat(item.amount),
//     //         })),
//     //         sub_total: subTotal.toFixed(2),
//     //         discount: discount.toFixed(2),
//     //         total_tax: totalTax.toFixed(2),
//     //         total: totalAmount.toFixed(2),
//     //         status: 'pending',
//     //       };

//     //       await dispatch(createestimate({ projectId, estimateData })).unwrap();
//     //       console.log("project id" ,projectId)
//     //       message.success('Estimate created successfully');
//     //       navigate('/estimates');
//     //     } catch (error) {
//     //       message.error('Failed to create Estimate: ' + error);
//     //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };

//     const [rows, setRows] = useState([
//         {
//             id: Date.now(),
//             item: "",
//             quantity: "",
//             price: "",
//             discount: "",
//             tax: "",
//             amount: "0",
//             description: "",
//             isNew: false,
//         },
//     ]);

//     // Function to handle adding a new row
//     const handleAddRow = () => {
//         setRows([
//             ...rows,
//             {
//                 id: Date.now(),
//                 item: "",
//                 quantity: "",
//                 price: "",
//                 discount: "",
//                 tax: "",
//                 amount: "0",
//                 description: "",
//                 isNew: true,
//             },
//         ]);
//     };

//     // Delete row
//     const handleDeleteRow = (id) => {
//         if (rows.length > 1) {
//             setRows(rows.filter(row => row.id !== id));
//         } else {
//             message.warning('At least one item is required');
//         }
//     };

//     const navigate = useNavigate();

//     // Calculate discount amount
//     const calculateDiscount = () => {
//         const subTotal = calculateSubTotal();
//         if (discountType === '%') {
//             return subTotal * (parseFloat(discountValue) || 0) / 100;
//         }
//         return parseFloat(discountValue) || 0;
//     };

//     // Calculate total tax
//     const calculateTotalTax = () => {
//         const subTotal = calculateSubTotal();
//         const discount = calculateDiscount();
//         const taxableAmount = form.getFieldValue('calctax') === 'before'
//             ? subTotal
//             : (subTotal - discount);

//         return tableData.reduce((sum, row) => {
//             const quantity = parseFloat(row.quantity) || 0;
//             const price = parseFloat(row.price) || 0;
//             const tax = parseFloat(row.tax) || 0;
//             const rowAmount = quantity * price;
//             return sum + (rowAmount * (tax / 100));
//         }, 0);
//     };

//     // Calculate subtotal (sum of all row amounts before discount)
//     const calculateSubTotal = () => {
//         return rows.reduce((sum, row) => {
//             const quantity = parseFloat(row.quantity || 0);
//             const price = parseFloat(row.price || 0);
//             return sum + (quantity * price);
//         }, 0);
//     };

//     const calculateTotal = (data, discountRate) => {
//         let subtotal = 0;
//         let totalTax = 0;

//         data.forEach((row) => {
//             const amount = row.quantity * row.price;
//             const taxAmount = (amount * row.tax) / 100;

//             row.amount = amount; // Update the row's amount
//             subtotal += amount;
//             totalTax += taxAmount;
//         });

//         const discount = (subtotal * discountRate) / 100;
//         const finalTotal = subtotal - discount + totalTax;

//         setTotals({ subtotal, discount, totalTax, finalTotal });
//     };

//     const handleTableDataChange = (id, field, value) => {
//         const updatedData = tableData.map((row) =>
//             row.id === id ? { ...row, [field]: field === 'quantity' || field === 'price' || field === 'tax' ? parseFloat(value) || 0 : value } : row
//         );

//         setTableData(updatedData);
//         calculateTotal(updatedData, discountRate); // Recalculate totals
//     };

//     return (
//         <>
//             <div>
//                 <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
//                     <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleFinish}
//                         initialValues={{
//                             loginEnabled: true,
//                         }}
//                     >
//                         {/* <Card className="border-0 mt-2"> */}
//                         <div className="">
//                             <div className=" p-2">

//                                 <Row gutter={16}>
//                                 <Col span={12}>
//                                         <Form.Item
//                                             name="client"
//                                             label="Client Name"
//                                             rules={[{ required: true, message: "Please enter the client name" }]}
//                                         >
//                                             <Input placeholder="Enter client name" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="project"
//                                             label="Project"
//                                             rules={[{ required: true, message: "Please enter the project name" }]}
//                                         >
//                                             <Input placeholder="Enter project name" />
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="currency"
//                                             label="Currency"
//                                             rules={[{ required: true, message: "Please select a currency" }]}
//                                         >
//                                             <Select
//                                                 className="w-full mt-2"
//                                                 placeholder="Select Currency"
//                                                 onChange={(value) => {
//                                                     const selectedCurrency = currencies.find(c => c.id === value);
//                                                     form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
//                                                 }}
//                                             >
//                                                 {currencies?.map((currency) => (
//                                                     <Option
//                                                         key={currency.id}
//                                                         value={currency.id}
//                                                     >
//                                                         {currency.currencyCode}
//                                                     </Option>
//                                                 ))}
//                                             </Select>
//                                         </Form.Item>
//                                     </Col>

//                                     <Col span={12}>
//                                         <Form.Item
//                                             name="valid_till"
//                                             label=" Date"
//                                             rules={[{ required: true, message: "Please select the date" }]}
//                                         >
//                                             <DatePicker className="w-full" format="DD-MM-YYYY" />
//                                         </Form.Item>
//                                     </Col>

//                                 </Row>

//                             </div>
//                         </div>
//                         <div>
//                             <div className="overflow-x-auto">

//                                 <table className="w-full border border-gray-200 bg-white">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Description<span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Quantity<span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Unit Price <span className="text-red-500">*</span>
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 TAX (%)
//                                             </th>
//                                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                                 Amount<span className="text-red-500">*</span>
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {tableData.map((row) => (
//                                             <React.Fragment key={row.id}>
//                                                 <tr>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="text"
//                                                             value={row.item}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'item', e.target.value)}
//                                                             placeholder="Item Name"
//                                                             className="w-full p-2 border rounded-s"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="number"
//                                                             value={row.quantity}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'quantity', e.target.value)}
//                                                             placeholder="Qty"
//                                                             className="w-full p-2 border rounded"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <input
//                                                             type="number"
//                                                             value={row.price}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
//                                                             placeholder="Price"
//                                                             className="w-full p-2 border rounded-s"
//                                                         />
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <select
//                                                             value={row.tax}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'tax', e.target.value)}
//                                                             className="w-full p-2 border"
//                                                         >
//                                                             <option value="0">Nothing Selected</option>
//                                                             <option value="10">GST:10%</option>
//                                                             <option value="18">CGST:18%</option>
//                                                             <option value="10">VAT:10%</option>
//                                                             <option value="10">IGST:10%</option>
//                                                             <option value="10">UTGST:10%</option>
//                                                         </select>
//                                                     </td>
//                                                     <td className="px-4 py-2 border-b">
//                                                         <span>{row.amount}</span>
//                                                     </td>
//                                                     <td className="px-2 py-1 border-b text-center">
//                                                         <Button
//                                                             danger
//                                                             onClick={() => handleDeleteRow(row.id)}
//                                                         >
//                                                             <DeleteOutlined />
//                                                         </Button>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td colSpan={6} className="px-4 py-2 border-b">
//                                                         <textarea
//                                                             rows={2}
//                                                             value={row.description}
//                                                             onChange={(e) => handleTableDataChange(row.id, 'description', e.target.value)}
//                                                             placeholder="Description"
//                                                             className="w-[70%] p-2 border"
//                                                         />
//                                                     </td>
//                                                 </tr>
//                                             </React.Fragment>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="form-buttons text-left mt-2">
//                                 <Button className='border-0 text-blue-500' onClick={handleAddRow}>
//                                     <PlusOutlined />  Add Items
//                                 </Button>
//                             </div>

//                             {/* Summary Section */}
//                             <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
//                                 <table className='w-full lg:w-[50%] p-2'>
//                                     {/* Sub Total */}
//                                     <tr className="flex justify-between px-2 py-2 border-x-2">
//                                         <td className="font-medium">Sub Total</td>
//                                         <td className="font-medium px-4 py-2">
//                                             ₹{totals.subtotal.toFixed(2)}
//                                         </td>
//                                     </tr>

//                                     {/* Discount */}
//                                     <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
//                                         <td className="font-medium">Discount</td>
//                                         <td className='flex items-center space-x-2'>
//                                             <div className="mb-4">
//                                                 <label className="block text-sm font-medium text-gray-700">
//                                                     Discount Rate (%)
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     value={discountRate}
//                                                     onChange={(e) => {
//                                                         setDiscountRate(parseFloat(e.target.value) || 0);
//                                                         calculateTotal(tableData, parseFloat(e.target.value) || 0); // Recalculate with new discount rate
//                                                     }}
//                                                     className="mt-1 block w-full p-2 border rounded"
//                                                 />
//                                             </div>
//                                         </td>
//                                     </tr>

//                                     {/* Tax */}
//                                     <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
//                                         <td className="font-medium">Total Tax</td>
//                                         <td className="font-medium px-4 py-2">
//                                             ₹{totals.totalTax.toFixed(2)}
//                                         </td>
//                                     </tr>

//                                     {/* Total */}
//                                     <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
//                                         <td className="font-bold text-lg">Total Amount</td>
//                                         <td className="font-bold text-lg px-4">
//                                             ₹{totals.finalTotal.toFixed(2)}
//                                         </td>
//                                     </tr>
//                                 </table>
//                             </div>
//                         </div>

//                         <Form.Item>
//                             <Row justify="end" gutter={16}>
//                                 <Col>
//                                     <Button onClick={() => navigate("/app/dashboards/sales/estimates")}>Cancel</Button>
//                                 </Col>
//                                 <Col>
//                                     <Button type="primary" htmlType="submit">
//                                         Create
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Form.Item>
//                     </Form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddEstimates;

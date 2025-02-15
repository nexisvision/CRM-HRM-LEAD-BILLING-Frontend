import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  Input,
  message,
  Row,
  Modal,
  Col,
  Switch,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { addbil, getbil } from "./billing2Reducer/billing2Slice";

const { Option } = Select;

const AddBilling = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const Tagsdetail = useSelector((state) => state.Lable);
  const { taxes } = useSelector((state) => state.tax);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});
  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      tax: 0,
      amount: 0,
      description: "",
    },
  ]);

  const [showTax, setShowTax] = useState(false);

  const [discountRate, setDiscountRate] = useState(0);
  const [totals, setTotals] = useState({
    subtotal: "0.00",
    discount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00",
  });

  const [rows, setRows] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0,
      description: "",
      status: "",
      referenceNumber: "",
      isNew: true,

    },
  ]);

  useEffect(() => {
    dispatch(Getcus());
    dispatch(getAllTaxes());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        discount: 0,
        tax: 0,
        amount: 0,
        description: "",
        status: "",
        referenceNumber: "",
        isNew: true,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  // const handleFieldChange = (id, field, value) => {
  //   const updatedRows = rows.map((row) =>
  //     row.id === id
  //       ? { ...row, [field]: value, amount: calculateAmount(row) }
  //       : row
  //   );
  //   setRows(updatedRows);
  // };

  const calculateAmount = (row) => {
    const { quantity, price, discount, tax } = row;
    const discountAmount = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const totalAmount = (priceAfterDiscount + taxAmount) * quantity;
    return totalAmount.toFixed(2);
  };

  // const calculateTotals = () => {
  //   let subtotal = 0;
  //   let totalDiscount = 0;
  //   let totalTax = 0;

  //   rows.forEach((row) => {
  //     const { quantity, price, discount, tax } = row;
  //     const discountAmount = (price * discount) / 100;
  //     const priceAfterDiscount = price - discountAmount;
  //     const taxAmount = (priceAfterDiscount * tax) / 100;

  //     subtotal += priceAfterDiscount * quantity;
  //     totalDiscount += discountAmount * quantity;
  //     totalTax += taxAmount * quantity;
  //   });

  //   const totalAmount = subtotal + totalTax - totalDiscount;

  //   return {
  //     subtotal: subtotal.toFixed(2),
  //     totalDiscount: totalDiscount.toFixed(2),
  //     totalTax: totalTax.toFixed(2),
  //     totalAmount: totalAmount.toFixed(2),
  //   };
  // };

  const lid = AllLoggeddtaa.loggedInUser.id;

  const calculateTotal = (data = tableData, discount = discountRate) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data passed to calculateTotal');
      return;
    }

    // Calculate subtotal (sum of all item amounts)
    const subtotal = data.reduce((sum, row) => {
      return sum + (parseFloat(row.amount) || 0);
    }, 0);

    // Calculate discount amount
    const discountAmount = (subtotal * (parseFloat(discount) || 0)) / 100;

    // Calculate total tax (for display purposes)
    const totalTax = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = showTax ? (parseFloat(row.tax) || 0) : 0;
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      return sum + taxAmount;
    }, 0);

    // Calculate final total: subtotal - discount
    const finalTotal = subtotal - discountAmount;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    });

    return {
      subtotal,
      discount: discountAmount,
      totalTax,
      finalTotal
    };
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (field === 'tax' && taxes?.data) {
          const selectedTax = taxes.data.find(tax => tax.gstPercentage.toString() === value.toString());
          if (selectedTax) {
            setSelectedTaxDetails(prevDetails => ({
              ...prevDetails,
              [id]: {
                gstName: selectedTax.gstName,
                gstPercentage: selectedTax.gstPercentage
              }
            }));
          }
        }
        
        if (field === 'quantity' || field === 'price' || field === 'tax') {
          const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
          const price = parseFloat(field === 'price' ? value : row.price) || 0;
          const tax = showTax ? (parseFloat(field === 'tax' ? value : row.tax) || 0) : 0;
          
          // Calculate amount: unit price * quantity + tax
          const baseAmount = quantity * price;
          const taxAmount = (baseAmount * tax) / 100;
          updatedRow.amount = (baseAmount + taxAmount).toFixed(2);
        }
        
        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, discountRate);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const totals = calculateTotal();

        // Format items data with GST name
        const items = tableData.map(row => ({
          item: row.item,
          tax_name: showTax ? selectedTaxDetails[row.id]?.gstName || '' : '',
          tax_percentage: showTax ? parseFloat(row.tax) || 0 : 0,
          quantity: parseFloat(row.quantity) || 0,
          price: parseFloat(row.price) || 0,
          amount: parseFloat(row.amount) || 0,
          description: row.description || ""
        }));

        // Create description object
        const discription = {
          product: tableData.map(item => item.item).filter(Boolean).join(", "),
          service: tableData.map(item => item.description).filter(Boolean).join(", "),
          items: tableData.map(item => ({
            name: item.item,
            quantity: parseFloat(item.quantity) || 0,
            unitPrice: parseFloat(item.price) || 0,
            tax: showTax ? parseFloat(item.tax) || 0 : 0,
            tax_name: showTax ? selectedTaxDetails[item.id]?.gstName || '' : '',
            amount: parseFloat(item.amount) || 0
          }))
        };

        // Create invoice data object
        const invoiceData = {
          billNumber: values.billNumber,
          vendor: values.vendor,
          billDate: values.billDate?.format("YYYY-MM-DD"),
          discription: discription,
          status: values.status,
          discount: parseFloat(discountRate) || 0,
          tax: totals.totalTax,
          total: totals.finalTotal,
          note: values.note || "",
          items: items,
          itemDetails: tableData.map(row => ({
            productName: row.item,
            unitPrice: parseFloat(row.price) || 0,
            quantity: parseFloat(row.quantity) || 0,
            tax: showTax ? parseFloat(row.tax) || 0 : 0,
            tax_name: showTax ? selectedTaxDetails[row.id]?.gstName || '' : '',
            lineTotal: parseFloat(row.amount) || 0
          }))
        };

        const lid = AllLoggeddtaa.loggedInUser.id;
        const payload = { lid, invoiceData };

        // Send data to backend
        dispatch(addbil(payload))
          .then((response) => {
            if (response.payload) {
              message.success("Bill added successfully!");
              dispatch(getbil(lid));
              form.resetFields();
              setTableData([{
                id: Date.now(),
                item: "",
                quantity: 1,
                price: 0,
                tax: 0,
                amount: 0,
                description: "",
              }]);
              setDiscountRate(0);
              setShowTax(false);
              onClose();
            }
          })
          .catch((error) => {
            console.error("Error adding bill:", error);
            message.error("Failed to add bill. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        message.error("Please fill in all required fields");
      });
  };

  const fetchTags = async () => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueTags = response.payload.data
          .filter((label) => label && label.name)
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          );

        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a status name");
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


      await fetchTags();
    } catch (error) {
      console.error("Failed to add status:", error);
      message.error("Failed to add status");
    }
  };


  return (
    <div>
      <Form form={form} layout="vertical">
        <Card className="border-0">
          <Row gutter={16}>
            <Col span={24} className="mt-1">
              <Form.Item
                label="Vendor"
                name="vendor"
                rules={[{ required: true, message: "Please enter vendor name" }]}
              >
                <Input placeholder="Enter Vendor Name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Bill Date"
                name="billDate"
                rules={[{ required: true, message: "Please select bill date" }]}
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  placeholder="Select or add new status"
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
                          Add New Status
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

            <Col span={12}>
              <Form.Item
                label="Bill Number"
                name="billNumber"
                rules={[
                  { required: true, message: "Please enter bill number" },
                ]}
              >
                <Input placeholder="Enter Bill Number" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Enter Description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Note" name="note">
                <Input placeholder="Enter Note (Optional)" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg">Product & Services</h4>
            <div className="flex items-center gap-2">
              <span>Enable Tax</span>
              <Switch
                checked={showTax}
                onChange={(checked) => {
                  setShowTax(checked);
                  if (!checked) {
                    const updatedData = tableData.map(row => ({
                      ...row,
                      tax: 0,
                      amount: calculateAmount({ ...row, tax: 0 })
                    }));
                    setTableData(updatedData);
                    calculateTotal(updatedData, discountRate);
                  }
                }}
              />
            </div>
          </div>

          <div>
            <div className="form-buttons text-right mb-2">
              <Button type="primary" onClick={handleAddRow}>
                <PlusOutlined /> Add Items
              </Button>
            </div>
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
                      Unit Price<span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      {showTax ? 'TAX (%)' : 'TAX'}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
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
                            onChange={(e) => handleTableDataChange(row.id, "item", e.target.value)}
                            placeholder="Item Name"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                            placeholder="Qty"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="0"
                            value={row.price}
                            onChange={(e) => handleTableDataChange(row.id, "price", e.target.value)}
                            placeholder="Price"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          {showTax ? (
                            <select
                              value={row.tax}
                              onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
                              className="w-full p-2 border"
                            >
                              <option value="0">Nothing Selected</option>
                              {taxes && taxes.data && taxes.data.map(tax => (
                                <option key={tax.id} value={tax.gstPercentage}>
                                  {tax.gstName}: {tax.gstPercentage}%
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value="0"
                              disabled
                              className="w-full p-2 border bg-gray-100"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">
                          ₹{row.amount}
                        </td>
                        <td className="px-2 py-1 border-b text-center">
                          <Button danger onClick={() => handleDeleteRow(row.id)}>
                            <DeleteOutlined />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="px-4 py-2 border-b">
                          <textarea
                            rows={2}
                            value={row.description}
                            onChange={(e) => handleTableDataChange(row.id, "description", e.target.value)}
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
          </div>

          <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
            <table className="w-full lg:w-[50%] p-2">
              <tbody>
                <tr className="flex justify-between px-2 py-2 border-x-2">
                  <td className="font-medium">Sub Total</td>
                  <td className="font-medium px-4 py-2">₹{totals.subtotal}</td>
                </tr>

                <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                  <td className="font-medium">Discount</td>
                  <td className="flex items-center space-x-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountRate}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value) || 0;
                          setDiscountRate(newRate);
                          calculateTotal(tableData, newRate);
                        }}
                        className="mt-1 block w-full p-2 border rounded"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Total Tax</td>
                  <td className="font-medium px-4 py-2">₹{totals.totalTax}</td>
                </tr>

                <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                  <td className="font-bold text-lg">Total Amount</td>
                  <td className="font-bold text-lg px-4">₹{totals.finalTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </Card>

        <div className="mt-3 flex justify-end">
          <Button type="primary" onClick={handleSubmit}>
            Submit Bill
          </Button>
          <Button type="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Form>

      <Modal
        title="Add New Status"
        visible={isTagModalVisible}
        onOk={handleAddNewTag}
        onCancel={() => setIsTagModalVisible(false)}
        okText="Add"

      >
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new status name"
        />
      </Modal>

    </div>
  );
};

export default AddBilling;

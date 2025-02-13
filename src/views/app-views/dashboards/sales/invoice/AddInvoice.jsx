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
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { AddInvoices, getInvoice } from "./InvoiceReducer/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"

const { Option } = Select;

const AddInvoice = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const Tagsdetail = useSelector((state) => state.Lable);

  // const { id } = useParams();

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      tax: 0,
      discount: 0,
      amount: 0,
      description: "",
    },
  ]);

  // Get currencies from the store
  const currencies = useSelector((state) => state.currencies.currencies.data);

  // Add this to get taxes from Redux store
  const { taxes } = useSelector((state) => state.tax);

  // Fetch currencies when component mounts
  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  // Add this useEffect to fetch taxes when component mounts
  useEffect(() => {
    dispatch(getAllTaxes());
  }, [dispatch]);

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        discount: 0,
        tax: 0,
        amount: 0,
        description: "",
      },
    ]);
  };

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, discountRate);
    } else {
      message.warning("At least one item is required");
    }
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        // Calculate individual item amounts
        const quantity = parseFloat(updatedRow.quantity) || 0;
        const price = parseFloat(updatedRow.price) || 0;
        const itemDiscountPercentage = parseFloat(updatedRow.discount) || 0;
        const taxPercentage = parseFloat(updatedRow.tax) || 0;

        const baseAmount = quantity * price;
        const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
        const taxAmount = (baseAmount * taxPercentage) / 100;

        // Calculate final amount with individual discount
        const finalAmount = baseAmount - itemDiscountAmount + taxAmount;

        updatedRow.amount = finalAmount.toFixed(2);
        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, discountRate);
  };

  const calculateTotal = (data,discountRate) => {
    const totals = data.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const itemDiscountPercentage = parseFloat(row.discount) || 0;
      const taxPercentage = parseFloat(row.tax) || 0;

      const baseAmount = quantity * price;
      const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
      const taxAmount = (baseAmount * taxPercentage) / 100;

      // Calculate item total after individual discount and tax
      const itemTotal = baseAmount - itemDiscountAmount + taxAmount;

      return {
        subtotal: acc.subtotal + itemTotal,
        itemDiscount: acc.itemDiscount + itemDiscountAmount,
        tax: acc.tax + taxAmount,
        baseTotal: acc.baseTotal + baseAmount
      };
    }, { subtotal: 0, itemDiscount: 0, tax: 0, baseTotal: 0 });

    // Calculate global discount rate amount
    const globalDiscountAmount = (totals.subtotal * discountRate) / 100;

    // Calculate final total after both discounts
    const finalTotal = totals.subtotal - globalDiscountAmount;

    setTotals({
      subtotal: totals.subtotal.toFixed(2),
      itemDiscount: totals.itemDiscount.toFixed(2),
      globalDiscount: globalDiscountAmount.toFixed(2),
      totalTax: totals.tax.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    });
  };

  const [totals, setTotals] = useState({
    subtotal: "0.00",
    itemDiscount: "0.00",
    globalDiscount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00",

  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const itemsForDatabase = tableData.reduce((acc, item, index) => {
          const quantity = parseFloat(item.quantity) || 0;
          const price = parseFloat(item.price) || 0;
          const itemDiscountPercentage = parseFloat(item.discount) || 0;
          const taxPercentage = parseFloat(item.tax) || 0;

          const baseAmount = quantity * price;
          const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
          const taxAmount = (baseAmount * taxPercentage) / 100;
          const itemTotal = baseAmount - itemDiscountAmount + taxAmount;

          acc[`item_${index + 1}`] = {
            item: item.item,
            quantity: quantity,
            price: price,
            tax_percentage: taxPercentage,
            tax_amount: taxAmount,
            discount_percentage: itemDiscountPercentage,
            discount_amount: itemDiscountAmount,
            base_amount: baseAmount,
            final_amount: itemTotal,
            description: item.description || ""
          };
          return acc;
        }, {});

        // Calculate global discount on subtotal
        const subtotal = Object.values(itemsForDatabase).reduce((sum, item) =>
          sum + item.final_amount, 0);
        const globalDiscountAmount = (subtotal * discountRate) / 100;
        const finalTotal = subtotal - globalDiscountAmount;

        const invoiceData = {
          ...values,
          items: itemsForDatabase,
          subtotal: subtotal.toFixed(2),
          discount: discountRate.toFixed(2),
          global_discount_amount: globalDiscountAmount.toFixed(2),
          total_item_discount: totals.itemDiscount,
          total_global_discount: totals.globalDiscount,
          tax: totals.totalTax,
          total: finalTotal.toFixed(2),
          status: "pending"
        };

        dispatch(AddInvoices(invoiceData))
          .then(() => {
            dispatch(getInvoice());
            form.resetFields();
            // setDiscountRate(0);
            setTableData([
              {
                id: Date.now(),
                item: "",
                quantity: 1,
                price: 0,
                tax: 0,
                discount: 0,
                amount: 0,
                description: "",
              }
            ]);
            setTotals({
              subtotal: "0.00",
              itemDiscount: "0.00",
              globalDiscount: "0.00",
              totalTax: "0.00",
              finalTotal: "0.00",
            });
            onClose();
          })
          .catch((error) => {
            message.error("Failed to add invoice. Please try again.");
            console.error("Error during invoice submission:", error);
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
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

  // Add a reset function that can be called independently if needed
  const resetForm = () => {
    form.resetFields();
    setTableData([
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        tax: 0,
        discount: 0,
        amount: 0,
        description: "",
      }
    ]);
    setTotals({
      subtotal: "0.00",
      itemDiscount: "0.00",
      globalDiscount: "0.00",
      totalTax: "0.00",
      finalTotal: "0.00",
    });
  };

  return (
    <div>
      <Form form={form} layout="vertical">
        <Card className="border-0">
          <Row gutter={16}>
            <Col span={12} className="mt-1">
              <Form.Item
                label="Customer"
                name="customer"
                rules={[
                  { required: true, message: "Please select a customer" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Customer"
                  loading={!fnddata}
                >
                  {fnddata && fnddata.length > 0 ? (
                    fnddata.map((customer) => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name || "Unnamed Customer"}
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

            <Col span={12} className="mt-1">
              <Form.Item
                label="Issue Date"
                name="issueDate"
                rules={[
                  { required: true, message: "Please select issue date" },
                ]}

              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Due Date"
                name="dueDate"
                rules={[{ required: true, message: "Please select due date" }]}
              >

                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12} className="">
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please select or add a category",
                  },
                ]}
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
            <Col span={12}>
              <Form.Item
                label="Reference Number"
                name="refnumber"
                rules={[
                  { required: true, message: "Please enter reference number" },
                ]}
              >
                <Input placeholder="Enter Reference Number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select
                  placeholder="Select Currency"
                  onChange={(value) => {
                    const selected = currencies?.find(c => c.currencyCode === value);
                    setSelectedCurrencyIcon(selected?.currencyIcon || '₹');
                  }}
                >
                  {currencies?.map((currency) => (
                    <Option
                      key={currency.id}
                      value={currency.currencyCode}
                    >
                      {currency.currencyName} ({currency.currencyIcon})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>
        </Card>

        <Card>
          <h4 className="font-semibold text-lg mb-3">Product & Services</h4>
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
                      Discount (%)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      TAX (%)
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
                          <Input
                            prefix={selectedCurrencyIcon}
                            type="number"
                            min="0"
                            value={row.price}
                            onChange={(e) => handleTableDataChange(row.id, "price", e.target.value)}
                            placeholder="Price"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.discount || 0}
                            onChange={(e) => handleTableDataChange(row.id, "discount", e.target.value)}
                            placeholder="0"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
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
                        </td>
                        <td className="px-4 py-2 border-b">
                          <span>{selectedCurrencyIcon} {parseFloat(row.amount || 0).toFixed(2)}</span>
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

          {/* summary */}

          <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
            <table className="w-full lg:w-[50%] p-2">
              <tbody>
                <tr className="flex justify-between px-2 py-2 border-x-2">
                  <td className="font-medium">Sub Total</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.subtotal}</td>
                </tr>

                <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                  <td className="font-medium">Item Discount</td>
                  <td className="flex items-center space-x-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Item Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        value={discountRate}
                        onChange={(e) => {
                          setDiscountRate(parseFloat(e.target.value) || 0);
                          calculateTotal(tableData, parseFloat(e.target.value) || 0); // Recalculate with new discount rate
                        }}
                        className="mt-1 block w-full p-2 border rounded"
                      />
                    </div>
                  </td>
                </tr>

                {parseFloat(totals.itemDiscount) > 0 && (
                  <tr className="flex justify-between px-2 py-2 border-x-2">
                    <td className="font-medium">Total Item Discount Amount</td>
                    <td className="font-medium px-4 py-2 text-red-500">-₹{totals.itemDiscount}</td>
                  </tr>
                )}

                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Global Discount</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.globalDiscount}</td>
                </tr>

                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Total Tax</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.totalTax}</td>
                </tr>

                <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                  <td className="font-bold text-lg">Total Amount</td>
                  <td className="font-bold text-lg px-4">{selectedCurrencyIcon} {totals.finalTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="form-buttons text-right mt-4">
          <Button type="default" className="mr-2" onClick={() => {
            resetForm();
            onClose();
          }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </Form>
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
  );
};

export default AddInvoice;

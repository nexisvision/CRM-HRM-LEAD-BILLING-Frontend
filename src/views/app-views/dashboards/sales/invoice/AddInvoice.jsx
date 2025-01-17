import React, { useState } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  Input,
  message,
  Row,
  Col,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { AddInvoices } from "./InvoiceReducer/InvoiceSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;

const AddInvoice = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
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
      category: "",
      referenceNumber: "",
      isNew: true,
    },
  ]);

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
        category: "",
        referenceNumber: "",
        isNew: true,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleFieldChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, [field]: value, amount: calculateAmount(row) }
        : row
    );
    setRows(updatedRows);
  };

  const calculateAmount = (row) => {
    const { quantity, price, discount, tax } = row;
    const discountAmount = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const totalAmount = (priceAfterDiscount + taxAmount) * quantity;
    return totalAmount.toFixed(2);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    rows.forEach((row) => {
      const { quantity, price, discount, tax } = row;
      const discountAmount = (price * discount) / 100;
      const priceAfterDiscount = price - discountAmount;
      const taxAmount = (priceAfterDiscount * tax) / 100;

      subtotal += priceAfterDiscount * quantity;
      totalDiscount += discountAmount * quantity;
      totalTax += taxAmount * quantity;
    });

    const totalAmount = subtotal + totalTax - totalDiscount;

    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { subtotal, totalDiscount, totalTax, totalAmount } =
          calculateTotals();

        // Create items object with proper structure
        const itemsData = {
          items: {
            item: rows[0].item,
            quantity: Number(rows[0].quantity),
            price: Number(rows[0].price),
            discount: Number(rows[0].discount),
            tax: Number(rows[0].tax),
            amount: Number(rows[0].amount),
            description: rows[0].description || "",
            category: rows[0].category || "",
            referenceNumber: rows[0].referenceNumber || "",
          },
        };

        const invoiceData = {
          customer: values.customer,
          issueDate: values.issuedate?.format("YYYY-MM-DD"),
          dueDate: values.duedate?.format("YYYY-MM-DD"),
          category: values.category,
          items: itemsData.items, // Match backend items field
          discount: Number(totalDiscount), // Match backend discount field
          tax: Number(totalTax), // Match backend tax field
          total: Number(totalAmount), // Match backend total field
        };

        console.log("Prepared Invoice Data:", invoiceData);

        dispatch(AddInvoices(invoiceData))
          .then(() => {
            message.success("Invoice added successfully!");
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

  return (
    <div>
      <Form form={form} layout="vertical">
        <Card className="border-0 mt-4">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Customer"
                name="customer"
                rules={[{ required: true, message: "Please select customer" }]}
              >
                <Select placeholder="Select Customer">
                  <Option value="xyz">XYZ</Option>
                  <Option value="abc">ABC</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Issue Date"
                name="issuedate"
                rules={[
                  { required: true, message: "Please select issue date" },
                ]}
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Due Date"
                name="duedate"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select Category">
                  <Option value="xyz">XYZ</Option>
                  <Option value="abc">ABC</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
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

            <Col span={8}>
              <Form.Item
                label="Invoice Number"
                name="invoicenub"
                rules={[
                  { required: true, message: "Please enter invoice number" },
                ]}
              >
                <Input placeholder="Enter Invoice Number" />
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
            <table className="w-full border border-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    ITEMS
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    QUANTITY
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    PRICE
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    DISCOUNT
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    TAX (%)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                    AMOUNT
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 border-b">
                      <select
                        className="w-full p-2 border rounded"
                        value={row.item}
                        onChange={(e) =>
                          handleFieldChange(row.id, "item", e.target.value)
                        }
                      >
                        <option value="">--</option>
                        <option value="item1">Item 1</option>
                        <option value="item2">Item 2</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) =>
                            handleFieldChange(
                              row.id,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className="w-full p-2 border rounded-s"
                        />
                        <span className="text-gray-500 border border-s rounded-e px-3 py-2">
                          $
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.discount}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "discount",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.tax}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "tax",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {row.amount}
                    </td>
                    <td className="px-2 py-1 border-b text-center">
                      <Button danger onClick={() => handleDeleteRow(row.id)}>
                        <DeleteOutlined />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
              <span className="text-gray-700">Sub Total ($):</span>
              <span className="text-gray-700">
                {calculateTotals().subtotal}
              </span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
              <span className="text-gray-700">Discount ($):</span>
              <span className="text-gray-700">
                {calculateTotals().totalDiscount}
              </span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
              <span className="text-gray-700">Tax ($):</span>
              <span className="text-gray-700">
                {calculateTotals().totalTax}
              </span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="font-semibold text-gray-700">
                Total Amount ($):
              </span>
              <span className="font-semibold text-gray-700">
                {calculateTotals().totalAmount}
              </span>
            </div>
          </div>
        </Card>

        <div className="form-buttons text-right">
          <Button type="default" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddInvoice;

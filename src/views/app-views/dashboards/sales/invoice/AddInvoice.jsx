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

const { Option } = Select;

const AddInvoice = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const Tagsdetail = useSelector((state) => state.Lable);

  // const { id } = useParams();

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

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

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

  // const handleSubmit = () => {
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       const { subtotal, totalDiscount, totalTax, totalAmount } =
  //         calculateTotals();

  //       // Create items object with proper structure
  //       const itemsData = {
  //         items: {
  //           item: rows[0].item,
  //           quantity: Number(rows[0].quantity),
  //           price: Number(rows[0].price),
  //           discount: Number(rows[0].discount),
  //           tax: Number(rows[0].tax),
  //           amount: Number(rows[0].amount),
  //           description: rows[0].description || "",
  //           category: rows[0].category || "",
  //           referenceNumber: rows[0].referenceNumber || "",
  //         },
  //       };

  //       const invoiceData = {
  //         customer: values.customer,
  //         issueDate: values.issuedate?.format("YYYY-MM-DD"),
  //         dueDate: values.duedate?.format("YYYY-MM-DD"),
  //         category: values.category,
  //         items: itemsData.items, // Match backend items field
  //         discount: Number(totalDiscount), // Match backend discount field
  //         tax: Number(totalTax), // Match backend tax field
  //         total: Number(totalAmount), // Match backend total field
  //       };

  //       console.log("Prepared Invoice Data:", invoiceData);

  //       dispatch(AddInvoices(invoiceData))
  //         .then(() => {
  //           message.success("Invoice added successfully!");
  //           dispatch(getInvoice());
  //           onClose();
  //         })
  //         .catch((error) => {
  //           message.error("Failed to add invoice. Please try again.");
  //           console.error("Error during invoice submission:", error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error("Validation failed:", error);
  //     });
  // };

  const lid = AllLoggeddtaa.loggedInUser.id;

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { subtotal, totalDiscount, totalTax, totalAmount } =
          calculateTotals();

        // Check if the selected tag (category) is new or existing
        const selectedTag = tags.find((tag) => tag.name === values.category);

        const prepareInvoiceData = () => {
          // Prepare the invoice data
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

          return {
            customer: values.customer,
            issueDate: values.issuedate?.format("YYYY-MM-DD"),
            dueDate: values.duedate?.format("YYYY-MM-DD"),
            category: values.category,
            items: itemsData.items, // Match backend items field
            discount: Number(totalDiscount), // Match backend discount field
            tax: Number(totalTax), // Match backend tax field
            total: Number(totalAmount), // Match backend total field
          };
        };

        if (!selectedTag) {
          // If tag (category) doesn't exist, add it first
          const newTagPayload = { name: values.category.trim() };

          dispatch(AddLable({ lid, payload: newTagPayload }))
            .then(() => {
              // After adding the tag, submit the invoice
              const invoiceData = prepareInvoiceData();

              dispatch(AddInvoices(invoiceData))
                .then(() => {
                  message.success("Invoice added successfully!");
                  dispatch(getInvoice());
                  onClose();
                })
                .catch((error) => {
                  message.error("Failed to add invoice. Please try again.");
                  console.error("Error during invoice submission:", error);
                });
            })
            .catch((error) => {
              message.error("Failed to add tag.");
              console.error("Add Tag API error:", error);
            });
        } else {
          // If tag exists, directly submit the invoice
          const invoiceData = prepareInvoiceData();

          dispatch(AddInvoices(invoiceData))
            .then(() => {
              message.success("Invoice added successfully!");
              dispatch(getInvoice());
              onClose();
            })
            .catch((error) => {
              message.error("Failed to add invoice. Please try again.");
              console.error("Error during invoice submission:", error);
            });
        }
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

  return (
    <div>
      <Form form={form} layout="vertical">
        <Card className="border-0">
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
                label="Issue Date"
                name="issuedate"
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
                name="duedate"
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

        <div className="form-buttons text-right mt-4">
          <Button type="default" className="mr-2" onClick={onClose}>
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

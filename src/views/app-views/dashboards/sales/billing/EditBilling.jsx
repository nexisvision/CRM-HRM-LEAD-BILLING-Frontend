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
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { addbil, eidtebil, getbil } from "./billing2Reducer/billing2Slice";
import moment from "moment";

const { Option } = Select;

const EditBilling = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const lid = AllLoggeddtaa.loggedInUser.id;
  const Tagsdetail = useSelector((state) => state.Lable);

  useEffect(() => {
    dispatch(getbil(lid));
  }, []);

  const bildata = useSelector((state) => state.salesbilling);
  const fnsdatas = bildata.salesbilling.data;

  useEffect(() => {
    const fnd = fnsdatas.find((item) => item.id === idd);
    if (fnd) {
      // Set all form fields
      form.setFieldsValue({
        vendor: fnd.vendor,
        billDate: fnd.billDate ? moment(fnd.billDate) : null,
        status: fnd.status,
        billNumber: fnd.billNumber,
        description: fnd.description,
        discount: fnd.discount,
        tax: fnd.tax,
        note: fnd.note,
      });

      // Set rows data if it exists
      if (fnd.items && Array.isArray(fnd.items)) {
        const formattedRows = fnd.items.map((item) => ({
          id: Date.now() + Math.random(), // Generate unique id
          item: item.item,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          tax: item.tax,
          amount: item.amount,
          description: item.description,
          category: item.category,
          referenceNumber: item.referenceNumber,
          isNew: false,
        }));
        setRows(formattedRows);
      }
    }
  }, [fnsdatas, idd, form]);

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

  useEffect(() => {
    dispatch(Getcus());
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

        const selectedTag = tags.find((tag) => tag.name === values.status);

        // Modify prepareInvoiceData to structure discription as an object
        const prepareInvoiceData = () => {
          const itemsData = rows.map((row) => ({
            item: row.item,
            quantity: Number(row.quantity),
            price: Number(row.price),
            discount: Number(row.discount),
            tax: Number(row.tax),
            amount: Number(row.amount),
            description: row.description || "",
            category: row.category || "",
            referenceNumber: row.referenceNumber || "",
          }));

          // Construct the discription as an object
          let discription = {
            product: "", // Default or some value based on your requirement
            service: "", // Default or some value based on your requirement
          };

          // Check if itemsData has a specific structure to fill product and service fields
          if (itemsData.length > 0) {
            // For example, you could concatenate all item names as "product" and "service" based on some logic
            discription.product = itemsData.map((item) => item.item).join(", ");
            discription.service = itemsData
              .map((item) => item.description)
              .join(", ");
          }

          return {
            vendor: values.vendor,
            billDate: values.billDate?.format("YYYY-MM-DD"),
            discription:values.description, // Pass the structured discription object
            status: values.status,
            discount: Number(totalDiscount),
            tax: Number(totalTax),
            total: Number(totalAmount),
            note: values.note || "",
          };
        };

        const sendData = async () => {
          try {
            if (selectedTag) {
              const newTagPayload = { name: values.status.trim() };
              await dispatch(AddLable({ lid, payload: newTagPayload }));
            }

            const invoiceData = prepareInvoiceData();

            await dispatch(eidtebil({ idd, invoiceData })).then(() => {
              dispatch(getbil(lid));
              message.success("Bill added successfully!");
              onClose();
            });
          } catch (error) {
            console.error("Error during Bill submission:", error);
            message.error("Failed to add Bill. Please try again.");
          }
        };

        sendData();
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
      message.error("Please enter a category name");
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newTag.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Category added successfully");
      setNewTag("");
      setIsTagModalVisible(false);

      await fetchTags();
    } catch (error) {
      console.error("Failed to add category:", error);
      message.error("Failed to add category");
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
                rules={[{ required: true, message: "Please select vendor" }]}
              >
                <Select placeholder="Select Vendor">
                  <Option value="vendor1">Vendor 1</Option>
                  <Option value="vendor2">Vendor 2</Option>
                  <Option value="vendor3">Vendor 3</Option>
                </Select>
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
              <Form.Item label="Discount" name="discount">
                <Input
                  type="number"
                  placeholder="Enter Discount"
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Tax" name="tax">
                <Input
                  type="number"
                  placeholder="Enter Tax"
                  min={0}
                  max={100}
                />
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
                      <select
                        value={row.tax}
                        onChange={(e) => handleFieldChange(row.id, 'tax', e.target.value)}
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
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm">${calculateTotals().subtotal}</span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="text-sm">Discount:</span>
              <span className="text-sm">
                ${calculateTotals().totalDiscount}
              </span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="text-sm">Tax:</span>
              <span className="text-sm">${calculateTotals().totalTax}</span>
            </div>
            <div className="flex justify-between w-full sm:w-1/2">
              <span className="font-bold">Total:</span>
              <span className="font-bold">
                ${calculateTotals().totalAmount}
              </span>
            </div>
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
        title="Add New Category"
        visible={isTagModalVisible}
        onOk={handleAddNewTag}
        onCancel={() => setIsTagModalVisible(false)}
        okText="Add"
      >
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new category name"
        />
      </Modal>
    </div>
  );
};

export default EditBilling;

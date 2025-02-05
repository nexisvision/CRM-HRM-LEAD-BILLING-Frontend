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
  Switch
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

  const [showTax, setShowTax] = useState(false);

  const [discountRate, setDiscountRate] = useState(0);
  const [totals, setTotals] = useState({
    subtotal: "0.00",
    discount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00",
  });

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

  const bildata = useSelector((state) => state.salesbilling);
  const fnsdatas = bildata.salesbilling.data;

  useEffect(() => {
    const fnd = fnsdatas.find((item) => item.id === idd);
    if (fnd) {
      try {
        // Parse items if they're stored as a string
        let itemsArray = [];
        if (fnd.items) {
          try {
            itemsArray = typeof fnd.items === 'string' 
              ? JSON.parse(fnd.items) 
              : fnd.items;
          } catch (error) {
            console.error("Error parsing items:", error);
            itemsArray = [];
          }
        }

        // Set form fields
        form.setFieldsValue({
          vendor: fnd.vendor || "",
          billDate: fnd.billDate ? moment(fnd.billDate) : null,
          status: fnd.status || "",
          billNumber: fnd.billNumber || "",
          discount: fnd.discount || 0,
          tax: fnd.tax || 0,
          note: fnd.note || "",
        });

        // Set rows with items data
        if (itemsArray && Array.isArray(itemsArray) && itemsArray.length > 0) {
          const formattedRows = itemsArray.map((item) => ({
            id: Date.now() + Math.random(), // Generate unique ID
            item: item.item || "",
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
            discount: Number(item.discount) || 0,
            tax: Number(item.tax) || 0,
            amount: calculateAmount({
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0,
              discount: Number(item.discount) || 0,
              tax: Number(item.tax) || 0
            }),
            description: item.description || "",
            category: item.category || "",
            referenceNumber: item.referenceNumber || "",
          }));
          setRows(formattedRows);

          // For debugging
          console.log('Loaded Items:', formattedRows);
        } else {
          // Set default row if no items exist
          setRows([{
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
          }]);
        }

        // Parse and set description if it exists
        if (fnd.description) {
          try {
            const descriptionObj = typeof fnd.description === 'string'
              ? JSON.parse(fnd.description)
              : fnd.description;
            
            form.setFieldsValue({
              description: descriptionObj.description || ""
            });
          } catch (error) {
            console.error("Error parsing description:", error);
            form.setFieldsValue({ description: "" });
          }
        }

      } catch (error) {
        console.error("Error setting form data:", error);
        message.error("Error loading bill data");
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
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        return {
          ...updatedRow,
          amount: calculateAmount(updatedRow)
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const calculateAmount = (row) => {
    const quantity = Number(row.quantity) || 0;
    const price = Number(row.price) || 0;
    const discount = Number(row.discount) || 0;
    const tax = Number(row.tax) || 0;

    const discountAmount = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const totalAmount = (priceAfterDiscount + taxAmount) * quantity;

    return totalAmount.toFixed(2);
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        if (field === 'quantity' || field === 'price' || field === 'tax') {
          const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
          const price = parseFloat(field === 'price' ? value : row.price) || 0;
          const tax = showTax ? (parseFloat(field === 'tax' ? value : row.tax) || 0) : 0;
          
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

  const calculateTotal = (data, discountRate) => {
    let subtotal = 0;
    let totalTax = 0;

    data.forEach((row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = showTax ? (parseFloat(row.tax) || 0) : 0;
      
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      
      subtotal += baseAmount;
      totalTax += taxAmount;
    });

    const discount = (subtotal * (parseFloat(discountRate) || 0)) / 100;
    const finalTotal = subtotal - discount + totalTax;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
    });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { subtotal, totalDiscount, totalTax, totalAmount } =
          calculateTotal();

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
            discription, // Pass the structured discription object
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
              <Button 
                type="primary" 
                onClick={handleAddRow}
                icon={<PlusOutlined />}
              >
                Add Items
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
                            className="w-full p-2 border rounded"
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
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          {showTax ? (
                            <select
                              value={row.tax}
                              onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="0">Nothing Selected</option>
                              <option value="10">GST:10%</option>
                              <option value="18">CGST:18%</option>
                              <option value="10">VAT:10%</option>
                              <option value="10">IGST:10%</option>
                              <option value="10">UTGST:10%</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value="0"
                              disabled
                              className="w-full p-2 border rounded bg-gray-100"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">
                          ₹{row.amount}
                        </td>
                        <td className="px-2 py-1 border-b text-center">
                          <Button 
                            danger 
                            onClick={() => handleDeleteRow(row.id)}
                            icon={<DeleteOutlined />}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="px-4 py-2 border-b">
                          <textarea
                            rows={2}
                            value={row.description}
                            onChange={(e) => handleTableDataChange(row.id, "description", e.target.value)}
                            placeholder="Description"
                            className="w-[70%] p-2 border rounded"
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

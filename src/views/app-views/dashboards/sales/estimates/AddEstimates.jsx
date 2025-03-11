import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  message,
  Button,
  Select,
  DatePicker,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useSelector, useDispatch } from "react-redux";
import { createquotations } from "./estimatesReducer/EstimatesSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { AddLable, GetLable } from "../LableReducer/LableSlice";

const { Option } = Select;

const AddEstimates = ({ onClose }) => {
  const [discountType, setDiscountType] = useState('percentage');
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const [discountValue, setDiscountValue] = useState(0);
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
    dispatch(getAllTaxes());
  }, [dispatch]);
  const { taxes } = useSelector((state) => state.tax);
  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});


  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      discount: 0,
      price: "",
      tax: 0,
      amount: "0",
      description: "",
    },
  ]);



  const handleFinish = async (values) => {
    try {

      const items = {};

      tableData.forEach((item, index) => {
        items[`item_${index + 1}`] = {
          item: item.item,
          description: item.description || '',
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          tax_name: selectedTaxDetails[item.id]?.gstName || '',
          tax: parseFloat(item.tax) || 0,
          amount: parseFloat(item.amount) || 0
        };
      });

      const quotationData = {
        customer: values.customer,
        issueDate: values.issueDate.format('YYYY-MM-DD'),
        category: values.category,
        items: items,
        total: totals.finalTotal,
        tax: totals.totalTax,
        discountType: discountType,
        discountValue: parseFloat(discountValue) || 0,
        discount: parseFloat(totals.discount) || 0, // Changed from discountAmount to discount
        discountAmount: parseFloat(totals.discount) || 0
      };

      await dispatch(createquotations(quotationData));
      message.success('Quotation created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating quotation:', error);
      message.error('Failed to create quotation');
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: "",
      tax: 0,
      amount: "0",
      description: "",
    };
    setTableData([...tableData, newRow]);
  };

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter(row => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, discountValue, discountType);
    } else {
      message.warning('At least one item is required');
    }
  };

  const navigate = useNavigate();

  const calculateTotal = (data = tableData, discountVal = discountValue, type = discountType) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data passed to calculateTotal');
      return;
    }

    const subtotal = data.reduce((sum, row) => {
      return sum + (parseFloat(row.amount) || 0);
    }, 0);

    // Calculate discount amount based on type
    const discountAmount = type === 'percentage'
      ? (subtotal * (parseFloat(discountVal) || 0)) / 100
      : parseFloat(discountVal) || 0;

    const totalTax = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = parseFloat(row.tax) || 0;
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      return sum + taxAmount;
    }, 0);

    const finalTotal = subtotal - discountAmount + totalTax;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discountVal ? discountAmount.toFixed(2) : '',
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
          const tax = parseFloat(field === 'tax' ? value : row.tax) || 0;

          const baseAmount = quantity * price;
          const taxAmount = (baseAmount * tax) / 100;
          const totalAmount = baseAmount + taxAmount;

          updatedRow.amount = totalAmount.toFixed(2);
        }

        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, discountValue, discountType);
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
          <hr className="mb-4 border-b  font-medium"></hr>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              loginEnabled: true,
            }}
          >
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
                <div className="form-buttons text-left mb-2 justify-end flex">
                  <Button
                    type="primary"
                    onClick={handleAddRow}
                    icon={<PlusOutlined />}
                  >
                    Add Items
                  </Button>
                </div>

                <table className="w-full border border-gray-200 bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Item<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Quantity<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Unit Price<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        TAX (%)
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Amount<span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Action
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
                              onChange={(e) => handleTableDataChange(row.id, 'item', e.target.value)}
                              placeholder="Item Name"
                              className="w-full p-2 border rounded"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) => handleTableDataChange(row.id, 'quantity', e.target.value)}
                              placeholder="Qty"
                              className="w-full p-2 border rounded"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-2 border-b">
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
                              placeholder="Price"
                              className="w-full p-2 border rounded"
                              min="0"
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
                            <span>{row.amount}</span>
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
                              onChange={(e) => handleTableDataChange(row.id, 'description', e.target.value)}
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

              {/* Summary Section */}
              <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                <table className='w-full lg:w-[50%] p-2'>
                  <tbody>
                    <tr className="flex justify-between px-2 py-2 border-x-2">
                      <td className="font-medium">Sub Total</td>
                      <td className="font-medium px-4 py-2">
                        ₹{totals.subtotal}
                      </td>
                    </tr>
                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                      <td className="font-medium">Discount</td>
                      <td className="flex items-center space-x-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Select
                            value={discountType}
                            onChange={(value) => {
                              setDiscountType(value);
                              setDiscountValue(0);
                              calculateTotal(tableData, 0, value);
                            }}
                            style={{ width: 120 }}
                          >
                            <Option value="percentage">Percentage</Option>
                            <Option value="fixed">Fixed Amount</Option>
                          </Select>
                          <input
                            type="number"
                            min="0"
                            max={discountType === 'percentage' ? 100 : undefined}
                            value={discountValue || ''}
                            onChange={(e) => {
                              const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              setDiscountValue(newValue);
                              calculateTotal(tableData, newValue, discountType);
                            }}
                            className="mt-1 block p-2 border rounded"
                            placeholder="Enter discount"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                      <td className="font-medium">Total Tax</td>
                      <td className="font-medium px-4 py-2">
                        ₹{totals.totalTax}
                      </td>
                    </tr>
                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                      <td className="font-bold text-lg">Total Amount</td>
                      <td className="font-bold text-lg px-4">
                        ₹{totals.finalTotal}
                      </td>
                    </tr>
                  </tbody>
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

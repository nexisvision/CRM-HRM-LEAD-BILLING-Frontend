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
  EyeOutlined,
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
import OrderListData from "assets/data/order-list.data.json";
import Flex from "components/shared-components/Flex";
import { Getmins } from "../../../dashboards/project/milestone/minestoneReducer/minestoneSlice";
import {
  updateInvoice,
  getInvoiceById,
} from "../../../dashboards/project/invoice/invoicereducer/InvoiceSlice";
import { useSelector, useDispatch } from "react-redux";
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createInvoice } from "../../../dashboards/project/invoice/invoicereducer/InvoiceSlice";
import * as Yup from "yup";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { GetProdu } from '../product/ProductReducer/ProductsSlice';
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import moment from "moment";

const { Option } = Select;

const EditInvoice = ({ idd, onClose }) => {
  const { id } = useParams();
  const [discountType, setDiscountType] = useState("%");
  const [loading, setLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');
  const [selectedCurrencyDetails, setSelectedCurrencyDetails] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const { currentInvoice } = useSelector((state) => state.invoice);
  const { data: milestones } = useSelector(
    (state) => state.Milestone.Milestone
  );

  const subClients = useSelector((state) => state.SubClient);
  const sub = subClients?.SubClient?.data;

  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data;
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

  const client = fnddata?.client;

  const user = useSelector((state) => state.user.loggedInUser.username);

  const currenciesState = useSelector((state) => state.currencies);

  const curr = currenciesState?.currencies?.data || [];

  const curren = curr?.filter((item) => item.created_by === user);

  const subClientData = sub?.find((subClient) => subClient?.id === client);

  // Add this selector to get products from Redux store
  const { data: products } = useSelector((state) => state.Product.Product);

  const { taxes } = useSelector((state) => state.tax);

  const { currencies } = useSelector((state) => state.currencies);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [totals, setTotals] = useState({
    subtotal: 0,
    itemDiscount: 0,
    globalDiscount: 0,
    discount: 0,
    totalTax: 0,
    finalTotal: 0,
  });

  useEffect(() => {
    dispatch(getInvoiceById(id));
  }, [dispatch]);

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
  // Handle currencies data when it changes
  useEffect(() => {
    if (curren) {
      setCurrenciesList(curren);
    }
  }, [curren]);

  // Fetch currencies
  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  // Fetch milestones when product changes
  useEffect(() => {
    dispatch(Getmins(id));
  }, [dispatch]);


  // Add this useEffect to fetch products when component mounts
  useEffect(() => {
    dispatch(GetProdu(id));
  }, [dispatch, id]);

  // Handle product selection
  const handleProductChange = (value) => {
    if (value) {
      const selectedProd = products?.find(p => p.id === value);
      setSelectedProduct(value);
      setSelectedMilestone(null); // Reset milestone selection when product is selected

      if (selectedProd) {
        // Update table data with product information
        setTableData([
          {
            id: Date.now(),
            item: selectedProd.name,
            quantity: 1,
            price: selectedProd.price,
            tax: selectedProd.tax || 0,
            // tax: selectedProd.tax || 0,
            amount: selectedProd.price.toString(),
            description: selectedProd.description
          }
        ]);
        calculateTotal([{
          quantity: 1,
          price: selectedProd.price,
          // tax: selectedProd.tax || 0,
          discount: 0
        }], discountRate);
      }
    } else {
      // If deselecting product, clear the table data
      setSelectedProduct(null);
      setTableData([{
        id: Date.now(),
        item: "",
        quantity: 1,
        price: "",
        // tax: 0,
        amount: "0",
        description: "",
      }]);
    }
  };

  // Handle milestone selection
  const handleMilestoneChange = (value) => {
    if (value) {
      const selectedMile = milestones?.find(m => m.id === value);
      setSelectedMilestone(value);
      setSelectedProduct(null); // Reset product selection when milestone is selected

      if (selectedMile) {
        // Update table data with milestone information
        setTableData([
          {
            id: Date.now(),
            item: selectedMile.milestone_title,
            quantity: 1,
            price: selectedMile.milestone_cost,
            tax: 0,
            amount: selectedMile.milestone_cost.toString(),
            description: selectedMile.milestone_summary
          }
        ]);
        calculateTotal([{
          quantity: 1,
          price: selectedMile.milestone_cost,
          tax: 0,
          discount: 0
        }], discountRate);
      }
    } else {
      // If deselecting milestone, clear the table data
      setSelectedMilestone(null);
      setTableData([{
        id: Date.now(),
        item: "",
        quantity: 1,
        price: "",
        tax: 0,
        amount: "0",
        description: "",
      }]);
    }
  };

  useEffect(() => {
    if (currentInvoice) {
      // Set form values
      form.setFieldsValue({
        client: currentInvoice.client,
        project: currentInvoice.project,
        currency: currentInvoice.currency,
        issueDate: moment(currentInvoice.issueDate), // Convert to moment object
        dueDate: moment(currentInvoice.dueDate), // Convert to moment object
        calctax: currentInvoice.tax_calculation,
        clientName: subClientData?.username,
        projectName: fnddata?.project_name,
      });

      // Set currency details
      const selectedCurrency = curren?.find(c => c.id === currentInvoice.currency);
      if (selectedCurrency) {
        setSelectedCurrencyIcon(selectedCurrency.currencyIcon);
        setSelectedCurrencyDetails(selectedCurrency);
      }

      // Set table data with proper calculations
      if (currentInvoice.items && currentInvoice.items.length > 0) {
        const formattedItems = currentInvoice.items.map(item => ({
          id: Date.now() + Math.random(), // Generate unique id
          item: item.item,
          quantity: item.quantity,
          price: item.price,
          tax: item.tax_percentage || 0,
          discount: item.discount_percentage || 0,
          amount: item.final_amount?.toString() || "0",
          description: item.description || ""
        }));

        setTableData(formattedItems);
        calculateTotal(formattedItems, currentInvoice.discount_value || 0);
      }

      // Set discount related states
      setDiscountType(currentInvoice.discount_type || "%");
      setDiscountValue(currentInvoice.discount_value || 0);
      setDiscountRate(currentInvoice.discount_value || 0);
    }
  }, [currentInvoice, form, subClientData, fnddata, curren]);

  const initialValues = {
    issueDate: null,
    dueDate: null,
    currency: '',
    client: fnddata?.client || "",
    project: fnddata?.id || "",
    calctax: '',
  };

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const itemsArray = tableData.map((item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        const itemDiscountPercentage = parseFloat(item.discount) || 0;
        const taxPercentage = parseFloat(item.tax) || 0;

        const baseAmount = quantity * price;
        const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
        const taxAmount = (baseAmount * taxPercentage) / 100;
        const itemTotal = baseAmount - itemDiscountAmount + taxAmount;

        return {
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
      });

      const invoiceData = {
        project: values.project,
        currency: values.currency,
        client: values.client,
        issueDate: values.issueDate.format("YYYY-MM-DD"),
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        tax_calculation: values.calctax,
        items: itemsArray,
        sub_total: totals.subtotal,
        discount_type: discountType,
        discount_value: discountRate,
        total_tax: totals.totalTax,
        final_total: totals.finalTotal
      };

      await dispatch(updateInvoice({ idd, data: invoiceData }));
      onClose();
      navigate("/app/dashboards/project/invoice");
    } catch (error) {
      message.error("Failed to update invoice: " + (error.message || "Unknown error"));
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
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: "",
        tax: 0,
        amount: "0",
        description: "",
      }
    ]);
  };

  // Delete row
  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedTableData = tableData.filter(row => row.id !== id);
      setTableData(updatedTableData);
      calculateTotal(updatedTableData, discountRate); // Recalculate totals after deletion
    } else {
      message.warning('At least one item is required');
    }
  };

  const navigate = useNavigate();



  const calculateTotal = (data, discountRate) => {
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

  // Modified currency selection handler
  const handleCurrencyChange = (currencyId) => {
    const selectedCurrency = curren?.find(c => c.id === currencyId);
    if (selectedCurrency) {
      setSelectedCurrencyIcon(selectedCurrency.currencyIcon);
      setSelectedCurrencyDetails(selectedCurrency);
      form.setFieldsValue({ currency: currencyId });
    }
  };

  // Modify the currency form item
  const renderCurrencySelect = () => (
    <Form.Item
      name="currency"
      label="Currency"
      rules={[{ required: true, message: "Please select a currency" }]}
    >
      <Select
        className="w-full"
        placeholder="Select Currency"
        onChange={handleCurrencyChange}
      >
        {curren?.map((currency) => (
          <Option key={currency.id} value={currency.id}>
            {currency.currencyCode} ({currency.currencyIcon})
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  // Modify the table to show currency icons in all price/amount fields
  const renderTableRows = () => (
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
  );

  // Modify the summary section to show currency icons
  const renderSummarySection = () => (
    <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
      <table className="w-full lg:w-[50%] p-2">
        <tbody>
          <tr className="flex justify-between px-2 py-2 border-x-2">
            <td className="font-medium">Sub Total</td>
            <td className="font-medium px-4 py-2">
              {selectedCurrencyIcon} {totals.subtotal}
            </td>
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
            <td className="font-medium px-4 py-2">
              {selectedCurrencyIcon} {totals.globalDiscount}
            </td>
          </tr>

          <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
            <td className="font-medium">Total Tax</td>
            <td className="font-medium px-4 py-2">
              {selectedCurrencyIcon} {totals.totalTax}
            </td>
          </tr>

          <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
            <td className="font-bold text-lg">Total Amount</td>
            <td className="font-bold text-lg px-4">
              {selectedCurrencyIcon} {totals.finalTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div>
        <div className=" ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
          <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues}
          >
            {/* <Card className="border-0 mt-2"> */}
            <div className="">
              <div className=" p-2">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="issueDate"
                      label="Issue Date"
                      rules={[
                        {
                          required: true,
                          message: "Please select the issue date",
                        },
                      ]}
                    >
                      <DatePicker className="w-full" format="DD-MM-YYYY" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="dueDate"
                      label="Due Date"
                      rules={[
                        {
                          required: true,
                          message: "Please select the due date",
                        },
                      ]}
                    >
                      <DatePicker className="w-full" format="DD-MM-YYYY" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    {renderCurrencySelect()}
                  </Col>
                
                  <Col span={12}>
                    <Form.Item
                      name="clientName"
                      label="Client Name"
                      initialValue={subClientData?.username}
                      rules={[{ required: true, message: "Please enter the client name" }]}
                    >
                      <Input placeholder="Enter client name" disabled />
                    </Form.Item>
                    {/* Hidden field to pass the client ID */}
                    <Form.Item name="client" initialValue={fnddata?.client} hidden>
                      <Input type="hidden" />
                    </Form.Item>
                  </Col>


                  <Col span={12}>
                    {/* Display the project name */}
                    <Form.Item
                      name="projectName"
                      label="Project Name"
                      initialValue={fnddata?.project_name}
                      rules={[{ required: true, message: "Please enter the project name" }]}
                    >
                      <Input placeholder="Enter project name" disabled />
                    </Form.Item>

                    {/* Hidden field to pass the project ID */}
                    <Form.Item name="project" initialValue={fnddata?.id} hidden>
                      <Input type="hidden" />
                    </Form.Item>
                  </Col>




                  <Col span={12}>
                    <Form.Item
                      name="calctax"
                      label="Calculate Tax"
                      rules={[
                        {
                          required: true,
                          message: "Please select a tax calculation method",
                        },
                      ]}
                    >
                      <Select placeholder="Select Tax Calculation Method">
                        <Option value="after">After Discount</Option>
                        <Option value="before">Before Discount</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>

            <div>
              <div className="overflow-x-auto">
                <Flex
                  alignItems="center"
                  mobileFlex={false}
                  className="flex mb-4 gap-4"
                >
                  <Flex className="flex " mobileFlex={false}>
                    <div className="w-full flex gap-4">
                      <div>
                        <Select
                          value={selectedProduct}
                          onChange={handleProductChange}
                          className="w-full !rounded-none"
                          placeholder="Select Product"
                          rootClassName="!rounded-none"
                          allowClear
                        >
                          {products?.map((product) => (
                            <Option key={product.id} value={product.id}>
                              {product.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </Flex>
                  <Flex gap="7px" className="flex">
                    <div className="w-full flex gap-4">
                      <div>
                        <Select
                          value={selectedMilestone}
                          onChange={handleMilestoneChange}
                          className="w-full !rounded-none"
                          placeholder="Select Milestone"
                          rootClassName="!rounded-none"
                          loading={loading}
                        >
                          {milestones?.map((milestone) => (
                            <Option key={milestone.id} value={milestone.id}>
                              {milestone.milestone_title}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </Flex>
                </Flex>

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
                        Discount <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        TAX (%)
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Amount<span className="text-red-500">*</span>
                      </th>
                    </tr>
                  </thead>
                  {renderTableRows()}
                </table>
              </div>
              {renderSummarySection()}
              <div className="mt-4">
                <span className="block mb-2">Add File</span>
                <Col span={24}>
                  <Upload
                    action="http://localhost:5500/api/users/upload-cv"
                    listType="picture"
                    accept=".pdf"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    className="border-2  justify-center items-center p-10 block"
                  >
                    <CloudUploadOutlined className="text-4xl" />
                    <span className="text-xl">Choose File</span>
                  </Upload>
                </Col>
              </div>
            </div>

            <Form.Item className="mt-4">
              <Row justify="end" gutter={16}>
                <Col>
                  <Button
                    onClick={() => navigate("/app/dashboards/project/invoice")}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Update
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

export default EditInvoice;
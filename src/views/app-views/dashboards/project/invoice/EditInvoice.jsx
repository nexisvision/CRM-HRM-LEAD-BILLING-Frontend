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
import { ErrorMessage } from "formik";
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
  getAllInvoices,
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
import dayjs from "dayjs";

const { Option } = Select;

const EditInvoice = ({ idd, onClose,setFieldValue,values }) => {
  const { id } = useParams();
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');
  const [selectedCurrencyDetails, setSelectedCurrencyDetails] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});
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

  const curren = currenciesState?.currencies?.data || [];

  // const curren = curr?.filter((item) => item.created_by === user);

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
    dispatch(getAllTaxes());
  }, [dispatch]);

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: "",
      discountType: "percentage", // Add default discount type
      discount: 0, // Add default discount value
      tax: 0,
      amount: "0",
      description: "",
      hsn_sac: ""
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
        setSelectedMilestone(null); // Reset milestone selection when product is selected
        setSelectedProduct(value);

        if (selectedProd) {
            // Update table data with product information
            const newTableData = [{
                id: Date.now(),
                item: selectedProd.name || '', // Product name
                quantity: 1,
                price: selectedProd.price || 0, // Product price
                hsn_sac: selectedProd.hsn_sac || '', // HSN/SAC code
                tax: 0,
                discountType: "percentage",
                discount: 0,
                amount: selectedProd.price?.toString() || "0",
                description: selectedProd.description || '', // Product description
                base_amount: selectedProd.price || 0,
                tax_amount: 0,
                discount_amount: 0
            }];

            setTableData(newTableData);
            calculateTotal(newTableData, discountRate);
        }
    } else {
        // If deselecting product, clear the table data
        setSelectedProduct(null);
        const emptyRow = {
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            hsn_sac: "",
            tax: 0,
            discountType: "percentage",
            discount: 0,
            amount: "0",
            description: "",
            base_amount: 0,
            tax_amount: 0,
            discount_amount: 0
        };
        setTableData([emptyRow]);
        calculateTotal([emptyRow], discountRate);
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
            const newTableData = [{
                id: Date.now(),
                item: selectedMile.milestone_title || '', // Milestone name
                quantity: 1,
                price: selectedMile.milestone_cost || 0, // Milestone cost
                tax: 0,
                discountType: "percentage",
                discount: 0,
                amount: selectedMile.milestone_cost?.toString() || "0",
                description: selectedMile.milestone_summary || '', // Milestone description
                hsn_sac: "",
                base_amount: selectedMile.milestone_cost || 0,
                tax_amount: 0,
                discount_amount: 0
            }];

            setTableData(newTableData);
            calculateTotal(newTableData, discountRate);
        }
    } else {
        // If deselecting milestone, clear the table data
        setSelectedMilestone(null);
        const emptyRow = {
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            discountType: "percentage",
            discount: 0,
            amount: "0",
            description: "",
            hsn_sac: "",
            base_amount: 0,
            tax_amount: 0,
            discount_amount: 0
        };
        setTableData([emptyRow]);
        calculateTotal([emptyRow], discountRate);
    }
  };

  useEffect(() => {
    const setInvoiceData = async () => {
        if (currentInvoice) {
            try {
                console.log("Current Invoice:", currentInvoice);

                // Set basic form fields
                form.setFieldsValue({
                    invoiceNumber: currentInvoice.invoiceNumber,
                    client: currentInvoice.client,
                    project: currentInvoice.project,
                    currency: currentInvoice.currency,
                    issueDate: dayjs(currentInvoice.issueDate),
                    dueDate: dayjs(currentInvoice.dueDate),
                });

                // Parse items from JSON string
                if (currentInvoice.items) {
                    try {
                        const parsedItems = JSON.parse(currentInvoice.items);
                        console.log("Parsed Items:", parsedItems);

                        // Create formatted items array
                        const formattedItems = parsedItems.map(item => {
                            return {
                                id: Date.now() + Math.random(),
                                item: item.item || '',
                                quantity: Number(item.quantity) || 0,
                                price: Number(item.price) || 0,
                                tax_name: item.tax_name || '',
                                tax: Number(item.tax_percentage) || 0,
                                tax_amount: Number(item.tax_amount) || 0,
                                discount: Number(item.discount_percentage) || 0,
                                discount_amount: Number(item.discount_amount) || 0,
                                base_amount: Number(item.base_amount) || 0,
                                amount: Number(item.final_amount) || 0,
                                description: item.description || '',
                                hsn_sac: item.hsn_sac || '',
                                discountType: item.discount_type || "percentage",
                                discount: Number(item.discount_percentage) || 0
                            };
                        });

                        console.log("Formatted Items:", formattedItems);

                        // Set table data
                        setTableData(formattedItems);

                        // Calculate and set totals
                        const totalsData = {
                            subtotal: formattedItems.reduce((sum, item) => sum + Number(item.base_amount), 0),
                            itemDiscount: formattedItems.reduce((sum, item) => sum + Number(item.discount_amount), 0),
                            totalTax: Number(currentInvoice.tax) || 0,
                            finalTotal: Number(currentInvoice.total) || 0
                        };

                        setTotals(totalsData);
                        setDiscountRate(Number(currentInvoice.discount) || 0);

                        // Set tax details for each item
                        formattedItems.forEach(item => {
                            if (item.tax && item.tax_name) {
                                setSelectedTaxDetails(prev => ({
                                    ...prev,
                                    [item.id]: {
                                        gstName: item.tax_name,
                                        gstPercentage: item.tax
                                    }
                                }));
                            }
                        });

                    } catch (error) {
                        console.error("Error parsing items:", error);
                        message.error("Error loading invoice items");
                    }
                }

                // Set currency and update currency icon
                if (currentInvoice.currency && curren) {
                    const selectedCurrency = curren.find(c => c.id === currentInvoice.currency);
                    if (selectedCurrency) {
                        form.setFieldsValue({ currency: currentInvoice.currency });
                        setSelectedCurrencyIcon(selectedCurrency.currencyIcon || '₹');
                        setSelectedCurrencyDetails({
                            currencyCode: selectedCurrency.currencyCode,
                            currencyIcon: selectedCurrency.currencyIcon,
                            id: selectedCurrency.id
                        });
                    }
                }

            } catch (error) {
                console.error("Error setting invoice data:", error);
                message.error("Failed to load invoice details");
            }
        }
    };

    setInvoiceData();
}, [currentInvoice, form, curren]);

// Add this debug useEffect
useEffect(() => {
    console.log("Current Table Data:", tableData);
}, [tableData]);

  const initialValues = {
    issueDate: null,
    dueDate: null,
    currency: '',
    client: fnddata?.client || "",
    project: fnddata?.id || "",
    // calctax: '',
  };

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // Format items for database storage
      const itemsForDb = tableData.map(item => ({
        item: item.item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        tax_name: item.tax_name,
        tax_percentage: Number(item.tax),
        tax_amount: Number(item.tax_amount),
        discount_percentage: Number(item.discount),
        discount_amount: Number(item.discount_amount),
        base_amount: Number(item.base_amount),
        final_amount: Number(item.amount),
        description: item.description,
        hsn_sac: item.hsn_sac
      }));

      const invoiceData = {
        ...values,
        issueDate: values.issueDate.format("YYYY-MM-DD"),
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        project: fnddata?.project_name,
        client: fnddata?.client,
        items: itemsForDb,
        discount: discountRate,
        global_discount_amount: totals.globalDiscount,
        total_item_discount: totals.itemDiscount,
        tax: totals.totalTax,
        total: totals.finalTotal
      };

      await dispatch(updateInvoice({ idd, data: invoiceData }));
      message.success("Invoice updated successfully!");
      onClose();
      dispatch(getAllInvoices(id));

    } catch (error) {
      console.error("Error updating invoice:", error);
      message.error("Failed to update invoice");
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
        discountType: "percentage",
        discount: 0,
        amount: "0",
        description: "",
        hsn_sac: ""
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



  const calculateTotal = (data, globalDiscountValue) => {
    // Calculate row-level totals first
    const calculatedTotals = data.reduce((acc, row) => {
        // Base calculations
        const quantity = parseFloat(row.quantity) || 0;
        const unitPrice = parseFloat(row.price) || 0;
        const baseAmount = quantity * unitPrice;

        // Item discount calculation
        let itemDiscountAmount = 0;
        if (row.discountType === "percentage") {
            const discountPercentage = parseFloat(row.discount) || 0;
            itemDiscountAmount = (baseAmount * discountPercentage) / 100;
        } else {
            itemDiscountAmount = parseFloat(row.discount) || 0;
        }

        // Tax calculation
        const taxPercentage = parseFloat(row.tax) || 0;
        const amountAfterDiscount = baseAmount - itemDiscountAmount;
        const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

        // Row total amount
        const rowAmount = baseAmount - itemDiscountAmount + taxAmount;

        return {
            totalBaseAmount: acc.totalBaseAmount + baseAmount,
            totalItemDiscount: acc.totalItemDiscount + itemDiscountAmount,
            totalTax: acc.totalTax + taxAmount,
            totalAmount: acc.totalAmount + rowAmount
        };
    }, { totalBaseAmount: 0, totalItemDiscount: 0, totalTax: 0, totalAmount: 0 });

    // Calculate global discount
    let globalDiscountAmount = 0;
    if (discountType === 'percentage') {
        globalDiscountAmount = (calculatedTotals.totalAmount * globalDiscountValue) / 100;
    } else {
        globalDiscountAmount = parseFloat(globalDiscountValue) || 0;
    }

    // Calculate final total
    const finalTotal = calculatedTotals.totalAmount - globalDiscountAmount;

    // Update totals state
    setTotals({
        subtotal: calculatedTotals.totalAmount.toFixed(2),
        itemDiscount: calculatedTotals.totalItemDiscount.toFixed(2),
        globalDiscount: globalDiscountAmount.toFixed(2),
        totalTax: calculatedTotals.totalTax.toFixed(2),
        finalTotal: finalTotal.toFixed(2)
    });

    // Update table data with calculated amounts
    const updatedData = data.map(row => {
        const quantity = parseFloat(row.quantity) || 0;
        const unitPrice = parseFloat(row.price) || 0;
        const baseAmount = quantity * unitPrice;

        // Calculate item discount
        let itemDiscountAmount = 0;
        if (row.discountType === "percentage") {
            const discountPercentage = parseFloat(row.discount) || 0;
            itemDiscountAmount = (baseAmount * discountPercentage) / 100;
        } else {
            itemDiscountAmount = parseFloat(row.discount) || 0;
        }

        // Calculate tax
        const taxPercentage = parseFloat(row.tax) || 0;
        const amountAfterDiscount = baseAmount - itemDiscountAmount;
        const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

        // Calculate row total
        const rowAmount = baseAmount - itemDiscountAmount + taxAmount;

        return {
            ...row,
            base_amount: baseAmount.toFixed(2),
            discount_amount: itemDiscountAmount.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
            amount: rowAmount.toFixed(2)
        };
    });

    setTableData(updatedData);
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map(row => {
        if (row.id === id) {
            return { ...row, [field]: value };
        }
        return row;
    });
    setTableData(updatedData);
    calculateTotal(updatedData, discountValue);
};

  // Modified currency selection handler
  const handleCurrencyChange = (currencyId) => {
    const selectedCurrency = curren?.find(c => c.id === currencyId);
    if (selectedCurrency) {
      setSelectedCurrencyIcon(selectedCurrency.currencyIcon || '₹');
      setSelectedCurrencyDetails({
        currencyCode: selectedCurrency.currencyCode,
        currencyIcon: selectedCurrency.currencyIcon,
        id: selectedCurrency.id
      });
    }
  };


  // Modify the currency form item
  const renderCurrencySelect = () => (
    <Form.Item
      name="currency"
      label="Currency"
      rules={[{ required: true, message: "Please select currency" }]}
    >
      <Select
        className="w-full"
        placeholder="Select Currency"
        onChange={(value) => {
          const selectedCurrency = curren?.find(c => c.id === value);
          if (selectedCurrency) {
            setSelectedCurrencyIcon(selectedCurrency.currencyIcon || '₹');
            setSelectedCurrencyDetails({
              currencyCode: selectedCurrency.currencyCode,
              currencyIcon: selectedCurrency.currencyIcon,
              id: selectedCurrency.id
            });
            form.setFieldsValue({ currency: value });
          }
        }}
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
            <td className="px-2 py-2 border-b">
              <input
                type="text"
                value={row.item}
                onChange={(e) => handleTableDataChange(row.id, "item", e.target.value)}
                placeholder="Item Name"
                className="w-full p-2 border rounded-s"
              />
            </td>
            <td className="px-2 py-2 border-b">
              <input
                type="number"
                value={row.quantity}
                onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                placeholder="Qty"
                className="w-[100px] p-2 border rounded"
                min="1"
              />
            </td>
            <td className="px-2 py-2 border-b">
              <Input
                prefix={selectedCurrencyIcon}
                type="number"
                value={row.price}
                onChange={(e) => handleTableDataChange(row.id, "price", e.target.value)}
                placeholder="Price"
                className="w-full p-2"
                min="0"
              />
            </td>
            <td className="px-2 py-2 border-b">
                            <div className="flex space-x-2">
                                <Select
                                    value={row.discountType || "percentage"}
                                    onChange={(value) => handleTableDataChange(row.id, "discountType", value)}
                                    style={{ width: 100}}
                                >
                                    <Option value="fixed">Fixed</Option>
                                    <Option value="percentage">Percentage</Option>
                                </Select>
                                <Input
                                    type="number"
                                    min="0"
                                    max={row.discountType === "percentage" ? 100 : undefined}
                                    value={row.discount || 0}
                                    onChange={(e) => {
                                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                                        handleTableDataChange(row.id, "discount", value);
                                    }}
                                    prefix={row.discountType === "fixed" ? selectedCurrencyIcon : ""}
                                    suffix={row.discountType === "percentage" ? "%" : ""}
                                    className="w-[100px]"
                                />
                            </div>
                        </td>
            <td className="px-2 py-2 border-b">
              <input
                type="text"
                value={row.hsn_sac || ""}
                onChange={(e) => handleTableDataChange(row.id, "hsn_sac", e.target.value)}
                placeholder="HSN/SAC"
                className="w-full p-2 border rounded"
                disabled={selectedMilestone !== null} // Disable if milestone is selected
              />
            </td>
            <td className="px-2 py-2 border-b">
                            <Select
                                value={row.tax?.gstPercentage ? `${row.tax.gstName}|${row.tax.gstPercentage}` : '0'}
                                onChange={(value) => {
                                    if (!value || value === '0') {
                                        handleTableDataChange(row.id, "tax", null);
                                        return;
                                    }
                                    const [gstName, gstPercentage] = value.split('|');
                                    handleTableDataChange(row.id, "tax", {
                                        gstName,
                                        gstPercentage: parseFloat(gstPercentage) || 0
                                    });
                                }}
                                placeholder="Select Tax"
                                className="w-[150px]"
                                allowClear
                            >
                                {/* <Option value="0">0</Option> */}
                                {taxes && taxes.data && taxes.data.map(tax => (
                                    <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
                                        {tax.gstName} ({tax.gstPercentage}%)
                                    </Option>
                                ))}
                            </Select>
                        </td>
            <td className="px-2 py-2 border-b">
              <span>{selectedCurrencyIcon} {row.amount}</span>
            </td>
            <td className="px-2 py-1 border-b text-center">
              <Button danger onClick={() => handleDeleteRow(row.id)}>
                <DeleteOutlined />
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan={8} className="px-2 py-2 border-b">
              <textarea
                rows={2}
                value={row.description ? row.description.replace(/<[^>]*>/g, '') : ''} // Remove HTML tags
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

                {/* Global/Invoice Discount Section */}
                <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                        <td className="font-medium">Items Discount</td>
                        <td className="flex items-center space-x-2">
                            <Select
                                value={discountType}
                                onChange={handleDiscountTypeChange}
                                style={{ width: 120 }}
                            >
                                <Option value="fixed">Fixed</Option>
                                <Option value="percentage">Percentage</Option>
                            </Select>
                            <Input
                                type="number"
                                value={discountValue || 0} // Ensure 0 is displayed when empty
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                style={{ width: 120 }}
                                min={0}
                                max={discountType === 'percentage' ? 100 : undefined}
                                prefix={discountType === 'fixed' ? selectedCurrencyIcon : ''}
                                suffix={discountType === 'percentage' ? '%' : ''}
                            />
                        </td>
                    </tr>

                    {parseFloat(totals.globalDiscount) > 0 && (
                        <tr className="flex justify-between px-2 py-2 border-x-2">
                            <td className="font-medium">Discount Amount</td>
                            <td className="font-medium px-4 py-2 text-red-500">
                                -{selectedCurrencyIcon} {totals.globalDiscount}
                            </td>
                        </tr>
                    )}

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

  // Add these handlers for discount management
  const handleDiscountTypeChange = (value) => {
    setDiscountType(value);
    setDiscountValue(0); // Reset discount value when type changes
    calculateTotal(tableData, 0); // Recalculate with zero discount
  };

  const handleDiscountChange = (value) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setDiscountValue(numValue);
    calculateTotal(tableData, numValue);
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
                    <Form.Item
                      name="currency"
                      label="Currency"
                      rules={[{ required: true, message: "Please select currency" }]}
                    >
                      <Select
                        className="w-full"
                        placeholder="Select Currency"
                        onChange={(value) => {
                          const selectedCurrency = curren?.find(c => c.id === value);
                          if (selectedCurrency) {
                            setSelectedCurrencyIcon(selectedCurrency.currencyIcon || '₹');
                            setSelectedCurrencyDetails({
                              currencyCode: selectedCurrency.currencyCode,
                              currencyIcon: selectedCurrency.currencyIcon,
                              id: selectedCurrency.id
                            });
                            form.setFieldsValue({ currency: value });
                          }
                        }}
                      >
                        {curren?.map((currency) => (
                          <Option key={currency.id} value={currency.id}>
                            {currency.currencyCode} ({currency.currencyIcon})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
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
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Item<span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Quantity<span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Unit Price <span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Discount <span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Hsn/Sac <span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        TAX (%)
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Amount<span className="text-red-500">*</span>
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {renderTableRows()}
                </table>
                <div className="form-buttons text-left mt-2">
                  <Button type="primary" onClick={handleAddRow}>
                    <PlusOutlined /> Add Items
                  </Button>
                </div>
              </div>
              {renderSummarySection()}
              {/* <div className="mt-4">
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
              </div> */}
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
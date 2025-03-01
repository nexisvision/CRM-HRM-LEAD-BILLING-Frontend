import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex';
import { Getmins } from '../../../dashboards/project/milestone/minestoneReducer/minestoneSlice';
import { useSelector, useDispatch } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createInvoice, getAllInvoices } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
import * as Yup from 'yup';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';
import { GetProdu } from '../product/ProductReducer/ProductsSlice';
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"

const { Option } = Select;

const AddInvoice = ({ onClose }) => {

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');
    const [selectedCurrencyDetails, setSelectedCurrencyDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [showFields, setShowFields] = useState(false);
    const { data: milestones } = useSelector((state) => state.Milestone.Milestone);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);


    // const [selectedProject, setSelectedProject] = useState(null);
    // const [clientOptions, setClientOptions] = useState([]);


    const user = useSelector((state) => state.user.loggedInUser.username);

    const currenciesState = useSelector((state) => state.currencies);

    const curren = currenciesState?.currencies?.data || [];

    // const curren = curr?.filter((item) => item.created_by === user);

    const [currenciesList, setCurrenciesList] = useState([]);
    const [discountRate, setDiscountRate] = useState(0);
    const dispatch = useDispatch();


    const subClientsss = useSelector((state) => state.SubClient);
const sub = subClientsss?.SubClient?.data;



    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

    
    const client = fnddata?.client;

    const subClientData = sub?.find((subClient) => subClient?.id === client);

     // Add this selector to get products from Redux store
    //  const { data: products } = useSelector((state) => state.Product.Product);

      // Add this to get taxes from Redux store
    const { taxes } = useSelector((state) => state.tax);

    // console.log("SubClient Data:", subClientData.username);

    // const { subClients } = useSelector((state) => state.SubClient.SubClient.data); 

    const [form] = Form.useForm();
    const [totals, setTotals] = useState({
        subtotal: 0,
        itemDiscount: 0,
        globalDiscount: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });

    // Add new state for row-level discount types
    const [rowDiscountTypes, setRowDiscountTypes] = useState({});

    // Modify the table data state initialization to include discount type
    const [tableData, setTableData] = useState([
        {
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            discountType: "percentage", // Add default discount type
            discount: 0, // Add default discount value
            amount: "0",
            description: "",
        }
    ]);

    // Fetch currencies
    useEffect(() => {
        dispatch(getcurren());
    }, [dispatch]);

    // Handle currencies data when it changes
    useEffect(() => {
        if (curren) {
            setCurrenciesList(curren);
        }
    }, [curren]);

    // Fetch milestones when product changes
    useEffect(() => {
        dispatch(Getmins(id));
    }, [dispatch]);

   
    
    // Add this useEffect to fetch products when component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await dispatch(GetProdu(id));
                if (response.payload && response.payload.data) {
                    setProducts(response.payload.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                message.error("Failed to load products");
            }
        };
        fetchProducts();
    }, [dispatch, id]);

    // Handle product selection
    const handleProductChange = (productId) => {
        if (productId) {
            // Clear milestone selection when product is selected
            setSelectedMilestone(null);
            form.setFieldsValue({
                milestone: undefined
            });

            const selectedProd = products.find(p => p.id === productId);
            if (selectedProd) {
                // Update the current row with product details
                const updatedData = tableData.map(row => ({
                    ...row,
                    item: selectedProd.name,
                    hsn_sac: selectedProd.hsn_sac || '',
                    price: selectedProd.price,
                    description: selectedProd.description || ""
                }));
                setTableData(updatedData);
                setSelectedProduct(productId);
                calculateTotal(updatedData, discountRate);
            }
        }
    };

    // Handle milestone selection
    const handleMilestoneChange = (value) => {
        if (value) {
            // Clear product selection when milestone is selected
            setSelectedProduct(null);
            form.setFieldsValue({
                product: undefined
            });

            const selectedMile = milestones?.find(m => m.id === value);
            setSelectedMilestone(value);

            if (selectedMile) {
                // Create new table data with milestone information
                const newTableData = [{
                    id: Date.now(),
                    item: selectedMile.milestone_title || '',
                    quantity: 1,
                    price: parseFloat(selectedMile.milestone_cost) || 0,
                    tax: 0,
                    discount: 0,
                    amount: selectedMile.milestone_cost?.toString() || '0',
                    description: selectedMile.milestone_summary || '',
                    hsn_sac: ''
                }];

                setTableData(newTableData);
                calculateTotal(newTableData, discountRate);
            }
        }
    };

     // Add this useEffect to fetch taxes when component mounts
  useEffect(() => {
    dispatch(getAllTaxes());
  }, [dispatch]);

    const handleFinish = () => {
        form
          .validateFields()
          .then((values) => {
            const itemsArray = tableData.map((item) => {
                const quantity = parseFloat(item.quantity) || 0;
                const unitPrice = parseFloat(item.price) || 0;
                const itemDiscountPercentage = parseFloat(item.discount) || 0;
                const taxDetails = item.tax || { gstName: '', gstPercentage: 0 };

                // Calculate per unit amounts
                const discountAmount = (unitPrice * itemDiscountPercentage) / 100;
                const gstAmount = (unitPrice * taxDetails.gstPercentage) / 100;
                const unitAmount = unitPrice - discountAmount + gstAmount;
                
                // Calculate total amounts
                const totalAmount = unitAmount * quantity;

                return {
                    item: item.item,
                    quantity: quantity,
                    price: unitPrice,
                    tax_name: taxDetails.gstName,
                    tax_percentage: taxDetails.gstPercentage,
                    tax_amount: gstAmount * quantity,
                    discount_percentage: itemDiscountPercentage,
                    discount_amount: discountAmount * quantity,
                    base_amount: unitPrice * quantity,
                    final_amount: totalAmount,
                    description: item.description || "",
                    hsn_sac: item.hsn_sac || ""
                };
            });

            const invoiceData = {
                product_id: id,
                issueDate: values.issueDate.format('YYYY-MM-DD'),
                dueDate: values.dueDate.format('YYYY-MM-DD'),
                client: values.client,
                project: values.project,
                currency: values.currency,
                currencyIcon: selectedCurrencyIcon,
                currencyCode: selectedCurrencyDetails?.currencyCode,
                // tax_calculation: values.calctax,
                items: itemsArray,
                subtotal: totals.subtotal,
                discount: discountRate,
                global_discount_amount: totals.globalDiscount,
                total_item_discount: totals.itemDiscount,
                tax: totals.totalTax,
                total: totals.finalTotal,
                status: "pending"
            };

            dispatch(createInvoice({ id, invoiceData }))
              .then(() => {

                dispatch(getAllInvoices(id));
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

    const calculateTotal = (data, globalDiscountValue) => {
        const calculatedTotals = data.reduce((acc, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const unitPrice = parseFloat(row.price) || 0;
            const baseAmount = unitPrice * quantity;
            
            // Calculate item discount based on type
            let itemDiscountAmount = 0;
            if (row.discountType === "percentage") {
                const discountPercentage = parseFloat(row.discount) || 0;
                itemDiscountAmount = (baseAmount * discountPercentage) / 100;
            } else {
                itemDiscountAmount = parseFloat(row.discount) || 0;
            }

            const taxPercentage = row.tax ? parseFloat(row.tax.gstPercentage) || 0 : 0;
            const gstAmount = ((baseAmount - itemDiscountAmount) * taxPercentage) / 100;
            
            // Calculate final amount for this row
            const rowAmount = baseAmount - itemDiscountAmount + gstAmount;

            return {
                totalBaseAmount: acc.totalBaseAmount + baseAmount,
                totalItemDiscount: acc.totalItemDiscount + itemDiscountAmount,
                totalTax: acc.totalTax + gstAmount,
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
            const baseAmount = unitPrice * quantity;
            
            let itemDiscountAmount = 0;
            if (row.discountType === "percentage") {
                const discountPercentage = parseFloat(row.discount) || 0;
                itemDiscountAmount = (baseAmount * discountPercentage) / 100;
            } else {
                itemDiscountAmount = parseFloat(row.discount) || 0;
            }

            const taxPercentage = row.tax ? parseFloat(row.tax.gstPercentage) || 0 : 0;
            const gstAmount = ((baseAmount - itemDiscountAmount) * taxPercentage) / 100;
            const rowAmount = baseAmount - itemDiscountAmount + gstAmount;

            return {
                ...row,
                amount: rowAmount.toFixed(2)
            };
        });

        setTableData(updatedData);
    };

    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                
                // Calculate amount immediately for display
                const quantity = parseFloat(updatedRow.quantity) || 0;
                const unitPrice = parseFloat(updatedRow.price) || 0;
                const itemDiscountPercentage = parseFloat(updatedRow.discount) || 0;
                const taxPercentage = updatedRow.tax ? parseFloat(updatedRow.tax.gstPercentage) || 0 : 0;

                // Calculate per unit amounts
                const discountAmount = (unitPrice * itemDiscountPercentage) / 100;
                const gstAmount = (unitPrice * taxPercentage) / 100;
                const unitAmount = unitPrice - discountAmount + gstAmount;
                
                // Calculate total row amount
                const rowAmount = unitAmount * quantity;

                updatedRow.amount = rowAmount.toFixed(2);
                return updatedRow;
            }
            return row;
        });

        setTableData(updatedData);
        calculateTotal(updatedData, discountRate);
    };

    const initialValues = {
        issueDate: null,
        dueDate: null,
        currency: '',
        client: fnddata?.client || "",
        project: fnddata?.id || "",
        calctax: '',
    };

    const validationSchema = Yup.object({
        issueDate: Yup.date().nullable().required('Invoice Date is required.'),
        dueDate: Yup.date().nullable().required('Due Date is required.'),
        currency: Yup.string().required('Please select currency.'),
        client: Yup.string().required('Please enter client name.'),
        project: Yup.string().required('Please enter project name.'),
        calctax: Yup.string().required('Please select tax.'),
    });

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
        <>
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
                                // readOnly={selectedProduct !== null}
                            />
                        </td>
                        
                        <td className="px-2 py-2 border-b">
                            <input
                                type="number"
                                min="1"
                                value={row.quantity}
                                onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                                placeholder="Qty"
                                className="w-full p-2 border rounded"
                            />
                        </td>
                        <td className="px-2 py-2 border-b">
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
                                disabled={selectedMilestone !== null}
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
                                className="w-[100px]"
                                allowClear
                            >
                                <Option value="0">0</Option>
                                {taxes && taxes.data && taxes.data.map(tax => (
                                    <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
                                        {tax.gstName} ({tax.gstPercentage}%)
                                    </Option>
                                ))}
                            </Select>
                        </td>
                        <td className="px-2 py-2 border-b">
                            <span>{selectedCurrencyIcon} {parseFloat(row.amount || 0).toFixed(2)}</span>
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
        
    </>
    );

    // Add discount type change handler
    const handleDiscountTypeChange = (value) => {
        setDiscountType(value);
        setDiscountValue(0); // Reset discount value when type changes
        calculateTotal(tableData, 0); // Recalculate with zero discount
    };

    // Modify the discount input handler
    const handleDiscountChange = (value) => {
        // Ensure value is a number and default to 0 if empty or invalid
        const numValue = value === '' ? 0 : parseFloat(value) || 0;
        setDiscountValue(numValue);
        calculateTotal(tableData, numValue);
    };

    // Modify the summary section to include discount type selector
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

    return (
        <>
            <div>
                <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        validationSchema={validationSchema}
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
                                            rules={[{ required: true, message: "Please select the issue date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="dueDate"
                                            label="Due Date"
                                            rules={[{ required: true, message: "Please select the due date" }]}
                                        >
                                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        {renderCurrencySelect()}
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="client"
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
                        {/* </Card> */}

                        {/* <Card> */}
                        <div>
                            
                            <div className="overflow-x-auto">
                                <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4'>
                                    <Flex className="flex" mobileFlex={false}>
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

                                            <div className="w-full flex gap-4">
                                            <div>
                                                <Form.Item>
                                                    <Select
                                                        placeholder="Select Milestone"
                                                        onChange={handleMilestoneChange}
                                                        value={selectedMilestone}
                                                        allowClear
                                                    >
                                                        {milestones?.map((milestone) => (
                                                            <Option key={milestone.id} value={milestone.id}>
                                                                {milestone.milestone_title}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
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
                        </div>

                        {/* <div className='mt-4'>
                            <Checkbox onChange={handleCheckboxChange}>
                                I Have Received Payment
                            </Checkbox>

                            {showFields && (
                                <div style={{ marginTop: '20px' }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <label>Payment Gateway</label>
                                            <Select placeholder="Select an option" className="w-full">
                                                <Option value="--">--</Option>
                                                <Option value="offline">Offline Payment</Option>
                                                <Option value="online">Online Payment</Option>
                                            </Select>
                                        </Col>
                                        <Col span={12}>
                                            <label>Transaction ID</label>
                                            <Input placeholder="Enter Transaction ID" />
                                        </Col>

                                    </Row>
                                </div>
                            )}
                        </div> */}

                        {/* </Card> */}

                        {/* <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div> */}
                        <Form.Item>
                            <Row justify="end" gutter={16} className='mt-4'>
                                <Col>
                                    <Button onClick={onClose}>Cancel</Button>
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
            {/* <Modal
                title="Product Create"
                visible={isAddProductModalVisible}
                onCancel={closeAddProductModal}
                footer={null}
                width={1000}
                className='mt-[-70px]'
            >
                <AddProduct onClose={closeAddProductModal} />
            </Modal> */}
        </>
    );
};

export default AddInvoice;
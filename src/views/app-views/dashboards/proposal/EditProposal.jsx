import React, { useState, useEffect } from 'react';
import { Card, Form, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, FilterOutlined, EditOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
// import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex';
// import { Getmins } from '../../../dashboards/project/milestone/minestoneReducer/minestoneSlice';
import { useSelector, useDispatch } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { createInvoice } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
import * as Yup from 'yup';
import { GetLeads } from '../leads/LeadReducers/LeadSlice';
import { GetDeals } from '../deals/DealReducers/DealSlice';
import { edpropos, getpropos } from './proposalReducers/proposalSlice';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';

const { Option } = Select;

const EditProposal = ({id, onClose }) => {

    // const { id } = useParams();
    const [discountType, setDiscountType] = useState("%");
    const [loading, setLoading] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const [list, setList] = useState(OrderListData)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    // const [showFields, setShowFields] = useState(false);
    // const { data: milestones } = useSelector((state) => state.Milestone.Milestone);
  const [singleEmp, setSingleEmp] = useState(null);


    // const [selectedProject, setSelectedProject] = useState(null);
    // const [clientOptions, setClientOptions] = useState([]);

    const currencies = useSelector((state) => state.currencies?.currencies?.data || []);
    const [discountRate, setDiscountRate] = useState(10);
    const dispatch = useDispatch();


  const alldept = useSelector((state) => state.proposal);

    const { data: Leads } = useSelector((state) => state.Leads.Leads);
      const { data: Deals } = useSelector((state) => state.Deals.Deals);


    // console.log("SubClient Data:", subClientData.username);

    // const { subClients } = useSelector((state) => state.SubClient.SubClient.data); 

    const [form] = Form.useForm();
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        totalTax: 0,
        finalTotal: 0,
    });



     useEffect(() => {
        // Find the specific indicator data by ID
        const empData = alldept?.proposal?.data || [];
        const data = empData.find((item) => item.id === id);
        setSingleEmp(data || null);
    
        // Update form values when singleEmp is set
        if (data) {
          form.setFieldsValue({
            lead_title: data.lead_title,
            deal_title: data.deal_title,
            // valid_till: data.valid_till,
            currency: data.currency,
            calculatedTax: data.calculatedTax,
            description: data.description,
            items: data.items,
            discount: data.discount,
            tax:data.tax,
            total:data.total,
          });
        }
      }, [id, alldept, form]);


    //   const handleProjectChange = (projectId) => {
    //     setSelectedProject(projectId);

    //     // Find associated clients for the selected project
    //     const relatedClients = subClients.filter(
    //       (client) => client.projectId === projectId
    //     );

    //     // Update client dropdown options
    //     setClientOptions(relatedClients);
    //   };



    const [tableData, setTableData] = useState([
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

    // Fetch currencies
    // useEffect(() => {
    //     dispatch(getallcurrencies());
    // }, [dispatch]);


    // Fetch milestones when product changes
    // useEffect(() => {
    //     dispatch(Getmins(id));
    // }, [dispatch]);


  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        await dispatch(getcurren());
      } catch (error) {
        console.error('Error fetching currencies:', error);
        message.error('Failed to fetch currencies');
      }
    };

    fetchCurrencies();
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetLeads());
    dispatch(GetDeals());
  }, [dispatch]);


    // Handle product selection
    const handleProductChange = (value) => {
        setSelectedProduct(value);
        setSelectedMilestone(null); // Reset milestone selection
        setTableData([{  // Reset table data
            id: Date.now(),
            item: "",
            quantity: 1,
            price: "",
            tax: 0,
            amount: "0",
            description: "",
        }]);
    };



    const handleFinish = async (values) => {
        try {
            setLoading(true);

            const subTotal = calculateSubTotal();
            const totalTax = calculateTotalTax();
            // const discount = calculateDiscount();
            // const totalAmount = calculateTotal();
            const discount = (subTotal * discountRate) / 100; // Discount calculation
            const totalAmount = subTotal - discount + totalTax; // Final total calculation

            const proposalData = {
                lead_title: values.lead_title,
                deal_title: values.deal_title,
                valid_till: values.valid_till.format("YYYY-MM-DD"),
                currency: values.currency,
                calculatedTax: totalTax, // Changed from calculatedtax to calculatedTax
                description: "", // Add description field
                items: tableData.map((item) => ({
                  item: item.item,
                  quantity: parseFloat(item.quantity),
                  price: parseFloat(item.price),
                  tax: parseFloat(item.tax),
                  amount: parseFloat(item.amount),
                  description: item.description,
                })),
                discount: parseFloat(discount.toFixed(2)),
                tax: totalTax, // Added separate tax field
                total: parseFloat(totalAmount.toFixed(2)),


               
            };

            console.log('Proposal Data:', proposalData);
 dispatch(edpropos( { id, proposalData }))
        .then(() => {
          message.success("Proposal updated successfully!");
          dispatch(getpropos());
          onClose();
        })
        .catch((error) => {
          message.error("Failed to add proposal. Please try again.");
          console.error("Error during proposal submission:", error);
        });
    } catch (error) {
      message.error("Failed to create proposal: " + error.message);
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
        setTableData([...tableData, { id: Date.now(), item: "", quantity: 1, price: 0, tax: "0", description: "", amount: 0 }]);
    };

    // Delete row
    const handleDeleteRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            message.warning('At least one item is required');
        }
    };

    const navigate = useNavigate();


    // Calculate discount amount
    const calculateDiscount = () => {
        const subTotal = calculateSubTotal();
        if (discountType === '%') {
            return subTotal * (parseFloat(discountValue) || 0) / 100;
        }
        return parseFloat(discountValue) || 0;
    };

    // Calculate total tax
    const calculateTotalTax = () => {
        const subTotal = calculateSubTotal();
        const discount = calculateDiscount();
        const taxableAmount = form.getFieldValue('calctax') === 'before'
            ? subTotal
            : (subTotal - discount);

        return tableData.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.price) || 0;
            const tax = parseFloat(row.tax) || 0;
            const rowAmount = quantity * price;
            return sum + (rowAmount * (tax / 100));
        }, 0);
    };

    // Calculate subtotal (sum of all row amounts before discount)
    const calculateSubTotal = () => {
        return rows.reduce((sum, row) => {
            const quantity = parseFloat(row.quantity || 0);
            const price = parseFloat(row.price || 0);
            return sum + (quantity * price);
        }, 0);
    };


    const calculateTotal = (data, discountRate) => {
        let subtotal = 0;
        let totalTax = 0;

        data.forEach((row) => {
            const amount = row.quantity * row.price;
            const taxAmount = (amount * row.tax) / 100;

            row.amount = amount; // Update the row's amount
            subtotal += amount;
            totalTax += taxAmount;
        });

        const discount = (subtotal * discountRate) / 100;
        const finalTotal = subtotal - discount + totalTax;

        setTotals({ subtotal, discount, totalTax, finalTotal });
    };

    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map((row) =>
            row.id === id ? { ...row, [field]: field === 'quantity' || field === 'price' || field === 'tax' ? parseFloat(value) || 0 : value } : row
        );

        setTableData(updatedData);
        calculateTotal(updatedData, discountRate); // Recalculate totals
    };

    const initialValues = {
        leadtitle: null,
        dealtitle: null,
        date:'',
        currency: '',
        calculatedtax:  "",
         
    };

    const validationSchema = Yup.object({
       lead_title: Yup.date().nullable().required("Please select Lead Title ."),
       deal_title: Yup.date().nullable().required("Please select Deal Title ."),
       currency: Yup.string().required("Please select crrency."),
       valid_till: Yup.string().required("Date is require"),
       calculatedTax: Yup.string().required("Please select calculatedtax."),
     });


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

                        // initialValues={initialValues}

                    // initialValues={{
                    //     loginEnabled: true,
                    // }}
                    >
                        {/* <Card className="border-0 mt-2"> */}
                        <div className="">
                            <div className=" p-2">
                             

                                {/* <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} /> */}

                                <Row gutter={16}>

                                <Col span={12}>
                                                   <Form.Item
                                                     name="lead_title"
                                                     label="Lead Title"
                                                     rules={[
                                                       {
                                                         required: true,
                                                         message: "Please select a Lead Title",
                                                       },
                                                     ]} // Validation rule
                                                   >
                                                     <Select placeholder="Select Lead Title">
                                                       {/* Populate dropdown options from Leads */}
                                                       {Array.isArray(Leads) && Leads.length > 0 ? (
                                                         Leads.map((lead) => (
                                                           <Option key={lead.id} value={lead.id}>
                                                             {lead.leadTitle}
                                                           </Option>
                                                         ))
                                                       ) : (
                                                         <Option disabled>No Leads Available</Option>
                                                       )}
                                                     </Select>
                                                   </Form.Item>
                                                 </Col>
                                                 <Col span={12}>
                                                   <Form.Item
                                                     name="deal_title"
                                                     label="Deal Title"
                                                     rules={[
                                                       {
                                                         required: true,
                                                         message: "Please select a Deal Title",
                                                       },
                                                     ]} // Validation rule
                                                   >
                                                     <Select placeholder="Select Deal Title">
                                                       {/* Populate dropdown options from Deals */}
                                                       {Array.isArray(Deals) && Deals.length > 0 ? (
                                                         Deals.map((deal) => (
                                                           <Option key={deal.id} value={deal.id}>
                                                             {deal.dealName}
                                                           </Option>
                                                         ))
                                                       ) : (
                                                         <Option disabled>No Deals Available</Option>
                                                       )}
                                                     </Select>
                                                   </Form.Item>
                                                 </Col>
                               
                                                 <Col span={12}>
                                                   <Form.Item
                                                     name="valid_till"
                                                     label=" Date"
                                                     rules={[
                                                       { required: true, message: "Please select the Date" },
                                                     ]}
                                                   >
                                                     <DatePicker className="w-full" format="DD-MM-YYYY" />
                                                   </Form.Item>
                                                 </Col>
                               
                                                 <Col span={12}>
                                                   <Form.Item
                                                     name="currency"
                                                     label="Currency"
                                                     rules={[
                                                       {
                                                         required: true,
                                                         message: "Please select a Currency",
                                                       },
                                                     ]}
                                                   >
                                                     <Select
                                                       placeholder="Select Currency"
                                                       loading={!Array.isArray(currencies)}
                                                     >
                                                       {Array.isArray(currencies) && currencies.length > 0 ? (
                                                         currencies.map((currency) => (
                                                           <Option key={currency.id} value={currency.id}>
                                                             {currency.currencyCode}
                                                           </Option>
                                                         ))
                                                       ) : (
                                                         <Option disabled>No Currencies Available</Option>
                                                       )}
                                                     </Select>
                                                   </Form.Item>
                                                 </Col>
                                    


                                   

                                    <Col span={12}>
                                        <Form.Item
                                            name="calculatedtax"
                                            label="Calculate Tax"
                                            rules={[{ required: true, message: "Please select a tax calculation method" }]}
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
                        {/* </Card> */}

                        {/* <Card> */}
                        <div className="form-buttons text-end mb-2">
                                    <Button className='border-0 text-white bg-blue-500' onClick={handleAddRow}>
                                        <PlusOutlined />  Add Items
                                    </Button>
                                </div>
                        <div>
                            <div className="overflow-x-auto">
                                <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4'>
                                    <Flex className="flex " mobileFlex={false}>
                                        <div className="w-full flex gap-4">
                                            <div>
                                                {/* <Select
                                                    value={selectedProduct}
                                                    onChange={handleProductChange}
                                                    className="w-full !rounded-none"
                                                    placeholder="Select Product"
                                                    rootClassName="!rounded-none"
                                                >
                                                    <Option value="smart_speakers">Smart Speakers</Option>
                                                    <Option value="electric_kettle">Electric Kettle</Option>
                                                    <Option value="headphones">Headphones</Option>
                                                </Select> */}
                                            </div>

                                        </div>

                                    </Flex>
                                    <Flex gap="7px" className="flex">
                                        <div className="w-full flex gap-4">
                                            <div>
                                                {/* <Select
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
                                                </Select> */}
                                            </div>
                                        </div>
                                    </Flex>
                                </Flex>

                                <table className="w-full border border-gray-200 bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Items<span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Quantity<span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Unit Price <span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                TAX (%)
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Amount<span className="text-red-500">*</span>
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                                Action<span className="text-red-500">*</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <tr>
                                                    <td className="px-4 py-2 border-b">
                                                    <Select placeholder="Select Item">
                                                <Option value="item1">Item1</Option>
                                                <Option value="item2">Item2</Option>
                                            </Select>
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="number"
                                                            value={row.quantity}
                                                            onChange={(e) => handleTableDataChange(row.id, 'quantity', e.target.value)}
                                                            placeholder="Qty"
                                                            className="w-full p-2 border rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <input
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => handleTableDataChange(row.id, 'price', e.target.value)}
                                                            placeholder="Price"
                                                            className="w-full p-2 border rounded-s"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                      <select
                        value={row.tax}
                        onChange={(e) => handleTableDataChange(row.id, 'tax', e.target.value)}
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
                                                    <td className="px-4 py-2 border-b">
                                                        <span>{row.amount}</span>
                                                    </td>
                                                    <td className="px-2 py-1 border-b text-center">
                                                        <Button
                                                            danger
                                                            onClick={() => handleDeleteRow(row.id)}
                                                        >
                                                            <DeleteOutlined />
                                                        </Button> 
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
                                    {/* Sub Total */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.subtotal.toFixed(2)}
                                        </td>
                                    </tr>

                                    {/* Discount */}
                                    <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                                        <td className="font-medium">Discount</td>
                                        <td className='flex items-center space-x-2'>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Discount Rate (%)
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

                                    {/* Tax */}
                                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Total Tax</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.totalTax.toFixed(2)}
                                        </td>
                                    </tr>

                                    {/* Total */}
                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            ₹{totals.finalTotal.toFixed(2)}
                                        </td>
                                    </tr>

                                    {/* Terms and Conditions */}
                                </table>
                            </div>
                          
                        </div>

                        <Form.Item className='mt-3'>
                            <Row justify="end" gutter={16}>
                                <Col>
                                    <Button onClick={onClose}>Cancel</Button>
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

export default EditProposal;


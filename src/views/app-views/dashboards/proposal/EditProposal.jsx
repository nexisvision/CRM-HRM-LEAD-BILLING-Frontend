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
import { getAllTaxes } from "views/app-views/setting/tax/taxreducer/taxSlice";
import dayjs from 'dayjs';

const { Option } = Select;

const EditProposal = ({ id, onClose }) => {

  // const { id } = useParams();
  const [discountType, setDiscountType] = useState('percentage');
  const [loading, setLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [list, setList] = useState(OrderListData)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  // const [showFields, setShowFields] = useState(false);
  // const { data: milestones } = useSelector((state) => state.Milestone.Milestone);
  const [singleEmp, setSingleEmp] = useState(null);

  const { taxes } = useSelector((state) => state.tax);

  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});


  // const [selectedProject, setSelectedProject] = useState(null);
  // const [clientOptions, setClientOptions] = useState([]);

  const loggeduser = useSelector((state) => state.user.loggedInUser.username);
  const currencies = useSelector((state) => state.currencies?.currencies?.data || []);
  const [discountRate, setDiscountRate] = useState(10);
  const dispatch = useDispatch();


  const alldept = useSelector((state) => state.proposal);

  const { data: Leadss } = useSelector((state) => state.Leads.Leads);

  const Leads = loggeduser && Array.isArray(Leadss)
    ? Leadss.filter((item) => item?.created_by === loggeduser)
    : [];

  const { data: Dealss } = useSelector((state) => state.Deals.Deals);

  const Deals = loggeduser && Array.isArray(Dealss)
    ? Dealss.filter((item) => item?.created_by === loggeduser)
    : [];

  const allogged = useSelector((state) => state.user.loggedInUser.username);

  const fndlead = Leads.filter((item) => item?.created_by === allogged);


  // Add state for selected lead details
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);


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

    console.log("data", data)

    // Update form values when singleEmp is set
    if (data) {
      form.setFieldsValue({
        lead_title: data.lead_title,
        // deal_title: data.deal_title,
        // valid_till: data.valid_till,
        description: data.description,
        currency: data.currency,
        // calculatedTax: data.calculatedTax,
        items: data.items,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
      });
    }
  }, [id, alldept, form]);


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
    dispatch(getAllTaxes());
  }, [dispatch]);

  useEffect(() => {
    const empData = alldept?.proposal?.data || [];
    const data = empData.find((item) => item.id === id);
    setSingleEmp(data || null);

    const setProposalData = async () => {
      if (data) {
        try {
          // Set basic form fields
          form.setFieldsValue({
            lead_title: data.lead_title,
            // deal_title: data.deal_title,
            valid_till: dayjs(data.valid_till),
            currency: data.currency,
            description: data.description,
            // calculatedTax: data.calculatedTax,
          });

          // Parse items from JSON string
          if (data.items) {
            const parsedItems = JSON.parse(data.items);
            const formattedItems = Array.isArray(parsedItems) ? parsedItems : [parsedItems];

            const formattedTableData = formattedItems.map(item => ({
              id: Date.now() + Math.random(), // Generate unique ID
              item: item.item || '',
              quantity: Number(item.quantity) || 0,
              price: Number(item.price) || 0,
              tax_name: item.tax_name || '',
              tax: Number(item.tax) || 0,
              amount: Number(item.amount) || 0,
              description: item.description || ''
            }));

            setTableData(formattedTableData);

            // Set discount rate
            setDiscountRate(Number(data.discount) || 0);

            // Calculate and set totals
            const totalsData = {
              subtotal: formattedTableData.reduce((sum, item) => sum + Number(item.amount), 0),
              discount: Number(data.discount) || 0,
              totalTax: Number(data.tax) || 0,
              finalTotal: Number(data.total) || 0
            };

            setTotals(totalsData);

            // Set tax details if available
            formattedTableData.forEach(item => {
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
          }

        } catch (error) {
          console.error("Error setting proposal data:", error);
          message.error("Failed to load proposal details");
        }
      }
    };

    setProposalData();
  }, [alldept, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // Calculate the actual discount amount
      const subtotal = calculateSubTotal();
      const discountAmount = (subtotal * discountRate) / 100;


      const proposalData = {
        lead_title: values.lead_title,
        deal_title: values.deal_title,
        valid_till: values.valid_till.format("YYYY-MM-DD"),
        currency: values.currency,
        calculatedTax: totals.totalTax, // Use totals.totalTax instead of undefined calculatedTax
        description: "", // Add description field
        items: tableData.map((item) => ({
          item: item.item,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          tax_name: selectedTaxDetails[item.id]?.
            gstName || '',
          tax: parseFloat(item.tax) || 0,
          amount: parseFloat(item.amount),
          description: item.description,
        })),
        discount: discountAmount, // Store the calculated discount amount
        discountRate: discountRate, // Optionally store the rate 
        tax: totals.totalTax, // Added separate tax field
        total: totals.finalTotal,
      };

      console.log('Proposal Data:', proposalData);
      dispatch(edpropos({ id, proposalData }))
        .then(() => {
          // message.success("Proposal updated successfully!");
          dispatch(getpropos());
          onClose();
        })
        .catch((error) => {
          // message.error("Failed to add proposal. Please try again.");
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

  // Delete row
  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, discountRate);
    } else {
      message.warning("At least one item is required");
    }
  };



  // Calculate subtotal (sum of all row amounts before discount)
  const calculateSubTotal = () => {
    return tableData.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const calculateTotal = (data = tableData, discountVal = discountValue, discType = discountType) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data passed to calculateTotal');
      return;
    }

    // Calculate subtotal
    const subtotal = data.reduce((sum, row) => {
      return sum + (parseFloat(row.amount) || 0);
    }, 0);

    // Calculate discount amount based on type
    let discountAmount = 0;
    if (discType === 'percentage') {
      discountAmount = (subtotal * (parseFloat(discountVal) || 0)) / 100;
    } else { // fixed
      discountAmount = parseFloat(discountVal) || 0;
    }

    // Calculate total tax
    const totalTax = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = (parseFloat(row.tax) || 0);
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      return sum + taxAmount;
    }, 0);

    // Calculate final total
    const finalTotal = subtotal - discountAmount;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    });
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
        // Calculate amount if quantity, price, or tax changes
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

  const initialValues = {
    leadtitle: null,
    // dealtitle: null,
    description: "",
    date: '',
    currency: '',
    // calculatedtax: "",

  };

  const validationSchema = Yup.object({
    lead_title: Yup.date().nullable().required("Please select Lead Title ."),
    // deal_title: Yup.date().nullable().required("Please select Deal Title ."),
    currency: Yup.string().required("Please select crrency."),
    valid_till: Yup.string().required("Date is require"),
    // calculatedTax: Yup.string().required("Please select calculatedtax."),
    description: Yup.string().required("Please enter description."),
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


                {/*  */}

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
                      ]}
                    >
                      <Select
                        placeholder="Select Lead Title"
                        onChange={(value) => {
                          // Find the selected lead
                          const selectedLead = fndlead.find(lead => lead.id === value);
                          if (selectedLead) {
                            setSelectedLeadDetails(selectedLead);

                            // Create new table data with lead details
                            const newTableData = [{
                              id: Date.now(),
                              item: selectedLead.leadTitle || '',
                              quantity: 1,
                              price: selectedLead.leadValue || 0,
                              tax: 0,
                              amount: selectedLead.leadValue || '0',
                              description: selectedLead.description || '',
                            }];

                            setTableData(newTableData);
                            calculateTotal(newTableData, discountValue, discountType);
                          }
                        }}
                      >
                        {Array.isArray(fndlead) && fndlead.length > 0 ? (
                          fndlead.map((lead) => (
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
                  {/* <Col span={12}>
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
                        Populate dropdown options from Deals 
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
                  </Col> */}

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
                              ({currency.currencyIcon})
                            </Option>
                          ))
                        ) : (
                          <Option disabled>No Currencies Available</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* <Col span={12}>
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
                  </Col> */}
                  <Col span={24}>
                    <Form.Item label="Description" name="description">
                      <Input.TextArea placeholder="Enter Description" />
                    </Form.Item>
                  </Col>
                </Row>


              </div>
            </div>
            {/* </Card> */}

            {/* <Card> */}

            <div>
              <div className="overflow-x-auto">

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
                            >
                              <DeleteOutlined />
                            </Button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="form-buttons text-start mb-2 mt-2">
                  <Button className='border-0 text-white bg-blue-500' onClick={handleAddRow}>
                    <PlusOutlined />  Add Items
                  </Button>
                </div>
              </div>


              {/* Summary Section */}
              <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
                <table className='w-full lg:w-[50%] p-2'>
                  {/* Sub Total */}
                  <tr className="flex justify-between px-2 py-2 border-x-2">
                    <td className="font-medium">Sub Total</td>
                    <td className="font-medium px-4 py-2">
                      ₹{totals.subtotal}
                    </td>
                  </tr>

                  {/* Discount */}
                  <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                    <td className="font-medium">Discount</td>
                    <td className="flex items-center space-x-2">
                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <Select
                            value={discountType}
                            onChange={(value) => {
                              setDiscountType(value);
                              calculateTotal(tableData, discountValue, value);
                            }}
                            className="w-32"
                          >
                            <Option value="percentage">Percentage (%)</Option>
                            <Option value="fixed">Fixed Amount</Option>
                          </Select>
                          <input
                            type="number"
                            min="0"
                            value={discountValue || ''} // Allow empty value
                            onChange={(e) => {
                              const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              setDiscountValue(newValue);
                              calculateTotal(tableData, newValue, discountType);
                            }}
                            className="mt-1 block w-32 p-2 border rounded"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Tax */}
                  <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                    <td className="font-medium">Total Tax</td>
                    <td className="font-medium px-4 py-2">
                      ₹{totals.totalTax}
                    </td>
                  </tr>

                  {/* Total */}
                  <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                    <td className="font-bold text-lg">Total Amount</td>
                    <td className="font-bold text-lg px-4">
                      ₹{totals.finalTotal}
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


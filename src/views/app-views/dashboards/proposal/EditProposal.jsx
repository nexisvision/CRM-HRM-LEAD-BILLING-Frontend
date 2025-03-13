import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, message, Button, Select, DatePicker } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { GetLeads } from '../leads/LeadReducers/LeadSlice';
import { GetDeals } from '../deals/DealReducers/DealSlice';
import { edpropos, getpropos } from './proposalReducers/proposalSlice';
import { getcurren } from 'views/app-views/setting/currencies/currenciesSlice/currenciesSlice';
import { getAllTaxes } from "views/app-views/setting/tax/taxreducer/taxSlice";
import dayjs from 'dayjs';

const { Option } = Select;

const EditProposal = ({ id, onClose }) => {
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const { taxes } = useSelector((state) => state.tax);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});
    // Add the missing state variables
    const [singleEmp, setSingleEmp] = useState(null);
    const [loading, setLoading] = useState(false);
  const currencies = useSelector((state) => state.currencies?.currencies?.data || []);
  const [discountRate] = useState(10);
  const dispatch = useDispatch();


  const alldept = useSelector((state) => state.proposal);

  const { data: fndlead } = useSelector((state) => state.Leads.Leads);

  const [form] = Form.useForm();
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    totalTax: 0,
    finalTotal: 0,
  });

  useEffect(() => {
    const empData = alldept?.proposal?.data || [];
    const data = empData.find((item) => item.id === id);

    console.log("sdfsdfsd",data);
    setSingleEmp(data || null);


    if (data) {
      form.setFieldsValue({
        lead_title: data.lead_title,
        description: data.description,
        currency: data.currency,
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
      tax: null,
      tax_name: "",
      tax_amount: 0,
      base_amount: 0,
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

    const setProposalData = async () => {
      if (data) {
        try {
          form.setFieldsValue({
            lead_title: data.lead_title,
            valid_till: dayjs(data.valid_till),
            currency: data.currency,
            description: data.description,
          });

          // Set discount value from data
          setDiscountValue(Number(data.discount) || 0);
          // Assuming it's a fixed discount, but you can modify this if needed
          setDiscountType('fixed');

          if (data.items) {
            const parsedItems = JSON.parse(data.items);
            const formattedItems = Array.isArray(parsedItems) ? parsedItems : [parsedItems];

            const formattedTableData = formattedItems.map(item => ({
              id: Date.now() + Math.random(),
              item: item.item || '',
              quantity: Number(item.quantity) || 0,
              price: Number(item.price) || 0,
              tax: item.tax_name ? {
                gstName: item.tax_name,
                gstPercentage: Number(item.tax)
              } : null,
              tax_name: item.tax_name || '',
              tax_amount: Number(item.tax_amount) || 0,
              amount: Number(item.amount) || 0,
              description: item.description || ''
            }));

            setTableData(formattedTableData);

            // Set tax details for the selector
            formattedTableData.forEach(item => {
              if (item.tax_name && item.tax) {
                setSelectedTaxDetails(prev => ({
                  ...prev,
                  [item.id]: {
                    gstName: item.tax_name,
                    gstPercentage: Number(item.tax)
                  }
                }));
              }
            });

            // Calculate and set totals
            const totalsData = {
              subtotal: Number(data.subtotal) || 0,
              discount: Number(data.discount) || 0,
              totalTax: Number(data.tax) || 0,
              finalTotal: Number(data.total) || 0
            };

            setTotals(totalsData);
          }
        } catch (error) {
          console.error("Error setting proposal data:", error);
          message.error("Failed to load proposal details");
        }
      }
    };

    setProposalData();
  }, [alldept, form, id]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const subtotal = calculateSubTotal();
        // Calculate discount amount based on type
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100;
    } else {
      discountAmount = parseFloat(discountValue) || 0;
    }

     

      const proposalData = {
        lead_title: values.lead_title,
        deal_title: values.deal_title,
        valid_till: values.valid_till.format("YYYY-MM-DD"),
        currency: values.currency,
        calculatedTax: totals.totalTax,
        description: "",
        items: tableData.map((item) => ({
          item: item.item,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          tax_name: selectedTaxDetails[item.id]?.gstName || '',
          tax: parseFloat(item.tax) || 0,
          amount: parseFloat(item.amount),
          description: item.description,
        })),
        subtotal:subtotal,
        discount: discountAmount,
        discountRate: discountRate,
        tax: totals.totalTax,
        total: totals.finalTotal,
      };

      dispatch(edpropos({ id, proposalData }))
        .then(() => {
          dispatch(getpropos());
          onClose();
        })
        .catch((error) => {
          console.error("Error during proposal submission:", error);
        });
    } catch (error) {
      message.error("Failed to create proposal: " + error.message);
    }
  };


  // Function to handle adding a new row
  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: "",
      tax: null,
      tax_name: "",
      tax_amount: 0,
      base_amount: 0,
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
      calculateTotal(updatedData, discountValue, discountType);
    } else {
      message.warning("At least one item is required");
    }
  };


// Calculate subtotal (sum of all row amounts before discount)
 const calculateSubTotal = () => {
   return tableData.reduce((sum, row) => {
       const quantity = parseFloat(row.quantity) || 0;
       const price = parseFloat(row.price) || 0;
       const baseAmount = quantity * price;
       const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
       const taxAmount = (baseAmount * tax) / 100;
       const totalAmount = baseAmount + taxAmount;
       return sum + totalAmount;
   }, 0);
};

  const calculateTotal = (data = tableData, discountVal = discountValue, discType = discountType) => {
    if (!Array.isArray(data)) {
        console.error('Invalid data passed to calculateTotal');
        return;
    }

   // Calculate subtotal
   const subtotal = data.reduce((sum, row) => {
    const amount = parseFloat(row.amount) || 0;
    return sum + amount;
}, 0);

    // Calculate total tax
    const totalTax = data.reduce((sum, row) => {
        const quantity = parseFloat(row.quantity) || 0;
        const price = parseFloat(row.price) || 0;
        const baseAmount = quantity * price;
        const taxPercentage = row.tax?.gstPercentage || 0;
        const taxAmount = (baseAmount * taxPercentage) / 100;
        return sum + taxAmount;
    }, 0);

    // Calculate discount
    let discountAmount = 0;
    if (discountVal !== '') {
        if (discType === 'percentage') {
            discountAmount = (subtotal * (parseFloat(discountVal) || 0)) / 100;
        } else {
            discountAmount = parseFloat(discountVal) || 0;
        }
    }

    // Calculate final total
    const finalTotal = subtotal - discountAmount;

    setTotals({
        subtotal: subtotal.toFixed(2),
        discount: discountAmount.toFixed(2),
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
    const updatedData = tableData.map(row => {
        if (row.id === id) {
            const updatedRow = { ...row };

            if (field === 'tax') {
                if (!value) {
                    updatedRow.tax = null;
                    updatedRow.tax_name = '';
                    updatedRow.tax_amount = 0;
                } else {
                    const quantity = parseFloat(updatedRow.quantity) || 0;
                    const price = parseFloat(updatedRow.price) || 0;
                    const baseAmount = quantity * price;
                    const taxAmount = (baseAmount * value.gstPercentage) / 100;
                    
                    updatedRow.tax = value;
                    updatedRow.tax_name = value.gstName;
                    updatedRow.tax_amount = taxAmount;
                }
            } else {
                updatedRow[field] = value;
            }

            // Recalculate amounts
            const quantity = parseFloat(updatedRow.quantity) || 0;
            const price = parseFloat(updatedRow.price) || 0;
            const baseAmount = quantity * price;
            const taxPercentage = updatedRow.tax?.gstPercentage || 0;
            const taxAmount = (baseAmount * taxPercentage) / 100;
            const finalAmount = baseAmount + taxAmount;

            updatedRow.base_amount = baseAmount;
            updatedRow.tax_amount = taxAmount;
            updatedRow.amount = finalAmount.toFixed(2);

            return updatedRow;
        }
        return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, discountValue, discountType);
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
          <hr className="mb-4 border-b  font-medium"></hr>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            validationSchema={validationSchema}


          >
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
                            <Select
                              value={row.tax ? `${row.tax.gstName}|${row.tax.gstPercentage}` : undefined}
                              onChange={(value) => {
                                if (!value || value === '0') {
                                  handleTableDataChange(row.id, "tax", null);
                                  return;
                                }
                                const [gstName, gstPercentage] = value.split('|');
                                handleTableDataChange(row.id, "tax", {
                                  gstName,
                                  gstPercentage: parseFloat(gstPercentage)
                                });
                              }}
                              placeholder="Select Tax"
                              className="w-[150px] p-2"
                              allowClear
                            >
                              {taxes && taxes.data && taxes.data.map(tax => (
                                <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
                                  {tax.gstName} ({tax.gstPercentage}%)
                                </Option>
                              ))}
                            </Select>
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
                        <tr>
                                                    <td colSpan={6} className="px-4 py-2 border-b">
                                                        <textarea
                                                            rows={2}
                                                            value={row.description}
                                                            onChange={(e) => handleTableDataChange(row.id, 'description', e.target.value)}
                                                            placeholder="Description"
                                                            className="w-[70%] p-2 border"
                                                        />
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

    </>
  );
};

export default EditProposal;


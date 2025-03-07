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
import Flex from 'components/shared-components/Flex';
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { addbil, eidtebil, getbil } from "./billing2Reducer/billing2Slice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice";
import moment from "moment";
import { vendordataedata } from "../../Purchase/vendor/vendorReducers/vendorSlice";
import { GetAllProdu } from "../../project/product/ProductReducer/ProductsSlice";
import AddVendor from '../../Purchase/vendor/AddVendor';


const { Option } = Select;

const EditBilling = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  const { taxes } = useSelector((state) => state.tax);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const lid = AllLoggeddtaa.loggedInUser.id;

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showTax, setShowTax] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
    // Get products directly from Redux store
    const productsData = useSelector((state) => state.Product.Product);

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
      // tax_name: "",
      amount: 0,
      description: "",
    },
  ]);

  const bildata = useSelector((state) => state.salesbilling);
  const fnsdatas = bildata.salesbilling.data;

  const { vendors } = useSelector((state) => state.vendors);

  const [isAddVendorModalVisible, setIsAddVendorModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getbil(lid));
    dispatch(getAllTaxes());
    dispatch(vendordataedata());
    fetchTags();
    fetchLables("status", setStatuses);
  }, []);

 useEffect(() => {
  const currentBill = fnsdatas?.find((item) => item.id === idd);
  
  if (currentBill) {
    try {

      // Parse the description JSON string
      const descriptionData = JSON.parse(currentBill.discription || '{}');
      const items = descriptionData.items || [];

      // Set basic form fields
      form.setFieldsValue({
        vendor: currentBill.vendor || '',
        billDate: currentBill.billDate ? moment(currentBill.billDate) : null,
        status: currentBill.status || '',
        billNumber: currentBill.billNumber || '',
        note: currentBill.note || ''
      });

      // setShowTax(!!currentBill.tax);
      setDiscountType(currentBill.discountType || 'percentage');
      setDiscountValue(currentBill.discountValue || 0);

      // Format items data
      if (items.length > 0) {
        const formattedItems = items.map(item => ({
          id: Date.now() + Math.random(),
          item: item.name || '',
          quantity: Number(item.quantity) || 1,
          price: Number(item.unitPrice) || 0,
          tax: showTax ? (Number(item.tax) || 0) : 0,
          tax_name: item.tax_name || '',
          amount: calculateAmount({
            quantity: Number(item.quantity) || 1,
            price: Number(item.unitPrice) || 0,
            tax: Number(item.tax) || 0
          }),
          description: descriptionData.service || ''
        }));

        setTableData(formattedItems);

        // Set tax details if available
        if (showTax) {
          formattedItems.forEach(item => {
            if (item.tax && taxes?.data) {
              const selectedTax = taxes.data.find(t => t.gstPercentage === parseFloat(item.tax));
              if (selectedTax) {
                setSelectedTaxDetails(prev => ({
                  ...prev,
                  [item.id]: {
                    gstName: selectedTax.gstName,
                    gstPercentage: selectedTax.gstPercentage
                  }
                }));
              }
            }
          });
        }

        // Calculate totals
        calculateTotal(formattedItems, currentBill.discountValue || 0, currentBill.discountType || 'percentage');
      } else {
        // Set default empty row if no items
        setTableData([{
          id: Date.now(),
          item: '',
          quantity: 1,
          price: 0,
          tax: 0,
          amount: '0.00',
          description: '',
          tax_name: ''
        }]);

        // Reset totals
        setTotals({
          subtotal: '0.00',
          discount: '0.00',
          totalTax: '0.00',
          finalTotal: '0.00'
        });
      }

    } catch (error) {
      console.error('Error setting bill data:', error);
      message.error('Error loading bill data');
    }
  }
}, [fnsdatas, idd, form, taxes, showTax]);

  useEffect(() => {
    dispatch(getAllTaxes());
  }, [dispatch]);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dispatch(GetAllProdu());
        
        if (response?.payload?.data) {
          setProducts(response.payload.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // message.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Update local state when Redux store changes
  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Product selection handler
  const handleProductChange = (productId) => {
    
    if (productId) {
      const selectedProd = products.find(p => p.id === productId);
      
      if (selectedProd) {
        const updatedData = tableData.map((row, index) => {
          if (index === tableData.length - 1 && !row.item) {
            return {
              ...row,
              item: selectedProd.name,
              description: selectedProd.description || "",
              price: selectedProd.price || 0,
              hsn_sac: selectedProd.hsn_sac || "",
            };
          }
          return row;
        });

        setTableData(updatedData);
        setSelectedProduct(productId);
        calculateTotal(updatedData);
      }
    }
  };

  const calculateAmount = (row) => {
    const quantity = Number(row.quantity) || 0;
    const price = Number(row.price) || 0;
    const tax = showTax ? (Number(row.tax) || 0) : 0;
    
    const baseAmount = quantity * price;
    const taxAmount = (baseAmount * tax) / 100;
    
    return (baseAmount + taxAmount).toFixed(2);
  };

  const calculateTotal = (data = tableData, discountVal = discountValue, type = discountType) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data passed to calculateTotal');
      return;
    }

    const subtotal = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
      
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      const totalAmount = baseAmount + taxAmount;
      
      return sum + totalAmount;
    }, 0);

    let discountAmount = 0;
    if (type === 'percentage') {
      discountAmount = (subtotal * (parseFloat(discountVal) || 0)) / 100;
    } else {
      discountAmount = parseFloat(discountVal) || 0;
    }

    const totalTax = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      return sum + taxAmount;
    }, 0);

    const finalTotal = Math.max(0, subtotal - discountAmount);

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
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        if (field === 'quantity' || field === 'price' || field === 'tax') {
          const quantity = parseFloat(field === 'quantity' ? value : row.quantity) || 0;
          const price = parseFloat(field === 'price' ? value : row.price) || 0;
          const tax = field === 'tax' ? 
            (value ? parseFloat(value.gstPercentage) : 0) : 
            (row.tax ? parseFloat(row.tax.gstPercentage) : 0);
          
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

  const handleAddRow = () => {
    setTableData([
      ...tableData,
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
  };

  const handleDeleteRow = (id) => {
    const updatedData = tableData.filter((row) => row.id !== id);
    setTableData(updatedData);
    calculateTotal(updatedData, discountValue, discountType);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const totals = calculateTotal();

        // Prepare items data with all necessary details
        const items = tableData.map(row => {
          // Find the selected tax details for this row
          const taxDetails = taxes?.data?.find(t => t.gstPercentage === parseFloat(row.tax));
          
          return {
            name: row.item,
            quantity: parseFloat(row.quantity) || 0,
            unitPrice: parseFloat(row.price) || 0,
            tax: showTax ? parseFloat(row.tax) || 0 : 0,
            tax_name: showTax ? (taxDetails?.gstName || row.tax_name || '') : '', // Use tax name from details or row
            amount: parseFloat(row.amount) || 0,
            description: row.description || ""
          };
        });

        // Create description object
        const descriptionObject = {
          items: items,
          service: tableData.map(item => item.description).filter(Boolean).join(", "),
          product: tableData.map(item => item.item).filter(Boolean).join(", ")
        };

        const invoiceData = {
          vendor: values.vendor,
          billDate: values.billDate?.format("YYYY-MM-DD"),
          discription: descriptionObject,
          status: values.status,
          billNumber: values.billNumber,
          discountType: discountType,
          discountValue: parseFloat(discountValue) || 0,
          tax: showTax ? parseFloat(totals.totalTax) || 0 : 0,
          total: parseFloat(totals.finalTotal) || 0,
          note: values.note || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: lid,
          subtotal: parseFloat(totals.subtotal) || 0,
          total_tax: parseFloat(totals.totalTax) || 0,
          total_discount: parseFloat(totals.discount) || 0,
          items_data: items
        };

        dispatch(eidtebil({ idd, invoiceData }))
          .then(() => {
            dispatch(getbil(lid));
            message.success("Bill updated successfully!");
            onClose();
          })
          .catch((error) => {
            console.error("Error updating bill:", error);
            message.error("Failed to update bill: " + (error.message || "Unknown error"));
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        message.error("Please fill in all required fields");
      });
  };

  const fetchTags = async () => {
    try {
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

  const fetchLables = async (lableType, setter) => {
    try {
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setter(filteredLables);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };

  const handleAddNewStatus = async () => {
    if (!newStatus.trim()) {
      message.error("Please enter a status name");
      return;
    }

    try {
      const payload = {
        name: newStatus.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Status added successfully");
      setNewStatus("");
      setIsStatusModalVisible(false);
      
      // Fetch updated statuses
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredStatuses = response.payload.data
          .filter((label) => label.lableType === "status")
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }));
        setStatuses(filteredStatuses);
        // Update form field with new status
        form.setFieldsValue({ status: newStatus.trim() });
      }
    } catch (error) {
      console.error("Failed to add status:", error);
      message.error("Failed to add status");
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical">
      <h2 className="mb-2 border-b font-medium"></h2>
        <Card className="border-0">
          <Row gutter={16}>
            <Col span={12} className="mt-1">
              <Form.Item
                label="Vendor"
                name="vendor"
                rules={[{ required: true, message: "Please select a vendor" }]}
              >
                <Select
                  placeholder="Select Vendor"
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          padding: 8,
                        }}
                      >
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setIsAddVendorModalVisible(true)}
                        >
                          Add Vendor
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {vendors?.data?.map((vendor) => (
                    <Option key={vendor._id} value={vendor.name}>
                      {vendor.name}
                    </Option>
                  ))}
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
                label={<span className="">Status <span className="text-red-500">*</span></span>}
                name="status"
                rules={[{ required: true, message: "Please select or add a status" }]}
              >
                <Select
                  placeholder="Select or add new status"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setIsStatusModalVisible(true)}
                          block
                        >
                          Add New Status
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {statuses.map((status) => (
                    <Option key={status.id} value={status.name}>
                      {status.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Note" name="note">
                <Input placeholder="Enter Note (Optional)" />
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Enter Description" />
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
                    calculateTotal(updatedData, discountValue, discountType);
                  }
                }}
              />
            </div>
          </div>

          <div>
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
                      loading={!products.length}
                    >
                      {products && products.length > 0 ? (
                        products.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No products available</Option>
                      )}
                    </Select>
                  </div>
                </div>

              </Flex>
            </Flex>
           
            <div className="overflow-x-auto">
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
                          <input
                            type="number"
                            min="0"
                            value={row.price || ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                              handleTableDataChange(row.id, "price", value);
                            }}
                           
                            placeholder="0"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-2 py-2 border-b">
                          {showTax ? (
                            <Select
                              value={row.tax ? `${row.tax.gstName}|${row.tax.gstPercentage}` : "0"}
                              onChange={(value) => {
                                if (!value) {
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
                              {taxes && taxes.data && taxes.data.map(tax => (
                                <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
                                  {tax.gstName} ({tax.gstPercentage}%)
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <Input
                              type="text"
                              value="0"
                              disabled
                              className="w-full p-2 border bg-gray-100"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">
                          ₹{row.amount}
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
              </table>
              <div className="form-buttons text-left mt-2 mb-2">
              <Button type="primary" onClick={handleAddRow}>
                <PlusOutlined /> Add Items
              </Button>
            </div>
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
                    <Select
                      value={discountType}
                      onChange={(value) => {
                        setDiscountType(value);
                        calculateTotal(tableData, discountValue, value);
                      }}
                      style={{ width: 120 }}
                    >
                      <Option value="percentage">Percentage (%)</Option>
                      <Option value="fixed">Fixed Amount</Option>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      max={discountType === 'percentage' ? 100 : undefined}
                      value={discountValue}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setDiscountValue(value);
                        calculateTotal(tableData, value, discountType);
                      }}
                      style={{ width: 120 }}
                      prefix={discountType === 'fixed' ? '₹' : ''}
                      suffix={discountType === 'percentage' ? '%' : ''}
                    />
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
            Update Bill
          </Button>
          <Button type="ghost" onClick={onClose} className="ml-2">
            Cancel
          </Button>
        </div>
      </Form>

      <Modal
        title="Add New Status"
        open={isStatusModalVisible}
        onOk={handleAddNewStatus}
        onCancel={() => setIsStatusModalVisible(false)}
        okText="Add Status"
      >
        <Input
          placeholder="Enter new status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Modal>

      <Modal
        title="Create Vendor"
        visible={isAddVendorModalVisible}
        onCancel={() => setIsAddVendorModalVisible(false)}
        footer={null}
        width={1100}
        className='mt-[-70px]'
      >
        <AddVendor onClose={() => setIsAddVendorModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default EditBilling;

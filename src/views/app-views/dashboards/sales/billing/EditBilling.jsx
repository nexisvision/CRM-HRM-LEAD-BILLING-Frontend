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
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { addbil, eidtebil, getbil } from "./billing2Reducer/billing2Slice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice";
import moment from "moment";
import { vendordataedata } from "../../Purchase/vendor/vendorReducers/vendorSlice";
import { GetAllProdu } from "../../project/product/ProductReducer/ProductsSlice";


const { Option } = Select;

const EditBilling = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const { taxes } = useSelector((state) => state.tax);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const lid = AllLoggeddtaa.loggedInUser.id;
  const Tagsdetail = useSelector((state) => state.Lable);

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

  useEffect(() => {
    dispatch(getbil(lid));
    dispatch(getAllTaxes());
    dispatch(vendordataedata());
    fetchTags();
  }, []);

 useEffect(() => {
  const currentBill = fnsdatas?.find((item) => item.id === idd);
  
  if (currentBill) {
    try {
      console.log('Current Bill Data:', currentBill);

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

      // Set tax and discount states
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
        console.log("Products response:", response); // Debug log
        
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
      console.log("Products from Redux:", productsData.data);
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Product selection handler
  const handleProductChange = (productId) => {
    console.log("Selected product ID:", productId); // Debug log
    
    if (productId) {
      const selectedProd = products.find(p => p.id === productId);
      console.log("Found product:", selectedProd); // Debug log
      
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

    // Calculate discount based on type
    const discountAmount = type === 'percentage'
      ? (subtotal * (parseFloat(discountVal) || 0)) / 100
      : parseFloat(discountVal) || 0;

    const finalTotal = subtotal - discountAmount + totalTax;

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discountVal ? discountAmount.toFixed(2) : '',
      totalTax: totalTax.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
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
          const tax = showTax ? (parseFloat(field === 'tax' ? value : row.tax) || 0) : 0;
          
          // Update tax name when tax is selected
          if (field === 'tax' && taxes?.data) {
            const selectedTax = taxes.data.find(t => t.gstPercentage === parseFloat(value));
            if (selectedTax) {
              updatedRow.tax_name = selectedTax.gstName; // Store tax name directly in row
              setSelectedTaxDetails(prev => ({
                ...prev,
                [id]: {
                  gstName: selectedTax.gstName,
                  gstPercentage: selectedTax.gstPercentage
                }
              }));
            }
          }
          
          const baseAmount = quantity * price;
          const taxAmount = (baseAmount * tax) / 100;
          updatedRow.amount = (baseAmount + taxAmount).toFixed(2);
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

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a status name");
      return;
    }

    try {
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
      console.error("Failed to add status:", error);
      message.error("Failed to add status");
    }
  };

  const renderTaxSelector = (row) => {
    if (!showTax) {
      return (
        <input
          type="text"
          value="0"
          disabled
          className="w-full p-2 border bg-gray-100"
        />
      );
    }

    return (
      <select
        value={row.tax}
        onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="0">Select Tax</option>
        {taxes?.data?.map((tax) => (
          <option 
            key={tax.id} 
            value={tax.gstPercentage}
            title={`${tax.gstName}: ${tax.gstPercentage}%`}
          >
            {tax.gstName} ({tax.gstPercentage}%)
          </option>
        ))}
      </select>
    );
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
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
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
              <Form.Item label="Note" name="note">
                <Input placeholder="Enter Note (Optional)" />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item
                label="Bill Number"
                name="billNumber"
                rules={[
                  { required: true, message: "Please enter bill number" },
                ]}
              >
                <Input placeholder="Enter Bill Number" />
              </Form.Item>
            </Col> */}

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
                            value={row.price}
                            onChange={(e) => handleTableDataChange(row.id, "price", e.target.value)}
                            placeholder="Price"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          {renderTaxSelector(row)}
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
              </table>
              <div className="form-buttons text-right mb-2">
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
        visible={isTagModalVisible}
        onOk={handleAddNewTag}
        onCancel={() => setIsTagModalVisible(false)}
        okText="Add"
      >
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new status name"
        />
      </Modal>
    </div>
  );
};

export default EditBilling;

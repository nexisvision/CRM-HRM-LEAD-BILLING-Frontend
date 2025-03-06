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
  Switch,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { addbil, getbil } from "./billing2Reducer/billing2Slice";
import { vendordataedata } from "../../Purchase/vendor/vendorReducers/vendorSlice";
import Flex from 'components/shared-components/Flex';
import { GetAllProdu } from "../../project/product/ProductReducer/ProductsSlice";
import AddVendor from '../../Purchase/vendor/AddVendor';

const { Option } = Select;

const AddBilling = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const Tagsdetail = useSelector((state) => state.Lable);
  const { taxes } = useSelector((state) => state.tax);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

   // Get products directly from Redux store
   const productsData = useSelector((state) => state.Product.Product);
  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      tax: null,
      amount: 0,
      discription: "",
    }
  ]);

  const [showTax, setShowTax] = useState(false);

  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);

  const [totals, setTotals] = useState({
    subtotal: "0.00",
    discount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00",
  });

  const { vendors } = useSelector((state) => state.vendors);
  console.log('vendors data:', vendors);

  const [isAddVendorModalVisible, setIsAddVendorModalVisible] = useState(false);

  useEffect(() => {
    dispatch(Getcus());
    dispatch(getAllTaxes());
    dispatch(vendordataedata());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        tax: null,
        amount: 0,
        discription: "",
        isNew: true,
      }
    ]);
  };

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, discountValue);
    } else {
      message.warning("At least one item is required");
    }
  };


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
              discription: selectedProd.discription || "",
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
    const quantity = parseFloat(row.quantity) || 0;
    const price = parseFloat(row.price) || 0;
    const tax = showTax ? (parseFloat(row.tax) || 0) : 0;
    
    const baseAmount = quantity * price;
    const taxAmount = (baseAmount * tax) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    return totalAmount.toFixed(2);
  };

  const lid = AllLoggeddtaa.loggedInUser.id;

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Calculate amount if quantity, price, or tax changes
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

  const calculateTotal = (data = tableData, discountVal = discountValue, type = discountType) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data passed to calculateTotal');
      return;
    }

    // Calculate subtotal (sum of all item total amounts including their taxes)
    const subtotal = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
      
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      const totalAmount = baseAmount + taxAmount;
      
      return sum + totalAmount;
    }, 0);

    // Calculate discount amount based on type
    let discountAmount = 0;
    if (type === 'percentage') {
      discountAmount = (subtotal * (parseFloat(discountVal) || 0)) / 100;
    } else {
      discountAmount = parseFloat(discountVal) || 0;
    }

    // Calculate total tax (sum of all item tax amounts)
    const totalTax = data.reduce((sum, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const tax = row.tax ? parseFloat(row.tax.gstPercentage) : 0;
      const baseAmount = quantity * price;
      const taxAmount = (baseAmount * tax) / 100;
      return sum + taxAmount;
    }, 0);

    // Calculate final total: subtotal - discount
    const finalTotal = Math.max(0, subtotal - discountAmount);

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    });
  };

  const handleSubmit = () => {
    // First validate the form fields
    form.validateFields()
      .then((values) => {
        // Validate items first
        const hasInvalidItems = tableData.some(row => 
          !row.item || 
          !row.quantity || 
          row.quantity <= 0 || 
          !row.price || 
          row.price <= 0
        );

        if (hasInvalidItems) {
          message.error('Please fill in all required item fields (Item, Quantity, and Price)');
          return;
        }

        // Format items data
        const items = tableData.map(row => ({
          item: row.item,
          tax_name: row.tax?.gstName || '',
          tax_percentage: row.tax?.gstPercentage || 0,
          quantity: parseFloat(row.quantity) || 0,
          price: parseFloat(row.price) || 0,
          amount: parseFloat(row.amount) || 0,
          discription: row.discription || ""
        }));

        // Create invoice data object
        const invoiceData = {
          billNumber: values.billNumber,
          vendor: values.vendor,
          billDate: values.billDate?.format("YYYY-MM-DD"),
          discription: values.discription || "",
          status: values.status,
          category: values.category,
          items: items,
          discountType: discountType,
          discountValue: parseFloat(discountValue) || 0,
          tax: totals.totalTax || 0,
          subtotal: totals.subtotal || 0,
          discount: totals.discount || 0,
          total: totals.finalTotal || 0,
          note: values.note || ""
        };

        const lid = AllLoggeddtaa.loggedInUser.id;
        const payload = { lid, invoiceData };

        // Send data to backend
        dispatch(addbil(payload))
          .then((response) => {
            if (response.payload) {
              message.success("Bill added successfully!");
              dispatch(getbil(lid));
              form.resetFields();
              setTableData([{
                id: Date.now(),
                item: "",
                quantity: 1,
                price: 0,
                tax: null,
                amount: 0,
                discription: "",
              }]);
              setDiscountValue(0);
              onClose();
            }
          })
          .catch((error) => {
            console.error("Error adding bill:", error);
            message.error("Failed to add bill. Please try again.");
          });
      })
      .catch(() => {
        message.error("Please fill in all required fields");
      });
  };

  useEffect(() => {
    // Fetch existing tags/status when component mounts
    fetchTags();
  }, []);

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

  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
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

  useEffect(() => {
    fetchLables("category", setCategories);
    fetchLables("status", setStatuses);
  }, []);

  const handleAddNewLabel = async (labelType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${labelType} name`);
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType: labelType,
      };

      await dispatch(AddLable({ lid, payload }));
      message.success(`${labelType} added successfully`);

      // Fetch updated labels
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredLabels = response.payload.data
          .filter(label => label.lableType === labelType)
          .map(label => ({
            id: label.id,
            name: label.name.trim()
          }));

        // Update the appropriate state and form field
        if (labelType === "category") {
          setCategories(filteredLabels);
          form.setFieldsValue({ category: newValue.trim() });
        } else if (labelType === "status") {
          setStatuses(filteredLabels);
          form.setFieldsValue({ status: newValue.trim() });
        }
      }

      // Reset input and close modal
      setter("");
      modalSetter(false);
    } catch (error) {
      console.error(`Failed to add ${labelType}:`, error);
      message.error(`Failed to add ${labelType}`);
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
                label={<span>Vendor <span className="text-red-500">*</span></span>}
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
                label={<span>Bill Date <span className="text-red-500">*</span></span>}
                name="billDate"
                rules={[{ required: true, message: "Please select bill date" }]}
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<span>Category <span className="text-red-500">*</span></span>}
                name="category"
                rules={[{ required: true, message: "Please select or add a category" }]}
              >
                <Select
                  placeholder="Select or add new category"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setIsCategoryModalVisible(true)}
                          block
                        >
                          Add New Category
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<span>Status <span className="text-red-500">*</span></span>}
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
              <Form.Item label="discription" name="discription">
                <Input.TextArea placeholder="Enter discription" />
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
                  const updatedData = tableData.map(row => {
                    const newRow = {
                      ...row,
                      tax: checked ? row.tax : null
                    };
                    // Recalculate amount with new tax value
                    const quantity = parseFloat(newRow.quantity) || 0;
                    const price = parseFloat(newRow.price) || 0;
                    const tax = checked ? (parseFloat(newRow.tax) || 0) : 0;
                    
                    const baseAmount = quantity * price;
                    const taxAmount = (baseAmount * tax) / 100;
                    newRow.amount = (baseAmount + taxAmount).toFixed(2);
                    
                    return newRow;
                  });
                  setTableData(updatedData);
                  calculateTotal(updatedData);
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
                            placeholder="Item Name *"
                            className="w-full p-2 border rounded-s"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                            placeholder="Qty *"
                            className="w-full p-2 border rounded"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="0"
                            value={row.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleTableDataChange(row.id, "price", value === "" ? 0 : parseFloat(value));
                            }}
                            onFocus={(e) => {
                              if (parseFloat(e.target.value) === 0) {
                                e.target.value = "";
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                handleTableDataChange(row.id, "price", 0);
                              }
                            }}
                            placeholder="Price *"
                            className="w-full p-2 border rounded-s"
                            required
                          />
                        </td>
                        <td className="px-2 py-2 border-b">
                          {showTax ? (
                            <Select
                              value={row.tax ? `${row.tax.gstName}|${row.tax.gstPercentage}` : "0"}
                              onChange={(value) => {
                                if (!value) {
                                  handleTableDataChange(row.id, "tax", {
                                    gstName: "",
                                    gstPercentage: 0
                                  });
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
                            value={row.discription ? row.discription.replace(/<[^>]*>/g, '') : ''} // Remove HTML tags
                            onChange={(e) => handleTableDataChange(row.id, "discription", e.target.value)}
                            placeholder="discription"
                            className="w-[70%] p-2 border"
                        />
                    </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="form-buttons text-left mb-2 mt-2">
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
        <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit Bill
          </Button>
        </div>
      </Form>

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

      <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewLabel("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

      <Modal
        title="Add New Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={() => handleAddNewLabel("status", newStatus, setNewStatus, setIsStatusModalVisible)}
        okText="Add Status"
      >
        <Input
          placeholder="Enter new status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Modal>

    </div>
  );
};

export default AddBilling;

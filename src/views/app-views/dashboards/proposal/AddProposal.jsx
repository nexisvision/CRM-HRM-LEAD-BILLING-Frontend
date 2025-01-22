import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message, Upload, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import Flex from "components/shared-components/Flex";
// import { AddTrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";

const { Option } = Select;

const AddProposal = ({ onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rows, setRows] = useState([
        {
            id: Date.now(),
            link: "",
            title: "",
        },
    ]);
    const [tableData, setTableData] = useState([{ id: Date.now(), item: "", quantity: 1, price: 0, tax: "0", description: "", amount: 0 }]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [discountRate, setDiscountRate] = useState(0);
    const [totals, setTotals] = useState({ subtotal: 0, totalTax: 0, finalTotal: 0, totaldiscount: 0 });
    const [loading, setLoading] = useState(false);
    const [milestones, setMilestones] = useState([]);

    const initialValues = {
        leadtitle: "",
        dealtitle: "",
        vaildtill: "",
        currency: "",
        calculatedtax: "",
        item: "",
        discount: "",
        tax: "",
        total: "",
        description: "",
    };

    const validationSchema = Yup.object({
        leadtitle: Yup.string().required("Please enter Lead Title"),
        dealtitle: Yup.string().required("Please enter Deal Title"),
        vaildtill: Yup.string().required("Please enter Vaild Till"),
        currency: Yup.string().required("Please enter currency"),
        calculatedtax: Yup.string().required("Please enter Calculated Tax"),
        item: Yup.string().required("Please enter Item"),
        discount: Yup.string().required("Please enter Discount"),
        tax: Yup.string().required("Please enter  Tax"),
        total: Yup.string().required("Please enter Total"),
        description: Yup.number().required("Please enter Description").positive().integer(),
    });

    const handleProductChange = (value) => {
        setSelectedProduct(value);
    };

    const handleMilestoneChange = (value) => {
        setSelectedMilestone(value);
    };

    const handleTableDataChange = (id, field, value) => {
        const updatedData = tableData.map(row => row.id === id ? { ...row, [field]: value } : row);
        setTableData(updatedData);
        calculateTotal(updatedData, discountRate);
    };

    const handleDeleteRow = (id) => {
        const updatedData = tableData.filter(row => row.id !== id);
        setTableData(updatedData);
        calculateTotal(updatedData, discountRate);
    };

    const handleAddRow = () => {
        setTableData([...tableData, { id: Date.now(), item: "", quantity: 1, price: 0, tax: "0", description: "", amount: 0 }]);
    };

    const calculateTotal = (data, discount) => {
        const subtotal = data.reduce((acc, row) => acc + (row.price * row.quantity), 0);
        const totalTax = data.reduce((acc, row) => acc + (row.price * row.quantity * (parseFloat(row.tax) / 100)), 0);
        const finalTotal = subtotal + totalTax - (subtotal * (discount / 100));
        setTotals({ subtotal, totalTax, finalTotal });
    };

    const onSubmit = (values, { resetForm }) => {
        console.log(values);
        message.success("Proposal added successfully!");
        resetForm();
        onClose();
    };

    return (
        <div className="add-trainingSetup p-4">
            <hr className="mb-4 border border-gray-300" />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="add-trainingSetup"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Lead Title" name="leadtitle">
                                    <Field name="leadtitle">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Lead Title"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="leadtitle"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Deal Title" name="dealtitle">
                                    <Field name="dealtitle">
                                        {({ field }) => (
                                            <Input
                                                placeholder="Enter Deal Title"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="dealtitle"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} className=''>
                                <div className="form-item">
                                    <label className=''>Date</label>
                                    <DatePicker
                                        className="w-full mt-2"
                                        format="DD-MM-YYYY"
                                        value={values.date}
                                        onChange={(date) => setFieldValue('date', date)}
                                        onBlur={() => setFieldTouched("date", true)}
                                    />
                                    <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className="">
                                <div className="form-item">
                                    <label className="">Currency</label>
                                    <Field name="currency">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Currency"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue("currency", value)}
                                                value={values.role}
                                                onBlur={() => setFieldTouched("currency", true)}
                                                allowClear={false}
                                            >
                                                <Option value="ABC">ABC</Option>
                                                <Option value="XYZ">XYZ</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="role"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={12} className="mt-2">
                                <Form.Item label="Calculated Tax" name="calculatedtax">
                                    <Field name="calculatedtax">
                                        {({ field }) => (
                                            <Input

                                                placeholder="Enter Calculated Tax"
                                                {...field}

                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="calculatedtax"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </Form.Item>
                            </Col>

                            {/* <Col span={24} className="mt-2">
                                <div className="form-item">
                                    <label className="">Description</label>
                                    <Field name="description">
                                        {({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                className="mt-2"
                                                placeholder="Enter Description"
                                                value={values.description}
                                                onChange={(value) =>
                                                    setFieldValue("description", value)
                                                }
                                                onBlur={() =>
                                                    setFieldTouched("description", true)
                                                }
                                            />
                                        )}
                                    </Field>
                                </div>
                            </Col> */}
                        </Row>

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
                                <div className="form-buttons text-end mb-2">
                                    <Button className='border-0 text-white bg-blue-500' onClick={handleAddRow}>
                                        <PlusOutlined />  Add Items
                                    </Button>
                                </div>
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
                                                        <select
                                                            value={row.item}
                                                            onChange={(e) => handleTableDataChange(row.id, 'item', e.target.value)}
                                                            className="w-full p-2 border"
                                                        >
                                                            <option value="item1">Item1</option>
                                                            <option value="item2">Item2</option>

                                                        </select>
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
                                                        {/* <select
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
                                                        </select> */}
                                                        <input
                                                            type="number"
                                                            value={row.tax}
                                                            onChange={(e) => handleTableDataChange(row.id, 'tax', e.target.value)}
                                                            placeholder="tax"
                                                            className="w-full p-2 border rounded-s"
                                                        />
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
                            {/* <div className="form-buttons text-left mt-2">
                                <Button className='border-0 text-blue-500' onClick={handleAddRow}>
                                    <PlusOutlined />  Add Items
                                </Button>
                            </div> */}

                            <div className=" flex flex-col justify-end items-end  space-y-2">
                                <table className='w-full lg:w-[50%] p-2'>
                                    <tr className="flex justify-between px-2 py-2 border-x-2">
                                        <td className="font-medium">Sub Total</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.subtotal.toFixed(2)}
                                        </td>
                                    </tr>

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
                                                        calculateTotal(tableData, parseFloat(e.target.value) || 0);
                                                    }}
                                                    className="mt-1 block w-full p-2 border rounded"
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                                        <td className="font-medium">Total Tax</td>
                                        <td className="font-medium px-4 py-2">
                                            ₹{totals.totalTax.toFixed(2)}
                                        </td>
                                    </tr>

                                    <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                                        <td className="font-bold text-lg">Total Amount</td>
                                        <td className="font-bold text-lg px-4">
                                            ₹{totals.finalTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            {/* <div className="pt-4 text-right">
                                <h3 className="font-medium">Terms and Conditions</h3>
                                <p className="text-sm text-gray-600">Thank you for your business.</p>
                            </div> */}
                            {/* <div className='mt-4'>
                                <span className='block mb-2'>Add File</span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10'
                                    >
                                        <span className='text-xl'>Choose File</span>
                                    </Upload>
                                </Col>
                            </div> */}
                        </div>

                        <Form.Item>
                            <div className="text-right mt-3">
                                <Button type="default" className="mr-2" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Create
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProposal;

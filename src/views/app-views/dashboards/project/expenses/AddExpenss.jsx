import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    DatePicker,
    Select,
    message,
    Row,
    Col,
    Switch,
    Upload,
    Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Addexp, Getexp } from "./Expencereducer/ExpenseSlice";
import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";

const { Option } = Select;

const AddExpenses = ({ onClose }) => {
    const navigate = useNavigate();

    const { id } = useParams();

    const dispatch = useDispatch();
    const { currencies } = useSelector((state) => state.currencies);

    
        const allproject = useSelector((state) => state.Project);
        const fndrewduxxdaa = allproject.Project.data
        const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
        

    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        item: "",
        currency: "",
        ExchangeRate: "",
        price: "",
        purchase_date: "",
        employee: "",
        project: fnddata?.id || "",
        ExpenseCategory: "",
        PurchasedFrom: "",
        BankAccount: "",
        Description: "",
        bill: "",
    };
    const validationSchema = Yup.object({
        item: Yup.string().optional("Please enter item."),
        currency: Yup.string().optional("Please enter Currency."),
        ExchangeRate: Yup.string().optional("Please enter ExchangeRate."),
        price: Yup.string().optional("Please enter Price."),
        purchase_date: Yup.date().nullable().optional("Date is required."),
        employee: Yup.string().optional("Please enter Employee."),
        project: Yup.string().optional("Please enter Project."),
        ExpenseCategory: Yup.string().optional("Please enter ExpenseCategory."),
        PurchasedFrom: Yup.string().optional("Please enter PurchasedFrom."),
        BankAccount: Yup.string().optional("Please enter BankAccount."),
        Description: Yup.string().optional("Please enter a Description."),
        bill: Yup.string().optional("Please enter Bill."),
        description: Yup.string().optional("Please enter a description."),
    });
    const onSubmit = (values, { resetForm }) => {
        console.log("Form Values Submitted:", values);
        dispatch(Addexp({ id, values }))
            .then(() => {
                dispatch(Getexp(id));
                onClose();
                message.success("Expenses added successfully!");
                resetForm();
            })
            .catch((error) => {
                console.error("Submission Error:", error);
                message.error("Failed to add expenses. Please try again.");
            });
    };

    return (
        <div className="add-expenses-form">
            <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className="font-semibold">ItemName</label>
                                    <Field name="item" as={Input} placeholder="Enter item" />
                                    <ErrorMessage
                                        name="item"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold mb-2'>Currency</label>
                                    <div className="flex gap-2">
                                        <Field name="currency">
                                            {({ field, form }) => (
                                                <Select
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Select Currency"
                                                    onChange={(value) => {
                                                        const selectedCurrency = currencies.find(c => c.id === value);
                                                        form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                                    }}
                                                >
                                                    {currencies?.map((currency) => (
                                                        <Option
                                                            key={currency.id}
                                                            value={currency.id}
                                                        >
                                                            {currency.currencyCode}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        name="currency"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            {/* <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>ExchangeRate</label>
                                    <Field name="ExchangeRate" as={Input} placeholder="Enter ExchangeRate" />
                                    <ErrorMessage name="ExchangeRate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col> */}
                            <Col span={8}>
                                <div className="form-item">
                                    <label className="font-semibold">Price</label>
                                    <Field
                                        name="price"
                                        type="number"
                                        as={Input}
                                        placeholder="Enter price"
                                    />
                                    <ErrorMessage
                                        name="price"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={8} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Purchase Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.purchase_date}
                                        onChange={(date) => setFieldValue("purchase_date", date)}
                                        onBlur={() => setFieldTouched("purchase_date", true)}
                                    />
                                    <ErrorMessage
                                        name="purchase_date"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={8} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Employee</label>
                                    <Field name="employee">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select employee"
                                                className="w-full"
                                                onChange={(value) => setFieldValue("employee", value)}
                                                value={values.employee}
                                                onBlur={() => setFieldTouched("employee", true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="Employee"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={8} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Project</label>
                                    <Input
                                        defaultValue={fnddata?.project_name}
                                        placeholder="Enter project"
                                        disabled
                                    />
                                    <ErrorMessage
                                        name="project"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>

                            <Col span={8} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Purchased From</label>
                                    <Field
                                        name="PurchasedFrom"
                                        as={Input}
                                        placeholder="Enter PurchasedFrom"
                                    />
                                    <ErrorMessage
                                        name="PurchasedFrom"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <Col span={24} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Description</label>
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue("description", value)}
                                        placeholder="Enter Description"
                                        onBlur={() => setFieldTouched("description", true)}
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                            <div className="mt-4 w-full">
                                <span className="block  font-semibold p-2">Bill</span>
                                <Col span={24}>
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className="border-2 flex justify-center items-center p-10 "
                                    >
                                        <span className="text-xl">Choose File</span>
                                        {/* <CloudUploadOutlined className='text-4xl' /> */}
                                    </Upload>
                                </Col>
                            </div>
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default AddExpenses;










// import React, { useState, useEffect } from "react";
// import {
//     Input,
//     Button,
//     DatePicker,
//     Select,
//     message,
//     Row,
//     Col,
//     Switch,
//     Upload,
//     Modal,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Addexp, Getexp } from "./Expencereducer/ExpenseSlice";
// import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";

// const { Option } = Select;
// const AddExpenses = ({ onClose }) => {
//     const navigate = useNavigate();

//     const { id } = useParams();

//     const dispatch = useDispatch();
//     const { currencies } = useSelector((state) => state.currencies);


//     useEffect(() => {
//         dispatch(getallcurrencies());
//     }, [dispatch]);
//     const [showReceiptUpload, setShowReceiptUpload] = useState(false);
//     // const [uploadModalVisible, setUploadModalVisible] = useState(false);
//     const initialValues = {
//         item: "",
//         currency: "",
//         ExchangeRate: "",
//         price: "",
//         purchase_date: "",
//         employee: "",
//         project: "",
//         ExpenseCategory: "",
//         PurchasedFrom: "",
//         BankAccount: "",
//         Description: "",
//         bill: "",
//     };
//     const validationSchema = Yup.object({
//         item: Yup.string().optional("Please enter item."),
//         currency: Yup.string().optional("Please enter Currency."),
//         ExchangeRate: Yup.string().optional("Please enter ExchangeRate."),
//         price: Yup.string().optional("Please enter Price."),
//         purchase_date: Yup.date().nullable().optional("Date is required."),
//         employee: Yup.string().optional("Please enter Employee."),
//         project: Yup.string().optional("Please enter Project."),
//         ExpenseCategory: Yup.string().optional("Please enter ExpenseCategory."),
//         PurchasedFrom: Yup.string().optional("Please enter PurchasedFrom."),
//         BankAccount: Yup.string().optional("Please enter BankAccount."),
//         Description: Yup.string().optional("Please enter a Description."),
//         bill: Yup.string().optional("Please enter Bill."),
//         description: Yup.string().optional("Please enter a description."),
//     });
//     const onSubmit = (values, { resetForm }) => {
//         console.log("Form Values Submitted:", values);
//         dispatch(Addexp({ id, values }))
//             .then(() => {
//                 dispatch(Getexp(id));
//                 onClose();
//                 message.success("Expenses added successfully!");
//                 resetForm();
//             })
//             .catch((error) => {
//                 console.error("Submission Error:", error);
//                 message.error("Failed to add expenses. Please try again.");
//             });
//     };

//     return (
//         <div className="add-expenses-form">
//             <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={onSubmit}
//             >
//                 {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//                     <Form className="formik-form" onSubmit={handleSubmit}>
//                         <Row gutter={16}>
//                             <Col span={8}>
//                                 <div className="form-item">
//                                     <label className="font-semibold">ItemName</label>
//                                     <Field name="item" as={Input} placeholder="Enter item" />
//                                     <ErrorMessage
//                                         name="item"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <Col span={8}>
//                                 <div className="form-item">
//                                     <label className='font-semibold mb-2'>Currency</label>
//                                     <div className="flex gap-2">
//                                         <Field name="currency">
//                                             {({ field, form }) => (
//                                                 <Select
//                                                     {...field}
//                                                     className="w-full"
//                                                     placeholder="Select Currency"
//                                                     onChange={(value) => {
//                                                         const selectedCurrency = currencies.find(c => c.id === value);
//                                                         form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
//                                                     }}
//                                                 >
//                                                     {currencies?.map((currency) => (
//                                                         <Option
//                                                             key={currency.id}
//                                                             value={currency.id}
//                                                         >
//                                                             {currency.currencyCode}
//                                                         </Option>
//                                                     ))}
//                                                 </Select>
//                                             )}
//                                         </Field>
//                                     </div>
//                                     <ErrorMessage
//                                         name="currency"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             {/* <Col span={6} >
//                                 <div className="form-item">
//                                     <label className='font-semibold'>ExchangeRate</label>
//                                     <Field name="ExchangeRate" as={Input} placeholder="Enter ExchangeRate" />
//                                     <ErrorMessage name="ExchangeRate" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col> */}
//                             <Col span={8}>
//                                 <div className="form-item">
//                                     <label className="font-semibold">Price</label>
//                                     <Field
//                                         name="price"
//                                         type="number"
//                                         as={Input}
//                                         placeholder="Enter price"
//                                     />
//                                     <ErrorMessage
//                                         name="price"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <Col span={8} className="mt-2">
//                                 <div className="form-item">
//                                     <label className="font-semibold">PurchaseDate</label>
//                                     <DatePicker
//                                         className="w-full"
//                                         format="DD-MM-YYYY"
//                                         value={values.purchase_date}
//                                         onChange={(date) => setFieldValue("purchase_date", date)}
//                                         onBlur={() => setFieldTouched("purchase_date", true)}
//                                     />
//                                     <ErrorMessage
//                                         name="purchase_date"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <Col span={8} className="mt-2">
//                                 <div className="form-item">
//                                     <label className="font-semibold">Employee</label>
//                                     <Field name="employee">
//                                         {({ field }) => (
//                                             <Select
//                                                 {...field}
//                                                 placeholder="Select employee"
//                                                 className="w-full"
//                                                 onChange={(value) => setFieldValue("employee", value)}
//                                                 value={values.employee}
//                                                 onBlur={() => setFieldTouched("employee", true)}
//                                                 allowClear={false}
//                                             >
//                                                 <Option value="xyz">XYZ</Option>
//                                                 <Option value="abc">ABC</Option>
//                                             </Select>
//                                         )}
//                                     </Field>
//                                     <ErrorMessage
//                                         name="Employee"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <Col span={8} className="mt-2">
//                                 <div className="form-item">
//                                     <label className="font-semibold">Project</label>
//                                     <Field
//                                         name="project"
//                                         as={Input}
//                                         placeholder="Enter project"
//                                     />
//                                     <ErrorMessage
//                                         name="project"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>

//                             <Col span={8} className="mt-2">
//                                 <div className="form-item">
//                                     <label className="font-semibold">PurchasedFrom</label>
//                                     <Field
//                                         name="PurchasedFrom"
//                                         as={Input}
//                                         placeholder="Enter PurchasedFrom"
//                                     />
//                                     <ErrorMessage
//                                         name="PurchasedFrom"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <Col span={24} className="mt-2">
//                                 <div className="form-item">
//                                     <label className="font-semibold">Description</label>
//                                     <ReactQuill
//                                         value={values.description}
//                                         onChange={(value) => setFieldValue("description", value)}
//                                         placeholder="Enter Description"
//                                         onBlur={() => setFieldTouched("description", true)}
//                                     />
//                                     <ErrorMessage
//                                         name="description"
//                                         component="div"
//                                         className="error-message text-red-500 my-1"
//                                     />
//                                 </div>
//                             </Col>
//                             <div className="mt-4 w-full">
//                                 <span className="block  font-semibold p-2">Bill</span>
//                                 <Col span={24}>
//                                     <Upload
//                                         action="http://localhost:5500/api/users/upload-cv"
//                                         listType="picture"
//                                         accept=".pdf"
//                                         maxCount={1}
//                                         showUploadList={{ showRemoveIcon: true }}
//                                         className="border-2 flex justify-center items-center p-10 "
//                                     >
//                                         <span className="text-xl">Choose File</span>
//                                         {/* <CloudUploadOutlined className='text-4xl' /> */}
//                                     </Upload>
//                                 </Col>
//                             </div>
//                         </Row>
//                         <div className="form-buttons text-right mt-4">
//                             <Button type="default" className="mr-2" onClick={onClose}>
//                                 Cancel
//                             </Button>
//                             <Button type="primary" htmlType="submit">
//                                 Create
//                             </Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// };
// export default AddExpenses;

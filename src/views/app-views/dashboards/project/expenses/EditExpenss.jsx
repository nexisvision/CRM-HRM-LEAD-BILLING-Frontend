import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getallcurrencies } from "../../../setting/currencies/currenciesreducer/currenciesSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EditExp, Getexp } from "./Expencereducer/ExpenseSlice";
import dayjs from "dayjs"; // Import dayjs for date handling

const { Option } = Select;

const EditExpenses = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allempdata = useSelector((state) => state.Expense);
  const Expensedata = allempdata?.Expense?.data || [];

  const { id } = useParams();
    const { currencies } = useSelector((state) => state.currencies);

    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    item: "",
    currency: "",
    ExchangeRate: "",
    price: "",
    purchase_date: null,
    employee: "",
    project: "",
    ExpenseCategory: "",
    PurchasedFrom: "",
    BankAccount: "",
    description: "",
    bill: "",
  });

  useEffect(() => {
    // Fetch expense data if not already available
    if (!Expensedata.length) {
      dispatch(Getexp());
    }
  }, [dispatch]);

  useEffect(() => {
    if (Expensedata.length > 0 && idd) {
      const expdata = Expensedata.find((item) => item.id === idd);

      if (expdata) {
        // Convert the date string to dayjs object if it exists
        const purchaseDate = expdata.purchase_date
          ? dayjs(expdata.purchase_date)
          : null;

        setInitialValues({
          id: idd,
          item: expdata.item || "",
          currency: expdata.currency || "",
          ExchangeRate: expdata.ExchangeRate || "",
          price: expdata.price ? expdata.price.toString() : "", // Convert to string for input
          purchase_date: purchaseDate,
          employee: expdata.employee || "",
          project: expdata.project || "",
          ExpenseCategory: expdata.ExpenseCategory || "",
          PurchasedFrom: expdata.PurchasedFrom || "",
          BankAccount: expdata.BankAccount || "",
          description: expdata.description || "", // Fixed property name
          bill: expdata.bill || "",
        });
      } else {
        message.error("Expense not found!");
        navigate("/apps/sales/expenses");
      }
    }
  }, [idd, Expensedata, navigate]);

  const onSubmit = async (values, { resetForm }) => {
    const updatedValues = {
      ...values,
      price: parseFloat(values.price), // Convert price back to number
      purchase_date: values.purchase_date
        ? values.purchase_date.format("YYYY-MM-DD")
        : null,
    };

    try {
      await dispatch(EditExp({ id: idd, values: updatedValues })).unwrap();
      message.success("Expenses updated successfully!");
      dispatch(Getexp(id));
      onClose();
      resetForm();
    } catch (error) {
      message.error("Failed to update expenses. Please try again.");
    }
  };

  const validationSchema = Yup.object({
    item: Yup.string().required("Item is required."),
    currency: Yup.string().required("Currency is required."),
    price: Yup.string().required("Price is required"),
    purchase_date: Yup.mixed().required("Date is required."),
    description: Yup.string().required("Description is required."),
  });

  return (
    <div className="Edit-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        enableReinitialize // Add this to handle initialValues updates
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
                  <label className="font-semibold">PurchaseDate</label>
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
                  <Field
                    name="project"
                    as={Input}
                    placeholder="Enter project"
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
                  <label className="font-semibold">PurchasedFrom</label>
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditExpenses;

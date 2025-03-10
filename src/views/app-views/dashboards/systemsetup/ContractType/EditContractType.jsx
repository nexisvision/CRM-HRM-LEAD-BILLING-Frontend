import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import OrderListData from "assets/data/order-list.data.json";
import Flex from "components/shared-components/Flex";
import utils from "utils";
import AvatarStatus from "components/shared-components/AvatarStatus";
import userData from "assets/data/user-list.data.json";
import dayjs from "dayjs";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AddLable,
  Editmins,
  GetLable,
} from "../../project/milestone/LableReducer/LableSlice";
import { useDispatch, useSelector } from "react-redux";
import Item from "antd/es/list/Item";

const { Option } = Select;

const EditContractType = ({ idd, onClose }) => {
  const [users, setUsers] = useState(userData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allloggeddata = useSelector((state) => state.user);
  const userdata = allloggeddata.loggedInUser;

  const lid = userdata.id;

  const alltagdata = useSelector((state) => state.Lable);
  const datas = alltagdata.Lable.data;

  const fnddata = datas.find((Item) => Item.id === idd);

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      ...values,
      labelType: "source",
    };

    dispatch(Editmins({ idd, payload }));
    dispatch(GetLable(lid));
    dispatch(GetLable(lid));
    onClose();
    resetForm();
    message.success("Country added successfully!");
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  useEffect(() => {
    if (fnddata) {
      setInitialValues(fnddata);
    }
  }, [fnddata]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter sourcename."),
  });

  return (
    <>
      <div>
        <div className="">
          <h2 className="mb-1 border-b font-medium"></h2>

          <div className="">
            <div className="">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({
                  values,
                  setFieldValue,
                  handleSubmit,
                  setFieldTouched,
                  resetForm,
                }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      <Col span={24} className="mt-2">
                        <div className="form-item">
                          <label className="font-semibold">Contract Type Name <span className="text-rose-500">*</span></label>
                          <Field
                            name="name"
                            as={Input}
                            className="w-full mt-1"
                            placeholder="Enter Contract Type Name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="error-message text-red-500 my-1"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="form-buttons text-right mt-3">
                      <Button type="default" className="mr-2" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        UpDate
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditContractType;

import React, { Component, useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Table,
  Select,
  message,
} from "antd";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice";

const { Column } = Table;

const { Option } = Select;

const getPaymentStatus = (status) => {
  if (status === "Paid") {
    return "success";
  }
  if (status === "Pending") {
    return "warning";
  }
  if (status === "Expired") {
    return "error";
  }
  return "";
};

const getShippingStatus = (status) => {
  if (status === "Ready") {
    return "blue";
  }
  if (status === "Shipped") {
    return "cyan";
  }
  return "";
};

const paymentStatusList = ["Normal", "UNNormal", "Expired"];

export const TicketList = () => {
//   const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddTicketModalVisible, setIsAddTicketModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] =
    useState(false);
  const [isViewTicketModalVisible, setIsViewTicketModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(ClientData())
  },[])

  const allclientdata = useSelector((state)=>state.ClientData)
const fndata = allclientdata.ClientData.data;

useEffect(()=>{
  if(fndata){
      setList(fndata)
  }
},[fndata])

  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = alldatat?.Ticket?.data || [];

  // Open Add Job Modal
  const openAddTicketModal = () => {
    setIsAddTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddTicketModal = () => {
    setIsAddTicketModalVisible(false);
  };

  // Open Add Job Modal
  const openEditTicketModal = () => {
    setIsEditTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditTicketModal = () => {
    setIsEditTicketModalVisible(false);
  };

  const openViewTicketModal = () => {
    setIsViewTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewTicketModal = () => {
    setIsViewTicketModalVisible(false);
  };

 


  const deletfun = (userId) => {
   
    setList(list.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const editfun = (idd) => {
    openEditTicketModal();
    setIdd(idd);
  };


  const tableColumns = [
    {
      title: "username",
      dataIndex: "username",
      sorter: {
        compare: (a, b) => a.username.length - b.username.length,
      },
    },

    {
      title: "email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.length - b.email.length,
      },
    },

    
    {
      title: "created_by",
      dataIndex: "created_by",
      sorter: {
        compare: (a, b) => a.created_by.length - b.created_by.length,
      },
     
    },

   
   
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <div className="container">
     
     
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            
            <div className="mb-3">
             
            </div>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" gap="7px">
           
          </Flex>
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            
          />
        </div>
        

    </div>
  );
};

export default TicketList;

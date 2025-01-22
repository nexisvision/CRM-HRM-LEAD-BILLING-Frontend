import React, { Component, useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  
  Modal,
  Menu,
 
  message,
} from "antd";
import OrderListData from "assets/data/order-list.data.json";

import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
// import EditTicket from "./EditTicket";
// import AddTicket from "./AddTicket";
// import ViewTicket from "./ViewTicket";
// import { DeleteTicket, getAllTicket } from "./TicketReducer/TicketSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

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

  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = alldatat?.Ticket?.data || [];
  console.log(",mm,,m,m", fnddata);

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

 

  // useEffect(() => {
  //   dispatch(getAllTicket());
  // }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  const deletfun = (userId) => {
    // dispatch(DeleteTicket(userId));
    // dispatch(getAllTicket());
    // dispatch(getAllTicket());
    setList(list.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const editfun = (idd) => {
    openEditTicketModal();
    setIdd(idd);
  };


  const tableColumns = [
    {
      title: "Ticket#",
      dataIndex: "ticket",
      sorter: {
        compare: (a, b) => a.ticket.length - b.ticket.length,
      },
    },

    {
      title: "Ticket Subject",
      dataIndex: "ticketSubject",
      sorter: {
        compare: (a, b) => a.ticketSubject.length - b.ticketSubject.length,
      },
    },

    
    {
      title: "Status",
      dataIndex: "Status",
      sorter: {
        compare: (a, b) => a.Status.length - b.Status.length,
      },
     
    },

    {
      title: "Requested On",
      dataIndex: "Requested On",
      sorter: {
        compare: (a, b) => a.RequestedOn.length - b.RequestedOn.length,
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

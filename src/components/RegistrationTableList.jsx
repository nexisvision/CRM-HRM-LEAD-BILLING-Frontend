import React, { useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Table,
} from "antd";
import OrderListData from "assets/data/order-list.data.json";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice";

export const TicketList = () => {
  const [list, setList] = useState(OrderListData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClientData())
  }, [dispatch])

  const allclientdata = useSelector((state) => state.ClientData)
  const fndata = allclientdata.ClientData.data;

  useEffect(() => {
    if (fndata) {
      setList(fndata)
    }
  }, [fndata])

  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = alldatat?.Ticket?.data || [];


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

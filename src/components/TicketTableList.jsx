import React, { useEffect, useMemo, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Table,
} from "antd";
import { useSelector } from "react-redux";

export const TicketList = () => {

  const [list, setList] = useState();

  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = useMemo(() => alldatat?.Ticket?.data || [], [alldatat]);
  console.log(",mm,,m,m", fnddata);


  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);


  const tableColumns = [
    {
      title: "priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.priority.length - b.priority.length,
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
      title: "created_by",
      dataIndex: "created_by",
      sorter: {
        compare: (a, b) => a.created_by.length - b.created_by.length,
      },
    },


    {
      title: "status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },

    },

    {
      title: "description",
      dataIndex: "description",
      sorter: {
        compare: (a, b) => a.description.length - b.description.length,
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

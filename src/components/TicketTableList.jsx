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
    <div className="w-full">
      <div className="w-full">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="w-full mb-4"
        >
          <Flex className="w-full md:w-auto" mobileFlex={false}>
            <div className="w-full md:w-48">
            </div>
          </Flex>
        </Flex>
        <div className="w-full overflow-x-auto">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: true }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketList;

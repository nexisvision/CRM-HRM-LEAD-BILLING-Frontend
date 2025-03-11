import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Modal,
  message,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import AddAllowance from "./AddAllowance";
import employeeSalaryData from "assets/data/employee-salary.data.json";
import utils from "utils";
import { useDispatch, useSelector } from "react-redux";
import { deleteallowan, getallowan } from "./AllowancwReducer/AllowanceSlice";

const AllowanceList = ({ id, onClose }) => {
  const [salaryData, setSalaryData] = useState(employeeSalaryData); // Salary data
  const [isModalVisible, setIsModalVisible] = useState(false); // Add Salary Modal
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for batch actions
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getallowan());
  }, [dispatch]);

  const alladata = useSelector((state) => state.allowance);
  const fndcdata = alladata.allowance.data;

  const fnddatasss = fndcdata?.filter((item) => item?.employeeId === id)

  useEffect(() => {
    if (fnddatasss) {
      setSalaryData(fnddatasss);
    }
  }, [fndcdata, fnddatasss]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const filteredData = utils.wildCardSearch(employeeSalaryData, value);
    setSalaryData(filteredData);
    setSelectedRowKeys([]);
  };

  const deleteSalaryEntry = (id) => {
    dispatch(deleteallowan(id)).then(() => {
      dispatch(getallowan());
      setSalaryData(salaryData.filter((item) => item.id !== id));
      message.success({ content: `Salary record deleted`, duration: 2 });
    });
  };

  const getDropdownItems = (record) => {
    return [
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteSalaryEntry(record.id),
        danger: true
      }
    ];
  };

  const tableColumns = [
    {
      title: "Allowance Option",
      dataIndex: "allowanceOption",
      sorter: (a, b) => a.payslipType.localeCompare(b.payslipType),
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title - b.title,
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
      sorter: (a, b) => a.amount.localeCompare(b.amount),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold">Allowance</h3>
      <hr
        style={{
          marginBottom: "20px",
          marginTop: "5px",
          border: "1px solid #e8e8e8",
        }}
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mobileFlex={false}
      >
        <div className="mr-md-3 mb-3">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e)}
            className="search-input"
          />
        </div>
        <Flex gap="7px">
          <Button type="primary" onClick={openModal}>
            <PlusOutlined />
          </Button>

        </Flex>
      </Flex>
      <div className="table-responsive mt-3">
        <Table
          columns={tableColumns}
          dataSource={salaryData}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          scroll={{ x: 1000 }}
        />
      </div>
      <Modal
        title="Add Allowance"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <AddAllowance id={id} onClose={closeModal} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
  }

  .ant-dropdown-menu-item {
    padding: 8px 16px;
    border-radius: 4px;
    margin: 2px 0;
    transition: all 0.3s;
  }

  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }

  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }

  .ant-dropdown-menu-item .anticon {
    font-size: 16px;
    margin-right: 8px;
  }

  .ant-btn-text:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-btn-text:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const AllowanceListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AllowanceList />
  </>
);

export default AllowanceListWithStyles;

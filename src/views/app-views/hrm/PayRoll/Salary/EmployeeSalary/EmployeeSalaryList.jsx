import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Input, Button, Modal, message } from 'antd';
import { EyeOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddEmployeeSalary from './AddEmployeeSalary';
import employeeSalaryData from 'assets/data/employee-salary.data.json';
import utils from 'utils';

const EmployeeSalaryList = () => {
  const [salaryData, setSalaryData] = useState(employeeSalaryData); // Salary data
  const [isModalVisible, setIsModalVisible] = useState(false); // Add Salary Modal
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Selected rows for batch actions

  // Open Add Salary Modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Close Add Salary Modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const filteredData = utils.wildCardSearch(employeeSalaryData, value);
    setSalaryData(filteredData);
    setSelectedRowKeys([]);
  };

  // Delete a salary entry
  const deleteSalaryEntry = (id) => {
    setSalaryData(salaryData.filter((item) => item.id !== id));
    message.success({ content: `Salary record deleted`, duration: 2 });
  };

  // Dropdown menu for action options
  const dropdownMenu = (record) => (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<EyeOutlined />} size="small">
          View Details
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => deleteSalaryEntry(record.id)}
        >
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );

  // Table columns
  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Payslip Type',
      dataIndex: 'payslipType',
      sorter: (a, b) => a.payslipType.localeCompare(b.payslipType),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      sorter: (a, b) => a.account.localeCompare(b.account),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) => (
        <EllipsisDropdown menu={dropdownMenu(record)} />
      ),
    },
  ];

  return (
    <Card>
        <h3 className='text-lg font-bold'>Employee Salary</h3>
        <hr style={{ marginBottom: '20px',marginTop:"5px", border: '1px solid #e8e8e8' }} />
      <Flex justifyContent="space-between" alignItems="center" mobileFlex={false}>
        <div className="mr-md-3 mb-3">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e)}
          />
        </div>
        <Flex gap="7px">
          <Button type="primary" onClick={openModal}>
            <PlusOutlined />
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export
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
        title="Add Employee Salary"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <AddEmployeeSalary onClose={closeModal} />
      </Modal>
    </Card>
  );
};

export default EmployeeSalaryList;

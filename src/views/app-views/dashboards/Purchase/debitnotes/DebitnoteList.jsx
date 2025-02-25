import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddJob from './AddJob';
import { useNavigate } from 'react-router-dom';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import AddDebitnote from './AddDebitnote';
import EditDebitnote from './EditDebitnote';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDebitNotes } from './debitReducer/DebitSlice';
import moment from 'moment';
import { getbil } from '../../sales/billing/billing2Reducer/billing2Slice';
const { Option } = Select

const DebitnoteList = () => {
    const dispatch = useDispatch();
    const { debitNotes, loading } = useSelector((state) => state.debitNotes);
    const { salesbilling } = useSelector((state) => state.salesbilling);
   
    const [list, setList] = useState([]);
  
    const [accountType, setAccountType] = useState('All');
  
    const [isAddDebitnoteModalVisible, setIsAddDebitnoteModalVisible] = useState(false);

    const AllLoggeddtaa = useSelector((state) => state.user);
    const lid = AllLoggeddtaa.loggedInUser.id;

    const [searchText, setSearchText] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        dispatch(getAllDebitNotes());
        dispatch(getbil(lid));
    }, [dispatch, lid]);

    useEffect(() => {
        if (debitNotes && salesbilling?.data) {
            const updatedList = debitNotes.map(debitNote => {
                const matchingBill = salesbilling.data.find(bill => bill.id === debitNote.bill);
                return {
                    ...debitNote,
                    billNumber: matchingBill?.billNumber || 'N/A'
                };
            });
            setList(updatedList);
        }
    }, [debitNotes, salesbilling]);

    useEffect(() => {
        applyFilters();
    }, [list, searchText]);

    const applyFilters = () => {
        let filtered = [...list];

        // Search text filter
        if (searchText) {
            filtered = filtered.filter(item => 
                item.billNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredList(filtered);
    };

    const onSearch = (e) => {
        setSearchText(e.target.value);
    };
   
    const tableColumns = [
        {
            title: 'Bill Number',
            dataIndex: 'billNumber',
            render: (billNumber) => billNumber || 'N/A',
            sorter: (a, b) => (a.billNumber || '').localeCompare(b.billNumber || ''),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD-MM-YYYY'),
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (amount) => `₹${amount}`,
            sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (description) => (
                <div dangerouslySetInnerHTML={{ __html: description }} />
            ),
        },
    ];
  
    const openAddDebitnoteModal = () => {
        setIsAddDebitnoteModalVisible(true);
    };

    const closeAddDebitnoteModal = () => {
        setIsAddDebitnoteModalVisible(false);
    };


    return (
        <Card bodyStyle={{ padding: '-3px' }}>
          
            <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <Input 
                            placeholder="Search" 
                            prefix={<SearchOutlined />} 
                            onChange={onSearch}
                            value={searchText}
                        />
                    </div>
                   
                   
                   
                </Flex>
                <Flex gap="7px">
                    <Button type="primary" onClick={openAddDebitnoteModal}>
                        <PlusOutlined />
                        <span>New</span>
                    </Button>
                    <Button type="primary" icon={<FileExcelOutlined />} block>
                        Export All
                    </Button>
                </Flex>
            </Flex>
            <div className="table-responsive mt-2">
                <Table
                    columns={tableColumns}
                    dataSource={filteredList}
                    rowKey="id"
                    // loading={loading}
                    scroll={{ x: 1200 }}
                />
            </div>
            
            <Modal
                title="Add Debit Note"
                visible={isAddDebitnoteModalVisible}
                onCancel={closeAddDebitnoteModal}
                footer={null}
                width={1000}
            >
                <AddDebitnote onClose={closeAddDebitnoteModal} />
            </Modal>
            
        </Card>
    );
};
export default DebitnoteList;



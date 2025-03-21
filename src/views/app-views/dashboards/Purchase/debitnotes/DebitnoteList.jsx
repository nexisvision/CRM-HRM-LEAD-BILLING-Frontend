import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Input, Button, Modal, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import AddDebitnote from './AddDebitnote';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDebitNotes } from './debitReducer/DebitSlice';
import moment from 'moment';
import { getbil } from '../../sales/billing/billing2Reducer/billing2Slice';

const DebitnoteList = () => {
    const dispatch = useDispatch();
    const { debitNotes } = useSelector((state) => state.debitNotes);
    const { salesbilling } = useSelector((state) => state.salesbilling);
    const [list, setList] = useState([]);
    const [isAddDebitnoteModalVisible, setIsAddDebitnoteModalVisible] = useState(false);
    const AllLoggeddtaa = useSelector((state) => state.user);
    const lid = AllLoggeddtaa.loggedInUser.id;
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
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

    const applyFilters = useCallback(() => {
        let filtered = [...list];

        if (searchText) {
            filtered = filtered.filter(item =>
                item.billNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedDate) {
            const selectedDay = dayjs(selectedDate).startOf('day');
            filtered = filtered.filter(item => {
                if (!item.date) return false;
                const itemDate = dayjs(item.date).startOf('day');
                return itemDate.isSame(selectedDay, 'day');
            });
        }

        setFilteredList(filtered);
    }, [list, searchText, selectedDate]);

    useEffect(() => {
        applyFilters();
    }, [list, searchText, selectedDate, applyFilters]);

    const onSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
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
                    <div className="mr-md-3 mb-3">
                        <DatePicker
                            onChange={handleDateChange}
                            value={selectedDate}
                            format="DD-MM-YYYY"
                            placeholder="Select Date"
                            allowClear
                            style={{ width: '100%' }}
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



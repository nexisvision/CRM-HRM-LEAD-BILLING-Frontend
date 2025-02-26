import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { empdata } from './EmployeeReducers/EmployeeSlice';
import { useDispatch, useSelector } from 'react-redux';


function ViewEmployee({employeeIdd}) {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(empdata())
  },[dispatch])

  const alladatas = useSelector((state)=>state.employee.employee.data);
  const fndata = alladatas;

  const alladata = fndata?.find((item)=>item.id === employeeIdd);


  return (
    <>
    <div>
        <div className='bg-gray-50 mx-[-24px] mb-[-20px] mt-[-53px] rounded-t-lg rounded-b-lg px-4 pt-4 '>
        <h2 className=" border-b pb-[40px] font-medium"></h2>
        <div className='grid grid-cols-1 gap-3 '>
      <div className='mt-4'>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3'> 
        {/* <div className='flex mt-3 gap-3 flex-wrap sm:flex-nowrap md:flex-nowrap'>  */}
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Personal Detail</h1>
            </div>
            <div className=' mt-2 p-2 lg:p-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>EmployeeId :</span> {alladata?.employeeId || 'N/A'}</h6>
                        <h6><span className='font-medium'>Email :</span> {alladata?.email || 'N/A'}</h6>
                        <h6><span className='font-medium'>Phone :</span> {alladata?.phone || 'N/A'}</h6>
                        <h6><span className='font-medium'>Salary Type :</span> {alladata?.salary || 'N/A'}</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Name :</span> {`${alladata?.firstName || ''} ${alladata?.lastName || ''}`}</h6>
                        <h6><span className='font-medium'>Date of Birth :</span> {alladata?.joiningDate || 'N/A'}</h6>
                        <h6><span className='font-medium'>Address :</span> {alladata?.address || 'N/A'}</h6>
                        <h6><span className='font-medium'>Basic Salary :</span> {alladata?.salary || 'N/A'}</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        <Card className='mt-2 w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Company Detail</h1>
            </div>
            <div className='mt-2 p-2 lg:p-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Branch :</span> {alladata?.branch || 'N/A'}</h6>
                        <h6 className='md:mt-5 lg:mt-5'><span className='font-medium'>Designation :</span> {alladata?.designation || 'N/A'}</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Department :</span> {alladata?.department || 'N/A'}</h6>
                        <h6><span className='font-medium'>Date Of Joining :</span> {alladata?.joiningDate || 'N/A'}</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <div className=''>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3'> 
        {/* <div className='flex mt-3 gap-3 flex-wrap sm:flex-nowrap md:flex-nowrap'>  */}
        <Card className=' w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Document Detail</h1>
            </div>
            <div className=' mt-2 p-2 lg:p-0'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Certificate :</span> {alladata?.documents || 'N/A'}</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Photo :</span> <a href={alladata?.cv_path || '#'} target='_blank' className='text-blue-500'> {alladata?.cv_path ? 'View Document' : 'N/A'}</a></h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        <Card className='w-full'>
          <div>
            <div className='flex justify-between border-b pb-2'>
              <h1 className='text-lg font-medium'>Bank Account Detail</h1>
            </div>
            <div className='mt-2 p-2 lg:p-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <div>
                        <h6><span className='font-medium'>Account Holder Name :</span> {alladata?.accountholder || 'N/A'}</h6>
                        <h6><span className='font-medium'>Bank Name :</span> {alladata?.bankname || 'N/A'}</h6>
                        <h6><span className='font-medium'>Branch Location :</span> {alladata?.banklocation || 'N/A'}</h6>
                    </div>
                    <div>
                        <h6><span className='font-medium'>Account Number :</span> {alladata?.accountnumber || 'N/A'}</h6>
                        <h6><span className='font-medium'>Bank Identifier Code :</span> {alladata?.ifsc || 'N/A'}</h6>
                        <h6><span className='font-medium'>Tax Payer Id :</span> {alladata?.gstIn || 'N/A'}</h6>
                    </div>
                </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
        </div>
    </div>
    

        </>
  )
}

export default ViewEmployee

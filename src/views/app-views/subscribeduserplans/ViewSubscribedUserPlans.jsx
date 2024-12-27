import React, { useState } from 'react';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';


function ViewSubscribedUserPlans() {
    return (
        <>
         <h2 className="border-b pb-[5px] font-medium"></h2>
            <Card className='border-0'>
                <table class="table table-bordered w-full">
                    <tbody>
                        <tr>
                            <td className='text-[#5b676d] font-semibold text-base p-2'>User Name</td>
                            <td className='  font-medium  text-[#5b676d] p-2'>: QA Tester</td>
                        </tr>
                        <tr class="font-16 font-weight-600">
                            <td className='  text-[#5b676d] p-2 font-semibold text-base'>Plan Name</td>
                            <td className='  font-medium  text-[#5b676d] p-2'>
                            : Basic</td>

                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] font-semibold text-base p-2'>Plan Price</td>
                            <td className=' font-medium  text-[#5b676d] p-2 '>: ₹299.00
                            </td>
                        </tr>
                        <tr>
                            <td className=' text-[#5b676d] p-2 font-semibold text-base'>Payable Amount</td>
                            <td className='  font-medium  text-[#5b676d] p-2'>: ₹0</td>
                        </tr>

                        <tr>
                            <td className=' text-[#5b676d] p-2 font-semibold text-base'>Payment Type</td>
                            <td className=' font-medium text-[#5b676d] p-2'>: Stripe</td>
                        </tr>
                        <tr>
                            <td className='text-[#5b676d] p-2 font-semibold text-base'>End Date</td>
                            <td className='  font-medium text-[#5b676d] p-2'>: Feb 13, 2025</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export default ViewSubscribedUserPlans;

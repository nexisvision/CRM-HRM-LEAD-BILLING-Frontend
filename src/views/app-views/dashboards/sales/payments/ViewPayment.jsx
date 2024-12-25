import React, { useState } from 'react';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';


function ViewPayment() {
    return (
        <>
         <h2 className="border-b pb-[5px] font-medium"></h2>
            <Card className='border-0'>
                <table class="table table-bordered w-full">
                    <tbody>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Payment ID</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'>#113</td>
                        </tr>
                        <tr class="font-16 font-weight-600">
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Amount</td>
                            <td className=' border font-bold border-[#eae7e7] text-[#5b676d] p-2'>
                                $250.00</td>

                        </tr>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Invoice ID</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'> INV-000125
                            </td>
                        </tr>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Date</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'>02-28-2024</td>
                        </tr>

                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Payment Method</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'>Paypal</td>
                        </tr>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Client</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'>Dellon Inc</td>
                        </tr>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Project</td>
                            <td className=' border font-light border-[#eae7e7] text-[#5b676d] p-2'>Mobile banking app development</td>
                        </tr>
                        <tr>
                            <td className='bg-[#f7f7f7] border border-[#eae7e7] text-[#5b676d] p-2'>Notes</td>
                            <td className='border font-light border-[#eae7e7] text-[#5b676d] p-2'></td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </>
    )
}

export default ViewPayment;

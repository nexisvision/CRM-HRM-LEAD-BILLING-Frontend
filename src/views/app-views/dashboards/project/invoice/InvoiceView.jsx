import React from 'react';

const InvoiceView = () => {
    const summaryData = {
        subTotal: 30644.00,
        total: 30644.00,
        totalPaid: 30644.00,
        totalDue: 0.00,
    };
    const invoiceData = {
        invoiceNumber: 'INV#011',
        invoiceDate: 'Sun 15 Sep 2024',
        billedTo: 'Rusty Mills II',
        email: 'gkautzer@example.net8',
        company: 'Bartoletti PLC',
        address: '061 Virginie Summit, Pollichstad, CA 75654',
        items: [
            {
                description: 'autem',
                quantity: 10,
                unitPrice: 1604.00,
                amount: 16040.00,
            },
            {
                description: 'dolorem',
                quantity: 12,
                unitPrice: 1217.00,
                amount: 14604.00,
            },
        ],
        subTotal: 30644.00,
        total: 30644.00,
        totalPaid: 30644.00,
        totalDue: 0.00,


    };

    return (
        <div className="bg-gray-50 text-white p-6 rounded-lg">
            <h1 className='flex justify-end  text-2xl font-semibold '>INVOICE</h1>
            <div className='flex justify-end mt-4'>
                <table className='text-gray-600 text-center border border-gray-700'>
                    <thead className='text-gray-600 '>
                        <tr>
                            <th className='border border-gray-700 p-2 '>Invoice Number</th>
                            <th className='border border-gray-700 p-2 '>INV#011</th>
                        </tr>
                        <tr>
                            <th className='border border-gray-700  p-2'>Invoice Date</th>
                            <th className='border border-gray-700 p-2 '>Sun 15 Sep 2024</th>
                        </tr>
                    </thead>
                </table>
            </div>


            {/* <div > 
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Invoice Number:</span>
          <span className='text-gray-600'>{invoiceData.invoiceNumber}</span>
        </div>
      <div className="flex justify-between mb-4">
        <span className='text-gray-600'>Invoice Date:</span>
        <span className='text-gray-600'>{invoiceData.invoiceDate}</span>
      </div>
      </div> */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mt-4 ">Billed To:</h3>
                <p>
                    {invoiceData.billedTo}
                    <br />
                    {invoiceData.email}
                </p>
                <p>{invoiceData.company}</p>
                <p>{invoiceData.address}</p>
                <div className='flex justify-end mb-9'>
                    <button className='bg-blue-500 text-white p-2 rounded-md'>PAID</button>
                </div>
            </div>

            <table className="w-full border border-gray-700">
                <thead>
                    <tr>
                        <th className="border border-gray-700 text-black p-2">Description</th>
                        <th className="border border-gray-700 text-black p-2">Quantity</th>
                        <th className="border border-gray-700 text-black p-2">Unit Price (USD)</th>
                        <th className="border border-gray-700 text-black p-2">Tax</th>
                        <th className="border border-gray-700 text-black p-2">Amount (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.items.map((item) => (
                        <tr key={item.description}>
                            <td className="border border-gray-700 text-gray-600 p-2 text-center   ">{item.description}</td>
                            <td className="border border-gray-700 text-gray-600 p-2 text-center">{item.quantity}</td>
                            <td className="border border-gray-700 text-gray-600 p-2 text-center">${item.unitPrice.toFixed(2)}</td>
                            <td className="border border-gray-700 text-gray-600 p-2 text-center"></td>
                            <td className="border border-gray-700 text-gray-600 p-2 text-center">${item.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <div className="flex justify-end w-full gap-4">
                    <p >Sub Total:</p>
                    <p >${invoiceData.subTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-end gap-4  ">
                    <p >Total:</p>
                    <p>${invoiceData.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-end gap-4">
                    <p  >Total Paid:</p>
                    <p>${invoiceData.totalPaid.toFixed(2)} USD</p>
                </div>
                <div className="flex justify-end gap-4">
                    <p  >Total Due:</p>
                    <p>${invoiceData.totalDue.toFixed(2)} USD</p>
                </div>
            </div> 

            {/* <div className="mt-4 border">
                <div className="flex justify-end border-x-2 border-top-0" >
                    <p className="mr-4 ">Sub Total:</p>
                    <p>${summaryData.subTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-end border-x-2 border-y-2 ">
                    <p className="mr-4">Total:</p>
                    <p>${summaryData.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-end border-x-2 border-y-2">
                    <p className="mr-4">Total Paid:</p>
                    <p>${summaryData.totalPaid.toFixed(2)} USD</p>
                </div>
                <div className="flex justify-end border-x-2 border-y-2">
                    <p className="mr-4">Total Due:</p>
                    <p>${summaryData.totalDue.toFixed(2)} USD</p>
                </div>
            </div> */}

            

            <div className="mt-4">
                <p>Note:</p>
            </div>

            <div className="mt-4">
                <p>Terms and Conditions</p>
                <p>Thank you for your business.</p>
            </div>
        </div>
    );
};

export default InvoiceView;
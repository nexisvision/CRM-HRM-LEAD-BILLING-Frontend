import React from 'react';
import Qr from '../../../../../../assets/svg/Qr.png'

const BillInformationList = () => {
    return (
        <div className="">

            <div className="bg-white rounded-md p-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Bill</h2>
                    <p className="text-sm font-semibold text-gray-700">#BILL00001</p>
                </div>
                <div className="flex justify-end items-start pb-4 mb-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Issue Date: 05-01-2024</p>
                        <p className="text-xs text-gray-500">Due Date: 14-01-2024</p>
                    </div>
                </div>

                {/* Billing and Shipping Details */}
                <div className="grid grid-cols-3 gap-20">
                    {/* Billed To */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Billed To:</h3>
                        <p className="text-sm text-gray-600">Anthony B Renfroe</p>
                        <p className="text-sm text-gray-600">Roshita Apartment</p>
                        <p className="text-sm text-gray-600">Borivali</p>
                        <p className="text-sm text-gray-600">GUJARAT, 395006</p>
                        <p className="text-sm text-gray-600">India</p>
                        <p className="text-sm text-gray-600">04893258663</p>
                        <p className="text-sm text-gray-600">GST Number : GSTERPGO8236234234544</p>
                        <p className="text-sm text-gray-600 font-bold">Tax Number :</p>
                        <p className="text-sm text-gray-600 font-bold mt-4 block">
                            <h1>Status :</h1>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs">
                                Partialy Paid
                            </button>
                        </p>
                    </div>
                    {/* Shipped To */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Shipped To:</h3>
                        <p className="text-sm text-gray-600">Anthony B Renfroe</p>
                        <p className="text-sm text-gray-600">Roshita Apartment</p>
                        <p className="text-sm text-gray-600">Borivali</p>
                        <p className="text-sm text-gray-600">GUJARAT, 395006</p>
                        <p className="text-sm text-gray-600">India</p>
                        <p className="text-sm text-gray-600">04893258663</p>
                    </div>
                    <div className='flex justify-end'>
                        <img src={Qr} alt="Image not show" className='w-28 h-28' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillInformationList

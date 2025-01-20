
import React from 'react';

const CompanyCard = ({ company }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer">
      <div className="flex flex-col items-center">
        <img src={company.image} alt={company.name} className="rounded-full w-24 h-24 mb-2" />
        <h3 className="font-semibold text-lg">{company.name}</h3>
        <p className="text-gray-500">{company.email}</p>
        <p className="text-gray-400">{company.plan}</p>
        <p className="text-gray-400">Plan Expired: {company.expiryDate}</p>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-green-500 text-white py-2 px-4 rounded">Upgrade Plan</button>
        <button className="bg-green-500 text-white py-2 px-4 rounded">AdminHub</button>
      </div>
    </div>
  );
};

export default CompanyCard;
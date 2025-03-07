import React from "react";
import Allowance from "./Allowance/index";
import Commission from "./Commission";
import Loan from "./Loan";
import OtherPayment from "./OtherPayment";
import Overtime from "./Overtime";
import SaturationDeduction from "./SaturationDeduction";

const SetSalary = ({ id, onClose }) => (
  <div className="p-3 md:p-4 min-h-screen w-full">
    <div className="mt-[-10px] mb-2">
      {/* <h1 className="text-2xl font-semibold">Set Salary</h1> */}
    </div>
    {/* <hr className="mb-6 border-gray-300" /> */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ml-[-12px] mr-[-12px] mb-[-20px] sm:gap-3 md:gap-3">
      <div className=" rounded-lg lg:p-1">
        <Allowance id={id} onClose={onClose} />
      </div>

      {/* Commission Section */}
      <div className=" rounded-lg lg:p-1">
        <Commission id={id} onClose={onClose} />
      </div>

      {/* Loan Section */}
      <div className=" rounded-lg lg:p-1">
        <Loan id={id} onClose={onClose} />
      </div>

      {/* Other Payment Section */}
      <div className=" rounded-lg lg:p-1">
        <OtherPayment id={id} onClose={onClose} />
      </div>

      {/* Saturation Deduction Section */}
      <div className=" rounded-lg lg:p-1">
        <SaturationDeduction id={id} onClose={onClose} />
      </div>

      {/* Overtime Section */}
      <div className=" rounded-lg lg:p-1">
        <Overtime id={id} onClose={onClose} />
      </div>
    </div>
  </div>
);

export default SetSalary;



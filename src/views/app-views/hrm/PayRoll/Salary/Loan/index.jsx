import React from 'react';

import LoanList from './LoanList';

const Loan = ({ id, onClose }) => (

<div className="mail">

<LoanList id={id} onClose={onClose} />
 
</div>

);

export default Loan;
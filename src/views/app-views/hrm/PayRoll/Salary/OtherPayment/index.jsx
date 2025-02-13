import React from 'react';

import OtherPaymentList from './OtherPaymentList';
// import AddOtherPayment from './AddOtherPayment';

const OtherPayment = ({ id, onClose }) => (

<div className="mail">

<OtherPaymentList id={id} onClose={onClose} />
 
</div>

);

export default OtherPayment;
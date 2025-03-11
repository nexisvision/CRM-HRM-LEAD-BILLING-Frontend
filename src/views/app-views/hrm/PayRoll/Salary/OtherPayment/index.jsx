import React from 'react';

import OtherPaymentList from './OtherPaymentList';

const OtherPayment = ({ id, onClose }) => (

    <div className="mail">

        <OtherPaymentList id={id} onClose={onClose} />

    </div>

);

export default OtherPayment;
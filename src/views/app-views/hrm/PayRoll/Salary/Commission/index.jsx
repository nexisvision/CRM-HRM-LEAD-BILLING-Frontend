import React from 'react';
import CommissionList from './CommissionList';

const Commission = ({ id, onClose }) => (

<div className="mail">

<CommissionList id={id} onClose={onClose} />
</div>

);

export default Commission;
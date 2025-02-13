import React from 'react';

import OvertimeList from './OvertimeList';
// import AddOtherPayment from './AddOtherPayment';

const Overtime = ({ id, onClose }) => (

<div className="mail">

<OvertimeList id={id} onClose={onClose} />
 
</div>

);

export default Overtime;
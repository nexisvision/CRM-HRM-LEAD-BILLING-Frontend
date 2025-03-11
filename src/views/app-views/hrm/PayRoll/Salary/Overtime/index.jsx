import React from 'react';

import OvertimeList from './OvertimeList';

const Overtime = ({ id, onClose }) => (

    <div className="mail">

        <OvertimeList id={id} onClose={onClose} />

    </div>

);

export default Overtime;
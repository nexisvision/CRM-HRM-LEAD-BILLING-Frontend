import React from 'react';

import SaturationDeductionList from './SaturationDeductionList';

const SaturationDeduction = ({ id, onClose }) => (

    <div className="mail">

        <SaturationDeductionList id={id} onClose={onClose} />

    </div>

);

export default SaturationDeduction;
import React from 'react';
import AllowanceList from './AllowanceList';

const Allowance = ({ id, onClose }) => (

	<div className="mail">
		<AllowanceList id={id} onClose={onClose} />
	</div>

);

export default Allowance;
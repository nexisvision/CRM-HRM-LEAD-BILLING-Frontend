import React from 'react'
import { Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

const EllipsisDropdown = ({ menu, placement = 'bottomRight', trigger = ['click'] }) => {
	return (
		<Dropdown
			menu={menu}
			placement={placement}
			trigger={trigger}
		>
			<div className="ellipsis-dropdown">
				<EllipsisOutlined />
			</div>
		</Dropdown>
	)
}

EllipsisDropdown.propTypes = {
	trigger: PropTypes.string,
	placement: PropTypes.string
}

export default EllipsisDropdown

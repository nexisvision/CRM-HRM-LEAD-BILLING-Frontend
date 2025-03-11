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
			<EllipsisOutlined className="ellipsis-dropdown" />
		</Dropdown>
	)
}

EllipsisDropdown.propTypes = {
	menu: PropTypes.object.isRequired,
	placement: PropTypes.string,
	trigger: PropTypes.array
}

export default EllipsisDropdown

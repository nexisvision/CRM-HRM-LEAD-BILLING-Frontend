import React, { Component } from 'react'
import InnerAppLayout from 'layouts/inner-app-layout';
import MailMenu from './MailMenu';
import MailContent from './MailContent';

export class Mail extends Component {
	render() {
		return (
			<div className="mail">
				<InnerAppLayout
					sideContent={<MailMenu url="/app/dashboards/mail/" {...this.props} />}
					mainContent={<MailContent {...this.props} />}
					border
				/>
			</div>
		)
	}
}

export default Mail

import React from 'react'
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH, NAV_TYPE_TOP } from 'constants/ThemeConstant';
import { useSelector } from 'react-redux';
import utils from 'utils';
import { Grid } from 'antd';
import styled from '@emotion/styled';
import { TEMPLATE } from 'constants/ThemeConstant';

const LogoWrapper = styled.div(() => ({
	height: TEMPLATE.HEADER_HEIGHT,
	display: 'flex',
	alignItems: 'center',
	padding: '0 1rem',
	backgroundColor: 'transparent',
	transition: 'all .2s ease',
}));

const { useBreakpoint } = Grid;

export const Logo = ({ mobileLogo, logoType }) => {
	const alldata = useSelector((state) => state.generalsetting.generalsetting.data);
	const companyData = Array.isArray(alldata) ? alldata[0] : alldata;
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
	const navCollapsed = useSelector(state => state.theme.navCollapsed);
	const navType = useSelector(state => state.theme.navType);

	const getLogoWidthGutter = () => {
		const isNavTop = navType === NAV_TYPE_TOP ? true : false
		if (isMobile && !mobileLogo) {
			return 0
		}
		if (isNavTop) {
			return 'auto'
		}
		if (navCollapsed) {
			return `${SIDE_NAV_COLLAPSED_WIDTH}px`
		} else {
			return `${SIDE_NAV_WIDTH}px`
		}
	}

	return (
		<LogoWrapper className={isMobile && !mobileLogo ? 'd-none' : 'logo'} style={{ width: `${getLogoWidthGutter()}` }}>

			<h1 style={{ margin: 0, fontSize: '1.2rem' }}>
				{companyData?.companyName || 'CRM'}
			</h1>
		</LogoWrapper>
	)
}

export default Logo;

/** @jsxImportSource @emotion/react */
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TEMPLATE } from 'constants/ThemeConstant';
import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';
import Logo from '../Logo';
import NavNotification from '../NavNotification';
import NavProfile from '../NavProfile';
import NavSearch from '../NavSearch';
import SearchInput from '../NavSearch/SearchInput';
import Header from './Header';
import HeaderWrapper from './HeaderWrapper';
import Nav from './Nav'
import NavEdge from './NavEdge';
import NavItem from '../NavItem';
import { toggleCollapsedNav, onMobileNavToggle } from 'store/slices/themeSlice';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils'
import styled from '@emotion/styled';

const HeaderContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 75px;
	z-index: 1000;
	background: ${props => props.headerNavColor || '#ffffff'};
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	transition: all 0.3s ease;
	display: flex;
	align-items: center;

	@media screen and (max-width: 768px) {
		padding: 0 16px;
	}
`;

const NavContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
`;

const LeftSection = styled.div`
	display: flex;
	align-items: center;

	.menu-trigger {
		font-size: 1.25rem;
		cursor: pointer;
		padding: 8px;
		border-radius: 6px;
		transition: all 0.3s ease;

		&:hover {
			background-color: rgba(0, 0, 0, 0.04);
			color: ${props => props.theme.primaryColor || '#1890ff'};
		}
	}

	.search-section {
		min-width: 280px;
		@media screen and (max-width: 1024px) {
			min-width: 200px;
		}
		@media screen and (max-width: 768px) {
			display: none;
		}
	}
`;

const RightSection = styled.div`
	display: flex;
	align-items: center;

	.nav-item {
		height: 75px;
		display: flex;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: rgba(0, 0, 0, 0.02);
		}
	}

	.notification-trigger {
		position: relative;
	}

	.profile-section {
		margin-left: 8px;
	}
`;

export const HeaderNav = props => {
	const { isMobile } = props;
	const [searchActive, setSearchActive] = useState(false);
	const dispatch = useDispatch();

	const navCollapsed = useSelector(state => state.theme.navCollapsed);
	const mobileNav = useSelector(state => state.theme.mobileNav);
	const navType = useSelector(state => state.theme.navType);
	const headerNavColor = useSelector(state => state.theme.headerNavColor);
	const currentTheme = useSelector(state => state.theme.currentTheme);

	const onSearchActive = () => setSearchActive(true);
	const onSearchClose = () => setSearchActive(false);

	const onToggle = () => {
		if (!isMobile) {
			dispatch(toggleCollapsedNav(!navCollapsed));
		} else {
			dispatch(onMobileNavToggle(!mobileNav));
		}
	};

	const isNavTop = navType === NAV_TYPE_TOP;
	const isDarkTheme = currentTheme === 'dark';

	const navMode = useMemo(() => {
		if (!headerNavColor) {
			return utils.getColorContrast(isDarkTheme ? '#000000' : '#ffffff');
		}
		return utils.getColorContrast(headerNavColor);
	}, [isDarkTheme, headerNavColor]);

	const navBgColor = isDarkTheme ? TEMPLATE.HEADER_BG_DEFAULT_COLOR_DARK : TEMPLATE.HEADER_BG_DEFAULT_COLOR_LIGHT;

	useEffect(() => {
		if (!isMobile) onSearchClose();
	}, [isMobile]);

	const handleHeaderClick = (e) => {
		if (!e.target.closest('.nav-profile')) {
			// Close any open menus if needed
		}
	};

	return (
		<HeaderContainer headerNavColor={headerNavColor || navBgColor} onClick={handleHeaderClick}>
			<NavContainer>
				<LeftSection>
					<Logo logoType={navMode} />
					{!isNavTop && !isMobile && (
						<div className="menu-trigger" onClick={onToggle}>
							{navCollapsed ? (
								<MenuUnfoldOutlined />
							) : (
								<MenuFoldOutlined />
							)}
						</div>
					)}
					{isMobile ? (
						<div className="menu-trigger" onClick={onSearchActive}>
							<SearchOutlined />
						</div>
					) : (
						<div className="search-section">
							<SearchInput mode={navMode} isMobile={isMobile} />
						</div>
					)}
				</LeftSection>

				<RightSection>
					<div className="notification-trigger">
						<NavNotification mode={navMode} />
					</div>
					<div className="profile-section">
						<NavProfile mode={navMode} />
					</div>
				</RightSection>
			</NavContainer>

			<NavSearch
				active={searchActive}
				close={onSearchClose}
				headerNavColor={headerNavColor}
				currentTheme={currentTheme}
				mode={navMode}
				style={{
					position: 'absolute',
					top: '100%',
					left: 0,
					width: '100%',
					transform: searchActive ? 'translateY(0)' : 'translateY(-100%)',
					transition: 'transform 0.3s ease'
				}}
			/>
		</HeaderContainer>
	);
};

export default HeaderNav;
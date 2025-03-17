import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Grid } from 'antd';
import IntlMessage from '../util-components/IntlMessage';
import Icon from '../util-components/Icon';
import navigationConfig, { extraNavvvTree, dashBoardNavTree, extraNavvTree } from 'configs/NavigationConfig'; // Import extraNavvvTree
import { useSelector, useDispatch } from 'react-redux';
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from 'utils'
import { onMobileNavToggle } from 'store/slices/themeSlice';
import { THEME_CONFIG, DEFAULT_SELECTED_KEY, AUTHENTICATED_ENTRY } from 'configs/AppConfig';
// import 'index.css';

const { useBreakpoint } = Grid;

const setLocale = (localeKey, isLocaleOn = true) =>
	isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key) => {
	let keyList = [];
	let keyString = "";
	if (key) {
		const arr = key.split("-");
		for (let index = 0; index < arr.length; index++) {
			const elm = arr[index];
			index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
			keyList.push(keyString);
		}
	}
	return keyList;
};

const MenuItem = ({ title, icon, path }) => {

	const dispatch = useDispatch();

	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

	const closeMobileNav = () => {
		if (isMobile) {
			dispatch(onMobileNavToggle(false))
		}
	}

	return (
		<>
			{icon && <Icon type={icon} />}
			<span>{setLocale(title)}</span>
			{path && <Link onClick={closeMobileNav} to={path} />}
		</>
	)
}

const getSideNavMenuItem = (navItem) => navItem.map(nav => {
	return {
		key: nav.key,
		label: <MenuItem title={nav.title} {...(nav.isGroupTitle ? {} : { path: nav.path, icon: nav.icon })} />,
		...(nav.isGroupTitle ? { type: 'group' } : {}),
		...(nav.submenu.length > 0 ? { children: getSideNavMenuItem(nav.submenu) } : {})
	}
})

const getTopNavMenuItem = (navItem) => navItem.map(nav => {
	return {
		key: nav.key,
		label: <MenuItem title={nav.title} icon={nav.icon} {...(nav.isGroupTitle ? {} : { path: nav.path })} />,
		...(nav.submenu.length > 0 ? { children: getTopNavMenuItem(nav.submenu) } : {})
	}
})

const SideNavContent = (props) => {
	const { hideGroupTitle, sideNavTheme = SIDE_NAV_LIGHT } = props;
	const location = useLocation();
	const [selectedKeys, setSelectedKeys] = useState([]);
	
	const roleId = useSelector((state) => state.user.loggedInUser.role_id);
	const roles = useSelector((state) => state.role?.role?.data);
	const roleData = roles?.find(role => role.id === roleId);
	const isSuperAdmin = roleData?.role_name === 'client';
	const isSuper = roleData?.role_name === 'super-admin';

	// Set initial selected key when component mounts
	useEffect(() => {
		if (location.pathname === AUTHENTICATED_ENTRY) {
			// Set default key based on user role
			const defaultKey = isSuper ? 'superadmin-dashboard' : 'extra-pages-profile';
			setSelectedKeys([defaultKey]);
		} else {
			// Find the menu item that matches the current path
			const findKeyByPath = (items) => {
				for (const item of items) {
					if (item.path === location.pathname) {
						return item.key;
					}
					if (item.submenu?.length > 0) {
						const subKey = findKeyByPath(item.submenu);
						if (subKey) return subKey;
					}
				}
				return null;
			};

			const currentKey = findKeyByPath([...extraNavvvTree, ...dashBoardNavTree, ...extraNavvTree]);
			if (currentKey) {
				setSelectedKeys([currentKey]);
			}
		}
	}, [location.pathname, isSuper]);

	// Handle menu item clicks
	const handleMenuClick = ({ key }) => {
		setSelectedKeys([key]);
	};

	const menuItems = useMemo(() => {
		// Parse permissions if it's a string
		const parsedPermissions = typeof roleData?.permissions === 'string'
			? JSON.parse(roleData?.permissions)
			: roleData?.permissions;

		if (isSuper) {
			return getSideNavMenuItem(extraNavvvTree);
		}

		if (isSuperAdmin) {
			return getSideNavMenuItem([...dashBoardNavTree, ...extraNavvTree]);
		}

		if (!parsedPermissions) {
			console.warn('No permissions found for role ID:', roleId);
			return [];
		}

		const isNavItemAllowed = (navItem) => {
			if (navItem.isGroupTitle) {
				return true;
			}

			for (const section in parsedPermissions) {
				const sectionPerms = parsedPermissions[section];
				if (Array.isArray(sectionPerms)) {
					const matchingPerm = sectionPerms.find(p => p.key === navItem.key);
					if (matchingPerm && matchingPerm.permissions.includes('view')) {
						return true;
					}
				}
			}
			return false;
		};

		const filterNavItems = (items) => {
			return items.reduce((acc, item) => {
				if (item.submenu && item.submenu.length > 0) {
					const filteredSubmenu = filterNavItems(item.submenu);
					if (filteredSubmenu.length > 0 || isNavItemAllowed(item)) {
						acc.push({
							...item,
							submenu: filteredSubmenu
						});
					}
				} else if (isNavItemAllowed(item)) {
					acc.push(item);
				}
				return acc;
			}, []);
		};

		const filteredNavigation = filterNavItems(navigationConfig);

		// console.log('Final Filtered Navigation:', {
		// 	itemCount: filteredNavigation.length,
		// 	items: filteredNavigation.map(item => ({
		// 		key: item.key,
		// 		title: item.title,
		// 		submenuCount: item.submenu?.length || 0
		// 	}))
		// });

		const relevantNavigation = filteredNavigation.filter(navItem => {
			// Check if the navItem key starts with 'extra-hrm' or 'dashboards'
			return navItem.key.startsWith('extra-hrm') || navItem.key.startsWith('dashboards') ||
				navItem.submenu.some(sub => sub.key.startsWith('extra-hrm') || sub.key.startsWith('dashboards'));
		});

		// Create an array of titles for the relevant navigation items
		const relevantTitles = relevantNavigation.map(navItem => navItem.title);

		// Include titles from submenus that start with 'extra-hrm' and check permissions
		relevantNavigation.forEach(navItem => {
			if (navItem.submenu) {
				navItem.submenu.forEach(sub => {
					if (sub.key.startsWith('extra-hrm') || sub.key.startsWith('dashboards')) {
						const hasPermission = roleData?.permissions?.[sub.key]?.some(permission => permission.permissions.includes('view'));
						if (hasPermission) {
							relevantTitles.push(sub.title);
						}
					}
				});
			}
		});

		// console.log('Relevant HRM Titles:', relevantTitles);
		return getSideNavMenuItem(relevantNavigation);
	}, [isSuper, isSuperAdmin, roleId, roleData]);

	return (
		<Menu
			mode="inline"
			theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
			style={{ height: "100%", borderInlineEnd: 0 }}
			selectedKeys={selectedKeys}
			onClick={handleMenuClick}
			className={`${hideGroupTitle ? "hide-group-title" : ""} custom-menu`}
			items={menuItems}
		/>
	);
};

// Update these styles
const styles = `
	.custom-menu .ant-menu-item-selected {
		background-color: rgba(62, 130, 247, 0.1) !important;
	}

	// .custom-menu .ant-menu-item:hover {
	// 	background-color: transparent !important;
	// }

	.custom-menu .ant-menu-item-selected::after {
		border-right: 3px solid #3e82f7 !important;
	}
`;

// Add the styles to your component
const MenuContent = (props) => {
	useEffect(() => {
		const styleSheet = document.createElement("style");
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
		return () => styleSheet.remove();
	}, []);

	return props.type === NAV_TYPE_SIDE ? (
		<SideNavContent {...props} />
	) : (
		<TopNavContent {...props} />
	);
};

const TopNavContent = () => {

	const topNavColor = useSelector(state => state.theme.topNavColor);

	const menuItems = useMemo(() => getTopNavMenuItem(navigationConfig), [])

	return (
		<Menu
			mode="horizontal"
			style={{ backgroundColor: topNavColor }}
			items={menuItems}
		/>
	);
};

export default MenuContent;

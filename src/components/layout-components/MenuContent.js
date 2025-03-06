import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Grid } from 'antd';
import IntlMessage from '../util-components/IntlMessage';
import Icon from '../util-components/Icon';
import navigationConfig, { extraNavvvTree, dashBoardNavTree, extraNavvTree } from 'configs/NavigationConfig'; // Import extraNavvvTree
import { useSelector, useDispatch } from 'react-redux';
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from 'utils'
import { onMobileNavToggle } from 'store/slices/themeSlice';

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

const MenuItem = ({title, icon, path}) => {

	const dispatch = useDispatch();

	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

	const closeMobileNav = () => {
		if (isMobile) {
			dispatch(onMobileNavToggle(false))	 
		}
	}

	return (
		<>
			{icon && <Icon type={icon} /> }
			<span>{setLocale(title)}</span>
			{path && <Link onClick={closeMobileNav} to={path} />}
		</>
	)
}

const getSideNavMenuItem = (navItem) => navItem.map(nav => {
	return {
		key: nav.key,
		label: <MenuItem title={nav.title} {...(nav.isGroupTitle ? {} : {path: nav.path, icon: nav.icon})} />,
		...(nav.isGroupTitle ? {type: 'group'} : {}),
		...(nav.submenu.length > 0 ? {children: getSideNavMenuItem(nav.submenu)} : {})
	}
})

const getTopNavMenuItem = (navItem) => navItem.map(nav => {
	return {
		key: nav.key,
		label: <MenuItem title={nav.title} icon={nav.icon} {...(nav.isGroupTitle ? {} : {path: nav.path})} />,
		...(nav.submenu.length > 0 ? {children: getTopNavMenuItem(nav.submenu)} : {})
	}
})



const SideNavContent = (props) => {
	const { routeInfo, hideGroupTitle, sideNavTheme = SIDE_NAV_LIGHT } = props;
	const roleId = useSelector((state) => state.user.loggedInUser.role_id);
	const roles = useSelector((state) => state.role?.role?.data);
	const roleData = roles?.find(role => role.id === roleId);
	const isSuperAdmin = roleData?.role_name === 'client';
 
	const isSuper = roleData?.role_name === 'super-admin';
	// Filter navigation items based on permissions
	const menuItems = useMemo(() => {
		// Parse permissions if it's a string
		const parsedPermissions = typeof roleData?.permissions === 'string' 
			? JSON.parse(roleData?.permissions) 
			: roleData?.permissions;

		

		if (isSuper) {
			return getSideNavMenuItem(extraNavvvTree);
		}

		if (isSuperAdmin) {
			// Show both dashboard and extra navigation items for super admin
			return getSideNavMenuItem([...dashBoardNavTree, ...extraNavvTree]);
		}


		if (!parsedPermissions) {
			console.warn('No permissions found for role ID:', roleId);
			return [];
		}

		// Function to check if a nav item is allowed based on permissions
		const isNavItemAllowed = (navItem) => {
			// For group titles (like 'HRM'), always allow
			if (navItem.isGroupTitle) {
				// console.log('Allowing group title:', navItem.key);
				return true;
			}

			// Check permissions in each section
			for (const section in parsedPermissions) {
				const sectionPerms = parsedPermissions[section];
				if (Array.isArray(sectionPerms)) {
					const matchingPerm = sectionPerms.find(p => p.key === navItem.key);
					if (matchingPerm && matchingPerm.permissions.includes('view')) {
						// console.log('Permission granted for:', navItem.key);
						return true;
					}
				}
			}
			// console.log('Permission denied for:', navItem.key);
			return false;
		};

		// Recursively filter navigation items
		const filterNavItems = (items) => {
			return items.reduce((acc, item) => {
				// Always include parent items that have allowed children
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
						// Check if the user has permission for this submenu item
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
			defaultSelectedKeys={[routeInfo?.key]}
			defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
			className={hideGroupTitle ? "hide-group-title" : ""}
			items={menuItems}
		/>
	);
};



// const SideNavContent = (props) => {

// 	const { routeInfo, hideGroupTitle, sideNavTheme = SIDE_NAV_LIGHT } = props;

// 	const menuItems = useMemo(() => getSideNavMenuItem(navigationConfig), []);

// 	return (
// 		<Menu
// 			mode="inline"
// 			theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
// 			style={{ height: "100%", borderInlineEnd: 0 }}
// 			defaultSelectedKeys={[routeInfo?.key]}
// 			defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
// 			className={hideGroupTitle ? "hide-group-title" : ""}
// 			items={menuItems}
// 		/>
// 	);
// };

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

const MenuContent = (props) => {
	return props.type === NAV_TYPE_SIDE ? (
		<SideNavContent {...props} />
	) : (
		<TopNavContent {...props} />
	);
};

export default MenuContent;

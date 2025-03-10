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
	const menuItems = useMemo(() => {
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
		
		const relevantNavigation = filteredNavigation.filter(navItem => {
			return navItem.key.startsWith('extra-hrm') || navItem.key.startsWith('dashboards') || 
				navItem.submenu.some(sub => sub.key.startsWith('extra-hrm') || sub.key.startsWith('dashboards'));
		});
	
		const relevantTitles = relevantNavigation.map(navItem => navItem.title);
	
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

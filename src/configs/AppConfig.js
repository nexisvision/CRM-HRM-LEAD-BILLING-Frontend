import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from 'constants/ThemeConstant';
import { env } from './EnvironmentConfig'
import { jwtDecode } from 'jwt-decode';  // Updated import

export const APP_NAME = 'Nexis Vision';
export const API_BASE_URL = env.API_ENDPOINT_URL
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const REDIRECT_URL_KEY = 'redirect'

const getUserRole = () => {
	try {
		const token = localStorage.getItem('auth_token');
		if (token) {
			const decodedToken = jwtDecode(token);
			return decodedToken?.roleName || '';
		}
		return '';
	} catch (error) {
		console.error('Error decoding token:', error);
		return '';
	}
};

// Define the default selected key based on role
export const getDefaultSelectedKey = () => {
	const role = getUserRole();
	return role === 'super-admin' ? 'superadmin-dashboard' : 'extra-pages-profile';
};

// Define the default path based on role
export const AUTHENTICATED_ENTRY = getUserRole() === 'super-admin'
	? `${APP_PREFIX_PATH}/superadmin/dashboard`
	: `${APP_PREFIX_PATH}/pages/profile`;

export const DEFAULT_SELECTED_KEY = getDefaultSelectedKey();

export const UNAUTHENTICATED_ENTRY = '/login'

export const THEME_CONFIG = {
	navCollapsed: false,
	sideNavTheme: SIDE_NAV_LIGHT,
	locale: 'en',
	navType: NAV_TYPE_SIDE,
	topNavColor: '#3e82f7',
	headerNavColor: '',
	mobileNav: false,
	currentTheme: 'light',
	direction: DIR_LTR,
	blankLayout: false
};

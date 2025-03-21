import React, { lazy, Suspense, memo, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import Loading from 'components/shared-components/Loading';
import { lightTheme, darkTheme } from 'configs/ThemeConfig';
import { resources } from 'lang';
import useBodyClass from 'utils/hooks/useBodyClass';
import Routes from 'routes'
import { getRoles } from 'views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice';
import { useDispatch } from 'react-redux';
import { getgeneralsettings } from 'views/app-views/setting/general/generalReducer/generalSlice';

const AppLayout = lazy(() => import('./AppLayout'));
const AuthLayout = lazy(() => import('./AuthLayout'));

const Layouts = () => {
	const dispatch = useDispatch();


	useEffect(() => {
		dispatch(getRoles());
		dispatch(getgeneralsettings());
	}, [dispatch]);


	const token = useSelector(state => state.auth.token);
	const blankLayout = useSelector(state => state.theme.blankLayout);

	const Layout = token && !blankLayout ? AppLayout : AuthLayout;

	const locale = useSelector(state => state.theme.locale);

	const direction = useSelector(state => state.theme.direction);

	const currentTheme = useSelector(state => state.theme.currentTheme);

	const currentAppLocale = resources[locale];

	useBodyClass(`dir-${direction}`);

	const themeConfig = currentTheme === 'light' ? { ...lightTheme } : { ...darkTheme }

	return (
		<ConfigProvider theme={themeConfig} direction={direction} locale={currentAppLocale.antd}>
			<Suspense fallback={<Loading cover="content" />}>
				<Layout>
					<Routes />
				</Layout>
			</Suspense>
		</ConfigProvider>
	)
}

export default memo(Layouts)
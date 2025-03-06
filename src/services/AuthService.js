import fetch from 'auth/FetchInterceptor'
import { env } from '../configs/EnvironmentConfig'

const AuthService = {}

AuthService.login = function (data) {
	return fetch({
		url: `${env.API_ENDPOINT_URL}/auth/login`,
		method: 'post',
		data: data
	})
}

AuthService.register = function (data) {
	return fetch({
		url: `${env.API_ENDPOINT_URL}/auth/register`,
		method: 'post',
		data: data
	})
}

export default AuthService;
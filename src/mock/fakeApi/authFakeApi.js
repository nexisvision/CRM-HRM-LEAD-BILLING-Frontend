import { Response } from 'miragejs'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'
import { env } from 'configs/EnvironmentConfig'

export default function authFakeApi(server, apiPrefix) {

    server.post(`${env.API_ENDPOINT_URL}/auth/login`, (schema, { requestBody }) => {
        const { email, password } = JSON.parse(requestBody)
        const user = schema.db.signInUserData.findBy({ email, password })
        if (user) {
            return {
                data: {
                    token: 'wVYrxaeNa9OxdnULvde1Au5m5w63'
                }
            }
        }
        return new Response(401, { some: 'header' }, { message: `email: user1@themenate.net | password: 2005ipo` })
    })

    server.post(`${env.API_ENDPOINT_URL}/auth/loginInOAuth`, (schema) => {
        return {
            data: {
                token: 'wVYrxaeNa9OxdnULvde1Au5m5w63'
            }
        }
    })

    server.post(`${env.API_ENDPOINT_URL}/logout`, () => {
        return true
    })

    server.post(`${env.API_ENDPOINT_URL}/register`, (schema, { requestBody }) => {
        const { userName, password, email } = JSON.parse(requestBody)
        const emailUsed = schema.db.signInUserData.findBy({ email })
        const newUser = {
            userName,
            email,
        }

        if (!isEmpty(emailUsed)) {
            const errors = [
                { message: '', domain: "global", reason: "invalid" }
            ]
            return new Response(400, { some: 'header' }, { errors, message: 'User already used' })
        }

        schema.db.signInUserData.insert({ ...newUser, ...{ id: uniqueId('user_'), password, accountUserName: userName } })
        return {
            data: {
                token: 'wVYrxaeNa9OxdnULvde1Au5m5w63'
            }
        }
    })
}
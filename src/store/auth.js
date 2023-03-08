import {HttpStatusCode} from "axios"
import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils"
import {TOKEN_DATA, USER_DATA} from "../config/constants";
import AxiosClient from "./axios";
import AxiosClientNoAuth from "./axios-no-auth";
import {tasks} from "./task";

const LOGIN_URL = `/v1/auth/login`
const REGISTER_URL = `/v1/auth/register`
const REFRESH_TOKEN_URL = `/v1/auth/refresh-tokens`
const RESET_PASSWORD_URL = `/v1/auth/reset-password`
const FORGOT_PASSWORD_URL = `/v1/auth/forgot-password`
const SEND_VERIFY_EMAIL_URL = `/v1/auth/send-verification-email`
const VERIFY_EMAIL_URL = `/v1/auth/verify-email`

export const tokens = atomWithStorage(TOKEN_DATA, null)
export const user = atomWithStorage(USER_DATA, localStorage.getItem(USER_DATA))
export const isLoggedIn = atom(!!user.read)
export const sendResetPassword = atom(false)
export const sendForgotPassword = atom(false)
export const sendVerifyEmail = atom(false)
export const verifyEmail = atom(false)

export const login =
    atom((get) => get(isLoggedIn),
        async (_get, set, {email, password}) => {
            const response = await AxiosClientNoAuth().post(LOGIN_URL, {email, password})
            if (response.status === HttpStatusCode.Ok) {
                set(isLoggedIn, !!response.data.user)
                set(user, response.data.user)
                set(tokens, response.data.tokens)
            }

            return response
        }
    )

export const refreshTokenFn =
    atom((get) => get(tokens),
        async (_get, set, {refreshToken}) => {
            const response = await AxiosClientNoAuth().post(REFRESH_TOKEN_URL, {refreshToken})
            if (response.status === HttpStatusCode.Ok) {
                set(isLoggedIn, true)
                set(tokens, response.data)
                return response
            }

            clearData(set)
            return response
        }
    )

export const logout =
    atom((get) => get(isLoggedIn),
        async (_get, set, {refreshToken}) => {
            const response = await AxiosClientNoAuth().post(REFRESH_TOKEN_URL, {refreshToken})
            clearData(set)

            return response
        }
    )

export const register =
    atom((get) => get(isLoggedIn),
        async (_get, set, {firstName, lastName, email, password, jobRole, workLevel, companyIndustry, companySize}) => {
            const response = await AxiosClientNoAuth().post(REGISTER_URL, {
                firstName,
                lastName,
                email,
                password,
                jobRole,
                workLevel,
                companyIndustry,
                companySize
            })

            if (response.status === HttpStatusCode.Created) {
                set(isLoggedIn, !!response.data.user)
                set(user, response.data.user)
                set(tokens, response.data.tokens)
            }

            return response
        }
    )

export const resetPassword =
    atom((get) => get(sendResetPassword),
        async (_get, set, {token, password}) => {
            const response = await AxiosClientNoAuth().post(`${RESET_PASSWORD_URL}?token=${token}`, {password})

            if (response.status === HttpStatusCode.NoContent) {
                set(sendResetPassword, true)
            }

            return response
        }
    )

export const forgotPassword =
    atom((get) => get(sendForgotPassword),
        async (_get, set, {email}) => {
            const response = await AxiosClientNoAuth().post(FORGOT_PASSWORD_URL, {email})

            if (response.status === HttpStatusCode.NoContent) {
                set(sendForgotPassword, true)
            }

            return response
        }
    )

export const sendVerifyEmailRequest =
    atom((get) => get(sendVerifyEmail),
        async (_get, set, {email}) => {
            const response = await (await AxiosClient(true)).post(SEND_VERIFY_EMAIL_URL)

            if (response.status === HttpStatusCode.NoContent) {
                set(sendVerifyEmail, true)
            }

            return response
        }
    )

export const verifyEmailRequest =
    atom((get) => get(verifyEmail),
        async (_get, set, {token}) => {
            const response = await AxiosClientNoAuth().post(`${VERIFY_EMAIL_URL}?token=${token}`)

            if (response.status === HttpStatusCode.NoContent) {
                set(verifyEmail, true)
            }

            return response
        }
    )

export const clearData = (set) => {
    set(isLoggedIn, false)
    set(tokens, null)
    set(user, null)
    set(tasks, {results: [] })
}

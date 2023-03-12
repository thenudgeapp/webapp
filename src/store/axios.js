import axios from 'axios';
import {TOKEN_DATA} from "../config/constants";
import AxiosClientNoAuth from "./axios-no-auth";

const AxiosClient = async (protectedRequest = false) => {
    // Create instance
    const instance = await AxiosClientNoAuth();

    const refreshToken = (refreshToken) => {
        return instance.post("/v1/auth/refresh-tokens", {
            refreshToken,
        });
    }

    if (protectedRequest) {
        // Set the AUTH token for any request
        instance.interceptors.request.use(function (config) {
            if (config.url.indexOf('refresh-tokens') === -1) {
                const tokens = localStorage.getItem(TOKEN_DATA);
                if (tokens) {
                    const tokensJson = JSON.parse(tokens)
                    config.headers.Authorization =  tokensJson ? `Bearer ${tokensJson.access.token}` : '';
                }
            }
            return config;
        });

        instance.interceptors.response.use(
            (res) => {
                return res;
            },
            async (err) => {
                const originalConfig = err.config;

                if (err.response) {
                    // Access Token was expired
                    if (err.response.status === 401 && !originalConfig._retry) {
                        originalConfig._retry = true;
                        const tokens = localStorage.getItem(TOKEN_DATA);
                        if (tokens) {
                            const tokensJson = JSON.parse(tokens)

                            try {
                                const timeLeft = new Date(tokensJson.refresh.expires) - new Date()

                                if (timeLeft > 30000) {
                                    const rs = await refreshToken(tokensJson.refresh.token);
                                    const tokens = rs.data;
                                    localStorage.setItem(TOKEN_DATA, JSON.stringify(tokens));
                                    instance.defaults.headers.common["Authorization"] = `Bearer ${tokens.access.token}`;

                                    return instance(originalConfig);
                                }

                                return Promise.reject(err.response.data);
                            } catch (_error) {
                                console.log(_error)
                                if (_error.response && _error.response.data) {
                                    return Promise.reject(_error.response.data);
                                }

                                return Promise.reject(_error);
                            }
                        }

                        return Promise.reject(err.response.data)
                    }

                    if (err.response.status === 403 && err.response.data) {
                        return Promise.reject(err.response.data);
                    }
                }

                return Promise.reject(err);
            }
        );

    }

    return instance;
};

export default AxiosClient

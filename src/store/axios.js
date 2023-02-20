import axios from 'axios';
import {TOKEN_DATA} from "../config/constants";
import AxiosClientNoAuth from "./axios-no-auth";

const AxiosClient = async (protectedRequest = false) => {
    // Create instance
    const instance = await AxiosClientNoAuth();

    if (protectedRequest) {
        // Set the AUTH token for any request
        instance.interceptors.request.use(function (config) {
            const tokens = localStorage.getItem(TOKEN_DATA);
            if (tokens) {
                const tokensJson = JSON.parse(tokens)
                config.headers.Authorization =  token ? `Bearer ${tokensJson.access.token}` : '';
            }
            return config;
        });
    }

    return instance;
};

export default AxiosClient

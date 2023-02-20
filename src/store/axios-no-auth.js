import axios from 'axios';

const AxiosClientNoAuth = (protectedRequest = false) => {
    const defaultOptions = {
        baseURL: process.env.REACT_APP_API_BASE_URL,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.create(defaultOptions);
};

export default AxiosClientNoAuth

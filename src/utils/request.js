import axios from "axios"
import { Message } from "element-ui"

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    baseURL: process.env.VUE_APP_BASE_API || "",
    timeout: 10 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const request = axios.create(config);

request.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
request.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response.data
    },
    function(error) {
        // Do something with response error
        console.log(error) // for debug
        // 如果无响应，则提示连接超时
        if (!error.response) {
            Message({
                message: '连接超时，请检查你的网络！',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(error)
        }
        const res = error.response.data

        if (error.response.status === 500) {
            console.log('something error')
        }
        // 其他错误统一弹服务端返回的错误提示
        Message({
            message: res.message || '出错啦！',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
);

export default request;

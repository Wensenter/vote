import axios from 'axios';
import store from "../store";
let count = 0;
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'apis' : '../';  //http://voterapp.wesaltmall.com
//添加请求拦截器
axios.interceptors.request.use(function (config) {
    count ++;
    if (count > 4){
        store.commit('UPDATE_SHOW_HTTP_LOADING', true);
    }
    return config;
}, function (error) {
    store.commit('UPDATE_SHOW_HTTP_LOADING', false);
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    store.commit('UPDATE_SHOW_HTTP_LOADING', false);
    // if (response.data.ResultCode !== 1000) {
    //     alert(response.data.Message);
    // }
    return response;

}, function (error) {
    // 对响应错误做点什么
    store.commit('UPDATE_SHOW_HTTP_LOADING', false);
    return Promise.reject(error);
});
/**
 * Promise请求
 */
function Request(url, data = {}, method = 'post') {
    if (method === 'get') {
        return new Promise((resolve, reject) => {
            axios({
                url: url + '?' + data,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(res => {
                    reject(res)
                })
        })
    } else if (method === 'post') {
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(res => {
                    reject(res)
                })
        })
    }
}

export default {
    Request
}
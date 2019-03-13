//import qs from 'qs'
import {Indicator} from 'mint-ui';

export default function (_axios) {
  _axios.defaults.timeout = 5000;//超时时间5秒
  //_axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

  // POST传参序列化(添加请求拦截器)
  _axios.interceptors.request.use((config) => {
    // //在发送请求之前做某件事
    Indicator.open();
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  // 返回状态判断(添加响应拦截器)
  _axios.interceptors.response.use((res) => {
    // 对响应数据做些事
    Indicator.close();
    return res.status === 200 ? res : Promise.reject(res);
  }, (error) => {
    Indicator.close();
    return Promise.reject(error);
  });
}

/* eslint-disable no-param-reassign */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { history } from 'umi';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
export default request;

request.interceptors.request.use((url, options = {}) => {
  if (history.location.pathname !== '/user/login') {
    const {
      location: { pathname, search },
    } = history;
    let jumps = { path: `${pathname}${search}`, name: Cookies.get('username') };
    sessionStorage.setItem('Jump', JSON.stringify(jumps));
  }

  // if (url.indexOf('/api') !== 0) {
  //   url = `/api${url}`;
  // }

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      Authorization: localStorage.getItem('token'),
      ...options.headers,
    },
  };
  if (
    newOptions.method === 'post' ||
    newOptions.method === 'put' ||
    newOptions.method === 'delete'
  ) {
    if (newOptions.body instanceof FormData) {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }


  return {
    url,
    // url: `http://127.0.0.1:3001${url}`,
    options: newOptions,
  };
});

/**
 * 返回自动重定向
 */
request.interceptors.response.use(async (response) => {
  // 判断异步请求登录态是否已失效 302 ，自动重定向到 ioa 登录页面
  const location = response.headers.get('Location');
  if (location) {
    history.push(location);
    return;
  }
  return response;
});

/**
 * 返回通用错误码校验
 */
request.interceptors.response.use(async (response) => {
  try {
    // compatible
    localStorage.setItem('date', response.headers.get('date'));

    const data = await response.clone().json();
    // compatible: return response.
    data.response = response;

    if (data && data.returnCode === -999999) {
      history.push('/user/modifyPwd');
      return data;
    }
    if (data && data.returnCode === -9999999) {
      Cookies.remove('SESSION_ID');
      window.localStorage.setItem('token', '')
      // Cookies.remove('DEV_SESSION_ID');
      history.push('/login');
      return data;
    }
    return data;
  } catch (e) {
    return response;
  }
});

/**
 * 解决方案请求包裹函数
 * @param {string} app 解决方案命名空间
 * @return {function} request 返回解决方案请求工具函数
 */
const getAppRequest =
  (app) =>
  /**
   * 解决方案请求工具函数
   * @param {string} url 请求地址
   * @param {Object} options 请求参数
   * @return Promise 返回请求Promise
   */
  (url, options) => {
    console.log(url);
    if (url.indexOf(`/api/${app}`) !== 0) {
      if (url[0] !== '/') {
        url = `/${url}`;
      }
      url = `/api/${app}${url}`;
    }


    // return request(url, options);
    return request(`http://localhost:4000${url}`, options);
  };

/**
 * 加密方法
 * @param data
 * @returns {string}
 */
function encryptFun(data) {
  if (typeof data === 'object') {
    try {
      // eslint-disable-next-line no-param-reassign
      data = JSON.stringify(data);
    } catch (error) {
      console.log('encrypt error:', error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(
    dataHex,
    CryptoJS.enc.Utf8.parse('B31F2A75FBF94099'),
    {
      iv: CryptoJS.enc.Utf8.parse('1234567890123456'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encrypted.ciphertext.toString();
}

function decrypt(data) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(
    str,
    CryptoJS.enc.Utf8.parse('B31F2A75FBF94099'),
    {
      iv: CryptoJS.enc.Utf8.parse('1234567890123456'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export { getAppRequest, decrypt, encryptFun };

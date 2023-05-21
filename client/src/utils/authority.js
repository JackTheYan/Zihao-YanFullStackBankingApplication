import Cookies from 'js-cookie';
// import { reloadAuthorized } from './Authorized';

let authorityCache = [];
let authorityMap = {};

/**
 * 白名单权限列表
 */
const whiteAuthMap = {};

export function getAuthority(str) {
  return authorityCache;
}

export function setAuthority(rawAuthority) {
  const fullAuthority = { ...rawAuthority, ...whiteAuthMap };

  authorityCache = Object.keys(fullAuthority);
  authorityMap = fullAuthority;
  // reloadAuthorized();
}

/**
 * 获取当前用户对当前页面的权限
 *
 * @todo 可以通过 layout 上下文中判断设置初始化权限，页面通过读取上下文获取权限即可，无需判断调用该工具函数
 *
 * @param {string} authority router.path
 * @return null:无权限；r:只读； rw:读写
 */
export function checkAuth(authority) {
  if (!authority) {
    return null;
  }
  return authorityMap[authority] || null;
}

/**
 * 兼容用户权限查询接口
 * @param {string} authority
 */
export function getAuth(authority) {
  return checkAuth(authority);
}

/**
 * 登录
 */
export function login(authority) {
  const baseOpts = { exports: 2, path: '/' };
  const keys = Object.keys(authority);
  if (keys.length) {
    keys.forEach((key) => {
      Cookies.set(key, authority[key], baseOpts);
    });
  }
}

/**
 * 退出登录
 */
export function logout() {
  // 不需要清理的cookie的key可加到excepts中过滤
  const excepts = [];
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((key) => {
    if (excepts.indexOf(key) < 0) {
      Cookies.remove(key);
    }
  });
  window.localStorage.removeItem('token');
}

/**
 * 保存token
 */
export function saveToken({ token, data}) {
  if(token) {
    window.localStorage.setItem('token', token);
  Object.keys(data).forEach((key) => {
    Cookies.set(key, data[key]);
  });
  }
  
}

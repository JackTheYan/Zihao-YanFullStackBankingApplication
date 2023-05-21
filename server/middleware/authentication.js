'use strict'

const operations = require('../operations/users')


const errors = require('../utils/errors')
const { validToken } = require('../utils/password');

const loginFreeRouter = ['/user/login', '/user/signUp', '/user/github', '/graphql'];





const isLoginFreeRouter = (currentPath) =>
  loginFreeRouter.some((path) => {
    return path === currentPath;
  });

  async function tokenAuth(ctx, next) {

    
    const { header, method, path } = ctx.request;

  
    // 免登陆验证
    if (isLoginFreeRouter(path)) {
      return await next();
      
    }

    if(method === 'GET') {
      return await next();
    }
    const token = header.authorization;
  if (!token || typeof token !== 'string') {
    ctx.body = { returnCode: -3, returnMessage: 'has no token' };
    return;
  }


  if (!validToken(token).data) {
    ctx.body = {
      returnCode: -9999999,
      returnMessage: '登录已过期，请尝试重新登录',
    };
    return;
  }

  return await next();

  }





module.exports = {
 
  tokenAuth
}

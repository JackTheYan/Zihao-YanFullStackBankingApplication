import { history } from 'umi';
import { message } from 'antd';

import { saveToken, logout } from '@/utils/authority';
import { getAppRequest } from '@/utils/request';
import { commonRequest } from '@/services/api';



const userRequest = getAppRequest('user');
export const namespace = `global_login`;

export function getGlobalLoginEffects(effect) {
  return `${namespace}/${effect}`;
}

export default {
  namespace,
  state: {
    loginStatus: {},
    modifyPwdMsg: '',
    validPicInfo: {},
    messageInfo: {},
    encode: {},
  },
  effects: {
    *createNoLogin({ payload }, { call, put }) {
      const resp = yield call(commonRequest, '/user/signUp',{ ...payload });
      return resp;
    },
    *create({ payload }, { call, put }) {
      const resp = yield call(commonRequest, '/user/signUp',{ ...payload });

      if (resp && resp.returnCode === 0) {
        const { token } = resp.data;
        const { username, email, role } = payload;
        // yield put({ type: 'global/userInfo' , payload});
        saveToken({
          token,
          data: {
            username,
            email,
            role,
          },
        });
        message.success('创建用户成功,已为您自动登录');
        history.push(role === 1 ? '/all' : '/balance');
      }
    },
    *login({ payload }, { call, put }) {
    //   const params = {
    //     query: `mutation { 
    //              login(input: {
    //                  email: "${payload.email}",
    //                  name: "${payload.name}",
    //                  password: "${payload.password}"
    //                }) {
    //                  returnCode,
    //                  returnMessage,
    //                  data {
    //                     email,
    //                     name,
    //                     role
    //                  }
    //                }
    //          }`,
    //   };
      const resp = yield call(commonRequest, '/user/login',  {
        ...payload,
      });

      if (resp.returnCode === 0 && resp.data.token) {
        const { username, email, role } = resp.data;
        saveToken({
          token: resp.data.token,
          data: {
            username,
            email,
            role,
          },
        });
        message.success('登录成功');
        history.push(role === 1 ? '/all' :'/balance');
      }
    },
    // github登录
    *githubLogin({ payload }, { call, put }) {
      const resp = yield call(commonRequest, '/user/github', {
        ...payload,
      });

      if (resp && resp.returnCode === 0) {
        const { username, email, role } = resp.data;
        saveToken({
          token: resp.data.token,
          data: {
            username,
            email,
            role,
          },
        });
        message.success('登录成功');
        history.push(role === 1 ? '/all' :'/balance');
      }

    },
    *logout(_, { put, call }) {
      yield call(userRequest, { cmd: 'logout' });
      logout();
      yield put({ type: 'global/resetAuthMap' });
      
    },
    *deleteUser({payload}, { put, call }) {
      const resp = yield call(commonRequest, '/user/delete', {
        ...payload,
      });
      return resp;
    },
    *queryUser({payload}, { put, call }) {
      const resp = yield call(commonRequest, '/user/queryUser', {
        ...payload,
      });
      return resp;
    }
  },

  reducers: {},
};

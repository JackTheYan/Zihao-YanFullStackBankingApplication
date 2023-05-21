import { history } from 'umi';
import { message } from 'antd';
import { commonRequest, graphqlRequest } from '@/services/api';
import { saveToken } from '@/utils/authority';

export const namespace = `BadBank_login`;

export function getAppUserLoginEffects(effect) {
  return `${namespace}/${effect}`;
}

const initState = {
  loginStatus: {},
  validPicInfo: {},
  messageInfo: {},
  encode: {},
};

const AppUserLoginModel = {
  namespace,
  state: {
    ...initState,
  },
  effects: {
    *setStateByKey({ payload }, { put }) {
      yield put({
        type: 'MERGE_STATE_BY_KEY',
        payload: {
          ...payload,
        },
      });
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
        history.push(role === 1 ? '/all' : '/user');
      }
    },
  },
  reducers: {
    MERGE_STATE_BY_KEY(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
  },
};

export default AppUserLoginModel;

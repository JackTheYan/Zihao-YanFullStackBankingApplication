import { history, Effect, Reducer } from 'umi';
import { getAppRequest } from '@/utils/request';
import { setAuthority } from '@/utils/authority';


const apiRequest = getAppRequest('global');



const initState = {
  authMap: {},
  fieldCategoryArr: [],
  userInfo: {}
};

const GlobalModel = {
  namespace: 'global',
  state: {
    ...initState,
  },
  effects: {
    *setStateByKey({ payload }, { put }) {
      yield put({
        type: 'MERGE_STATE_BY_KEY',
        payload,
      });
    },
    *userInfo({ payload }, { put }) {
      const { email, username, role } = payload;
      yield put({
        type: 'MERGE_STATE_BY_KEY',
        payload: {
          key: 'userInfo',
          value: {
            email, username, role
          }
        },
      });
    },
    *fetchAuthMap(_, { put, call }) {
      try {
        const resp = yield call(apiRequest, 'authRouter/getAuth');
        if (!resp.data) {
          return history.push('/user/login');
        }
        // 权限路由
        setAuthority(resp.data);
        yield put({
          type: 'MERGE_STATE_BY_KEY',
          payload: {
            key: 'authMap',
            value: {
              ...resp.data,
            },
          },
        });
      } catch (error) {
        return error;
      }
    },
    *fetchAlarmMessages({ payload }, { call }) {
      try {
        const response = yield call(apiRequest, 'alarmMsg/getAlarmMessage', payload, true);
        if (response && response.data && response.data.msgContent) {
          return response.data.msgContent;
        }
      } catch (error) {
        return error;
      }
    },
    *updateAlarmStatus({ payload }, { call }) {
      try {
        const response = yield call(apiRequest, 'alarmMsg/updateAlarmStatus', payload, true);
        return response;
      } catch (error) {
        return false;
      }
    },
    *resetAuthMap(_, { put }) {
      yield put({
        type: 'MERGE_STATE_BY_KEY',
        payload: {
          key: 'authMap',
          value: {},
        },
      });
    },
    *fetchFieldsCategory(_, { call, put }) {
      const response = yield call(apiRequest, 'search/fetchFieldsCategory');
      if (!response) return;
      yield put({
        type: 'MERGE_STATE_BY_KEY',
        payload: { key: 'fieldCategoryArr', value: response.data },
      });
    },
    *fetchAssetStatus({ payload }, { call }) {
      try {
        const response = yield call(apiRequest, 'asset/getAssetStatus', payload, true);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
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

export default GlobalModel;

import { commonRequest } from '@/services/api';

export const namespace = `Global_balance`;

export function getAppBalanceEffects(effect) {
  return `${namespace}/${effect}`;
}

const initState = {
  username: '',
  email: '',
  saveAccount: 0,
  balance: 0,
  curAccount: 0,
};

const AppUserLoginModel = {
  namespace,
  state: {
    ...initState
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
    *setRecord({ payload }, { call, put }) {
        const resp = yield call(commonRequest, '/record/set', {
            ...payload,
          });
        return resp;
    },
    *getRecord({ payload }, { call, put }) {
      const resp = yield call(commonRequest, '/record/query', {
        ...payload,
      });
      if (resp && resp.data) {
        yield put({ type: 'MERGE_STATE', payload: resp.data });
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
    MERGE_STATE(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default AppUserLoginModel;

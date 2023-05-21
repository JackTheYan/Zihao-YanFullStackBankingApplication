import { commonRequest } from '@/services/api';

export const namespace = `BadBank_transfer`;

export function getAppTransferEffects(effect) {
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
    *transfer({ payload }, { call, put }) {
        const resp = yield call(commonRequest, '/record/transfer', {
            ...payload,
          });
        return resp;
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

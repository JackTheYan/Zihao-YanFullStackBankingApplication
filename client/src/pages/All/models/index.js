import { commonRequest } from '@/services/api';

export const namespace = `BadBank_user`;

export function getAppAllEffects(effect) {
  return `${namespace}/${effect}`;
}

const initState = {
  data: []
};

const AppUserModel = {
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
    *getAll({ payload }, { call, put }) {
      const resp = yield call(commonRequest, '/user/getAllUserWithBalance',{ ...payload });

     
      if (resp && resp.returnCode === 0) {
        yield put({
            type: 'MERGE_STATE_BY_KEY',
            payload: {
                key: 'data',
                value: resp.data
            },
          });
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
        console.log(111)
        return {
          ...state,
          ...payload,
        };
      },
  },

};

export default AppUserModel;

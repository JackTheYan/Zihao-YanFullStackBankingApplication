import { Alert, Button, Form, Input, Tabs, Radio, Row, DatePicker } from 'antd';
import moment from 'moment';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {  connect } from 'dva';

import { getAppUserLoginEffects } from './models/login';
import Login from '@/components/Login';
import { github } from '@/config/login';
import { encryptFun } from '@/utils/request';

import styles from './style.less';

type IActiveKey = 'login' | 'create';

const LoginForm = ({ form, loginModel, dispatch }: any) => {
  const [activeKey, setActiveKey] = useState<IActiveKey>('login');

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token && Cookies.get('username')) {
      const role = Cookies.get('role')
      history.push( role === '1' ? '/all' :'/balance');
    }
  }, []);


  return (
    <div className={styles.main}>
      <div className={styles.login}>
        <Tabs
          className="v2-soc-tabs"
          activeKey={activeKey}
          onChange={(key: IActiveKey) => setActiveKey(key)}
          tabBarStyle={{ marginBottom: 24 }}
        >
          <Tabs.TabPane tab="Login" key="login">
           <Login  type="login"/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Register" key="create">
          <Login  type="create"/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default connect(({ BadBank_login }) => ({
  loginModel: BadBank_login,
}))(Form.create()(LoginForm));

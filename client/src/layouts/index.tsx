import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';
import { Menu, Layout, Icon, Avatar, Popover, Button, message } from 'antd';

import { logout } from '@/utils/authority';
import { getGlobalLoginEffects } from '../models/login';
import { commonRequest } from '@/services/api';

import './index.less';
import { github } from '../config/login';

const { Header, Content } = Layout;
const AdminNav = [
  {
    name: 'AllData',
    path: 'all',
  },
  {
    name: 'User',
    path: 'user'
  }
];
const NavList = [
  {
    name: 'Balance',
    path: 'balance',
  },
  {
    name: 'Deposit',
    path: 'deposit',
  },
  {
    name: 'Withdraw',
    path: 'withdraw',
  },
  {
    name: 'Transfer',
    path: 'transfer',
  },
  {
    name: 'User',
    path: 'user'
  }
];

const defaultNav = [{ name: 'Login', path: 'login' }]

function LayoutPage(props) {
  const [ activeKey, setActiveKey] = useState('');
  const [nav, setNav] = useState(defaultNav);
  const { children, history, dispatch } = props;
  const { location: { pathname }} = props;

  const {
    location: { query },
  } = history;

  const handleNav = () => {
    const role = Cookie.get('role');
      // 员工
      if(role === '1') {
        return AdminNav
      }
      return NavList
  }

  const login = async (code) => {

    try {
      const resp = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: github.client_id,
      client_secret: github.client_secret,
      code,
    }, {
      headers: { accept: "application/json" } 
    })

    const access_token = resp.data.access_token;

    
    const result = await axios.get(`https://api.github.com/user`, {
    headers: {
      Authorization: 'token ' + access_token,
    },
  });

  if(!result) {
    message.error('获取github用户信息失败')
  }

  console.log(result)


    } catch(err) {
      console.log(err);
      message.error('github验证失败')
    }
    


    
    // const resp = await dispatch({
    //   type: getGlobalLoginEffects('githubLogin'),
    //   payload: {
    //     code,
    //   },
    // });




  };

  const handleSetActiveKey = () => {

    if(pathname) {
      const list = window.localStorage.getItem('token') ? handleNav() : nav
      const item = list.find(item => `/${item.path}` === pathname);
      if(!item) history.push('/overview') 
      setActiveKey(item ? item.path : '')
    }
  }


  

  //console.log(formatRouter(),  children, '===formatRouter')

  useEffect(() => {
    handleSetActiveKey()
  }, [pathname])

  useEffect(() => {
    if (query.code) {
      login(query.code);
    }

    const token = window.localStorage.getItem('token');
   
    setNav( token ? handleNav() : defaultNav);
   
  }, [window.localStorage.getItem('token'), pathname]);

    
  const handleLogout = () => {
    logout();
    history.push('/');
    message.info('您已经退出登录');
  }
  

  

  const isLogin = window.localStorage.getItem('token');
  const name = Cookie.get('username');
  const email = Cookie.get('email');
  const role = Cookie.get('role');

  const renderUserPop = (
    <div>
      <p>Username：{name}</p>
      <p>Email{email}</p>
      <p>Role：{role === '1' ? 'admin' : 'customer'}</p>
      <Button type='primary' onClick={handleLogout}>logout</Button>
    </div>
  )

  // const curActiveKey = handleSetActiveKey();
  return (
    <Layout>
      <Header className="header">
        <div>
          <Link to="/">
            <Icon style={{ color: '#1890ff', fontSize: 22, padding: '0 20px 0 0' }} type="bank" />
          </Link>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeKey]}
          mode="horizontal"
          // items={formatRouter()}
        >
          {nav.map((item) => (
            <Menu.Item key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
        {isLogin && (
          <Popover content={renderUserPop}  placement="topLeft" title="用户信息"
          trigger="hover">
          <Avatar
            className="user"
            style={{ verticalAlign: 'middle', backgroundColor: '#1890ff' }}
            size="large"
          >{name}</Avatar>
          </Popover>
        )}
      </Header>

      <Content className="content">
        {children}
      </Content>
    </Layout>
  );
}

export default connect(({ global_login }) => ({
  loginModel: global_login,
}))(LayoutPage);

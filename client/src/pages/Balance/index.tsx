import React, { useEffect, useState } from 'react';
import { Statistic, Row, Col, Button, Card } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import { getAppBalanceEffects } from '@/models/balance';



function Balance( { globalModel, recordModel, dispatch }) {

  const { balance, curAccount, saveAccount, bankId } = recordModel;

  const username = Cookies.get('username');
  const email = Cookies.get('email');
  const role = Cookies.get('role');

  
  const data = {
    username,
    email,
    role: role === '1' ? 'admin' : 'customer',
    balance,
    curAccount,
    saveAccount,
    bankId: bankId && bankId.replace(/(.{4})/g, "$1 ")
  }
  // 获取该用户账号信息
  const handleGetRecord = async () => {
    await dispatch({
      type:  getAppBalanceEffects('getRecord'),
      payload: {
        username,
        email,
      },
    });
  }

  useEffect(() => {
    handleGetRecord()
  }, [])

  const commonColProps = {
    style: {
      marginBottom: 30,
    },
    span: 12,
  };

  const commonCountProps = {
    color: 'rgb(24, 144, 255)',
  };

  const list = [
    {
      title: 'Active Users',
      key: 'username',
    },
    {
      title: 'Users Email',
      key: 'email',
    },
    {
      title: 'Users Role',
      key: 'role',
    },
    {
      title: 'Account Balance',
      key: 'balance',
      precision: 2
    },
    
    {
      title: 'Savings Account',
      key: 'saveAccount',
      precision: 2
    },
    {
      title: 'Checking Account',
      key: 'curAccount',
      precision: 2
    },
    {
      title: 'Account Number',
      key: 'bankId',
    },
  ];
  return (
    <Card>
      <Row gutter={16}>
        {list.map((item) => (
           <Col {...commonColProps}>
          <Statistic valueStyle={commonCountProps} {...item} value={data[item.key]} />
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default connect(({ global, Global_balance }) => ({
  globalModel: global,
  recordModel: Global_balance,
}))(Balance);

import { useState, useEffect } from 'react';
import { Card, Input, Radio, Form, Row, Col, Button, InputNumber, message } from 'antd';
import Cookies from 'js-cookie';
import { connect } from 'dva';

import { formatBankId } from '@/tool/format';
import BalanceForm from '@/components/CountBalance';
import { getAppBalanceEffects  } from '@/models/balance';




const Index = ({ form, depositModel, dispatch, recordModel }) => {
  
  const username =  Cookies.get('username');
   const email = Cookies.get('email');



   const { balance, curAccount, saveAccount, bankId } = recordModel;

   const handleGetBalance = async () => {
    await dispatch({
      type:  getAppBalanceEffects('getRecord'),
      payload: {
        username,
        email,
      },
    });
  }
  const handleSubmit = async (value, callback) => {
   
    const { type, status } = value;

    // 不为balance说明 是活期与储蓄之间相互转账 total不变

    // type 为 cur 说明是像活期转账

    // type 为 save 说明是向储蓄转账
    const total = status !== 'balance' ? balance : balance + value.balance
    const resp = await dispatch({
      type:  getAppBalanceEffects('setRecord'),
      payload: {
        bankId,
        username,
        email,
        balance: total,
        curAccount:  type === 'cur' ? (curAccount + value.balance) : (status !== 'balance' ? curAccount - value.balance : curAccount),
        saveAccount:  type === 'save' ? (saveAccount + value.balance) : (status !== 'balance' ? saveAccount - value.balance :saveAccount),
      },
    });

    if(resp && resp.returnCode !== -1) {
      message.success('修改成功');
      callback();
      handleGetBalance()
    }

   
  }

  

  useEffect(() => {
    handleGetBalance();
  }, [])
 
  return (
    <Row style={{ width: 1000, margin: '0 auto' }}>
      <Col>
        <Card title={<>Total Amount : <span style={{ color: '#1890ff'}}>{balance}</span> Account Number : <span style={{ color: '#1890ff'}}>{formatBankId(bankId)}</span></>}>
          <BalanceForm min={0} max={Number.MAX_VALUE} onSubmit={handleSubmit}/>
        </Card>
      </Col>
      <Col span={12}>
        <Card title={<>Checking Account: <span style={{ color: '#1890ff'}}>{curAccount}</span></>}>
          <BalanceForm onSubmit={handleSubmit} min={0} max={curAccount} labelSpan={11} wrapperSpan={13} title="Transfer To Savings Account" type="cur" />
        </Card>
      </Col>
      <Col span={12}>
        <Card title={<>Savings Account: <span style={{ color: '#1890ff'}}>{saveAccount}</span></>}>
          <BalanceForm onSubmit={handleSubmit} min={0} max={saveAccount} labelSpan={11} wrapperSpan={13} title="Transfer To Checking Account" type="save" />

        </Card>
      </Col>
    </Row>
  );
};

export default connect(({ global, BadBank_deposit, Global_balance }) => ({
  globalModel: global,
  depositModel: BadBank_deposit,
  recordModel: Global_balance,
}))(Form.create()(Index));

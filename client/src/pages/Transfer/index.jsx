import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Radio, Input, message } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import BankInput from '@/components/BankInput';
import { getAppBalanceEffects } from '@/models/balance';
import { getAppTransferEffects } from './models';

const reg = /^([1-9]{1})(\d{15}|\d{18})$/





const Index = ({ form, recordModel, dispatch }) => {
    const [ inputValue, setInput ] = useState();
    const username = Cookies.get('username');
    const email = Cookies.get('email');

    const { balance, curAccount, saveAccount, bankId } = recordModel;

    const handleGetBalance = async () => {
        await dispatch({
            type: getAppBalanceEffects('getRecord'),
            payload: {
                username,
                email,
            },
        });
    }

    useEffect(() => {
        handleGetBalance();
    }, [])

    const handleCheck = (rules, value, callback) => {
        console.log(value, '===value')
        let reset = value.replace(/\s*/g,"");
        if (!reg.test(reset)) {
            callback(new Error('请输入正确的卡号'))
        }
        callback()
    }

    const handleCheckCount = (rules, value, callback) => {
        if (value > balance ) {
            callback(new Error('不得超过balance'))
        }
        callback()
    }

    

    const handleSubmit =   (e) => {
        e.preventDefault();
        form.validateFields(async (err, values) => {
            if(!err) {
                console.log(values)
            } 

            const resp = await dispatch({
                type: getAppTransferEffects('transfer'),
                payload: {
                    curBankId: bankId,
                    transferBankId: values.bankId.replace(/\s*/g,""),
                    count: values.count
                }
            })

            if(resp && resp.data) {
                message.success('转账成功');
                handleGetBalance();
                form.resetFields(`count`,[]); 
            }

        
         



        })
    }

    const handleChangeBank = (e) => {
        if(e.target.value) {
            return e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g,
            '$1 ')
        }
        return e.target.value
    }

    const RenderInputBank = (
        <Input value={inputValue} onChange={handleChangeBank}/>
    )

    const { getFieldDecorator } = form;
    return (
        <Card style={{width: 1000, margin: '0 auto'}} title={<>Total Amount: <span style={{ color: '#1890ff'}}>{balance}</span></>}>
            <Form onSubmit={handleSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                <Form.Item label="Account Number">
                    {getFieldDecorator('bankId', {
                        rules: [
                            {
                                required: true,
                                message: '请输入',

                            },
                            {
                                validator: (rules, value, callback) => { console.log(11); handleCheck(rules, value, callback) }

                            }
                        ],
                    })(
                       <BankInput />,
                    )}
                </Form.Item>
                <Form.Item label="transfer">
                    {getFieldDecorator('count', {
                        rules: [
                            {
                                required: true,
                                message: '请输入',

                            },
                            {
                                validator: (rules, value, callback) => { handleCheckCount(rules, value, callback) }

                            }
                        ],
                    })(
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            max={balance}
                            precision={2}
                            step="0.01"
                        />,
                    )}
                </Form.Item>
                <div>
                    <Button htmlType='submit' type="primary">submit</Button>
                </div>
            </Form>
        </Card>
    )
}

export default connect(({ global, BadBank_deposit, Global_balance }) => ({
    globalModel: global,
    recordModel: Global_balance,
  }))(Form.create()(Index))
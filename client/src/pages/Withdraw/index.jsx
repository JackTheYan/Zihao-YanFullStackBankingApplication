import { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import { formatBankId } from '@/tool/format';
import BalanceForm from '@/components/CountBalance';
import { getAppBalanceEffects } from '@/models/balance';

const Index = ({ recordModel, dispatch }) => {
    const [max, setMax] = useState(0);
    const [type, setType] = useState('cur');
    const { balance, curAccount, saveAccount, bankId } = recordModel;

    const username = Cookies.get('username');
    const email = Cookies.get('email');

    const handleGetBalance = async () => {
        await dispatch({
            type: getAppBalanceEffects('getRecord'),
            payload: {
                username,
                email,
            },
        });
    }

    const handleChangeType = (value) => {
        setType(value);
        // 活期账户 最大值为 saveAcount
        setMax(value === 'save' ? saveAccount : curAccount )
    }

    const handleSubmit = async (value, callback) => {
        const total = balance - value.balance;
        const accountType = value.type;
        const resp = await dispatch({
            type:  getAppBalanceEffects('setRecord'),
            payload: {
              username,
              email,
              bankId,
              balance: total,
              curAccount: accountType === 'cur' ? curAccount - value.balance : curAccount ,
              saveAccount:  accountType === 'save' ? saveAccount - value.balance : saveAccount ,
            },
          });
          if(resp && resp.returnCode !== -1) {
            message.success('修改成功');
            // callback();
            handleGetBalance()
          }

    }

    useEffect(() => {
        handleGetBalance();
        
    }, [])

    useEffect(() => {
        if(type === 'cur') {
            // 默认为活期账户
        setMax(curAccount)
        }
    }, [curAccount, type])



    const renderTitle = (data) => <span style={{ color: '#1890ff', marginRight: 10 }}>{data}</span>

    return (
        <div style={{ width: 1000, margin: '0 auto' }}>
            <Card title={<>Total Amount: {renderTitle(balance)} Checking Account: {renderTitle(curAccount)}
            Savings Account: {renderTitle(saveAccount)}
            Account Number: {renderTitle(formatBankId(bankId))}
            </>}>
                <BalanceForm onSubmit={handleSubmit}  max={max} onChangeType={handleChangeType} title="Withdraw Amount" min={0} />
            </Card>
        </div>

    )

}

export default connect(({ Global_balance }) => ({
    recordModel: Global_balance,
}))(Index)
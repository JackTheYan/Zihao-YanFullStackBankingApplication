import React, { useEffect, useState } from 'react';
import { Descriptions, Badge } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import { getGlobalLoginEffects } from '@/models/login';

const Index = ({ dispatch }) => {
    const [userInfo, setUserInfo] = useState({})
    const handleGetData = async () => {
        const resp = await dispatch({
            type: getGlobalLoginEffects('queryUser'),
            payload: {
                username: Cookies.get('username'),
                email: Cookies.get('email'),
            }
        })
        if (resp && resp.data) {
            setUserInfo(resp.data);
        }

    }
    useEffect(() => {
        handleGetData()
    }, [])
    return (
        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} title="User Profile" bordered>
            
            <Descriptions.Item label="username">{userInfo.username}</Descriptions.Item>
            <Descriptions.Item label="email">{userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="role">{userInfo.role === 1 ? 'admin' : 'customer'}</Descriptions.Item>
            <Descriptions.Item label="sex">
               {userInfo.sex}
            </Descriptions.Item>
            <Descriptions.Item label="birthday">{userInfo.birthday}</Descriptions.Item>
            <Descriptions.Item label="createTime">
                {userInfo.createdAt && moment(userInfo.createdAt).format('YYYY-MM-DD')}
            </Descriptions.Item>
            
            {userInfo.role !== 1 && <Descriptions.Item label="Account Number">{userInfo.bankId && userInfo.bankId.replace(/(.{4})/g, "$1 ")}</Descriptions.Item> }
            <Descriptions.Item label="userId">{userInfo._id}</Descriptions.Item>
        </Descriptions>
    )
}

export default connect(({ global }) => ({
    global,
}))(Index)
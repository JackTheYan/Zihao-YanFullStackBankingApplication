import React from 'react';

import './index.less';

import { Icon } from 'antd';
const HomePage =  () => {
    return (
        <div className="home-content">
            <h1>Welcome to the bank</h1>
            <p>You can move around using the navigation bar.</p>
            <Icon style={{fontSize: 200, color: '#1890ff'}} type="bank" />
            </div>
    )
}

export default HomePage
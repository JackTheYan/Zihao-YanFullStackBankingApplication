import { Icon } from 'antd';

const Index = () => {
    return (
        <div style={{ textAlign: 'center'}}>
             <Icon style={{fontSize: 200}} type="smile" theme="twoTone" />
             <p style={{ marginTop: 30, fontSize: 20}}>您当前的角色为用户，暂无查看所有用户权限</p>
        </div>
    )
}

export default Index;
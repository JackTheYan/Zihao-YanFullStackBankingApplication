import { useEffect, useState } from 'react';
import { Table, Tag, Modal, Button, message } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';

import { getAppAllEffects } from './models';
import { getGlobalLoginEffects } from '@/models/login';
import CreateForm from '@/components/Login';

import NoAuth from '@/components/NoAuth';

const confirm = Modal.confirm;

const Index = ({ dispatch, userModel, onSuccess }) => {
    const [modalType, setModalType] = useState('');
    const { data = [] } = userModel;

    const username = Cookies.get('username');
    const email = Cookies.get('email');
    const role = Cookies.get('role');
    const noAuth = role === '0';

    const handleGetData = async () => {
        await dispatch({
            type: getAppAllEffects('getAll'),
            payload: {
                username,
                email
            }
        })
    }

    useEffect(() => {
        if (!noAuth) {
            handleGetData()
        }
    }, [role])

    const handleDelete = (record) => {

        confirm({
            title: 'Do you want to delete these items?',
            async onOk() {
                const { username, email, bankId } = record;
                const resp = await dispatch({
                    type: getGlobalLoginEffects('deleteUser'),
                    payload: {
                        username, email, bankId
                    }
                })

                if (resp && resp.data) {
                    message.success('success')
                    handleGetData();
                }
            },
            onCancel() { },
        })
    }

    const columns = [
        {
            title: 'Account Number',
            dataIndex: 'bankId',
            key: 'bankId',
            render: (text) => {
                return text && text.replace(/(.{4})/g, "$1 ")
            }
        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => <Tag>{text === 1 ? 'admin' : 'customer'}</Tag>
        },
        {
            title: 'Total Amount',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: 'Checking Account',
            dataIndex: 'curAccount',
            key: 'curAccount',
        },
        {
            title: 'Savings Account',
            dataIndex: 'saveAccount',
            key: 'saveAccount',
        },
        {
            title: 'action',
            dataIndex: 'action',
            render: (text, record) => { return record.username !== username && <Button type='primary' onClick={() => handleDelete(record)}>delete</Button> }
        }
    ]

    const handleCreateCallBack = () => {
        message.success('创建成功');
        setModalType('');
        handleGetData()
    }

    if (noAuth) return <NoAuth />
    return (
        <div>
            <Button  type="primary" style={{ marginBottom: 20}} onClick={() => setModalType('create')}>Add User</Button>
            <Table columns={columns} dataSource={data} />
            {modalType === 'create' && <Modal visible onCancel={() => setModalType('')} footer={null} title="create">
                <CreateForm type="createNoLogin" onSuccess={handleCreateCallBack}/></Modal>}
        </div>
    )

}

export default connect(({ BadBank_user }) => ({
    userModel: BadBank_user,
}))(Index)
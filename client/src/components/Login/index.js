import { Alert, Button, Form, Input, Tabs, Radio, Row, DatePicker } from 'antd';
import moment from 'moment';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { connect } from 'dva';

import { getGlobalLoginEffects } from '@/models/login';
import { github } from '@/config/login';
import { encryptFun } from '@/utils/request';

const LoginForm = ({ form, dispatch, type = 'login', onSuccess }) => {
  const { getFieldDecorator } = form;

  useEffect(() => {
    if (type !== 'createNoLogin') {
      const token = window.localStorage.getItem('token');
      if (token && Cookies.get('username')) {
        const role = Cookies.get('role')
        history.push(role === '1' ? '/all' : '/balance');
      }
    }
  }, []);

  async function handleOnSubmit() {
    const values = await form.validateFields();
    const encryptText = encryptFun(values.password);
    if (values.birthday) {
      values.birthday = moment(values.birthday).format('YYYY-MM-DD');
    }

    await dispatch({
      type: getGlobalLoginEffects(type),
      payload: {
        ...values,
        password: encryptText,
      },
    });

    if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      form={form}
    >
      <Row>
        {type !== 'login' && (
          <Form.Item label="Username">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  pattern:/^((?!\+|\.|\\|\/|:|\*|\?|<|>|\||'|%|@|#|&|\$|\^|&|\*).){1,8}$/, 
                  message: '请输入用户名（不包含特殊字符）',
                  whitespace: true,
                },
                {
                  max: 8,
                  message: "最多可输入8个字",
                },
              ],
            })(
              <Input
                autoFocus
                placeholder="Username"
                className="v2-soc-input"
                style={{
                  height: 40,
                  background: '#fff',
                  color: '#18191a',
                }}
              />,
            )}
          </Form.Item>
        )}
        
        <Form.Item label="Email">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                required: true,
                message: '请输入正确的email',
                whitespace: true,
              },
            ],
          })(
            <Input
              placeholder="Email"
              className="v2-soc-input"
              style={{
                height: 40,
                background: '#fff',
                color: '#18191a',
              }}
              onPressEnter={handleOnSubmit}
            />,
          )}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'password required',
                whitespace: true,
              },
              {
                pattern: /^[\S]{6,}$/,
                message: '密码不能小于6位',
              },
            ],
          })(
            <Input.Password
              placeholder="Password"
              className="v2-soc-input"
              style={{
                height: 40,
                background: '#fff',
                color: '#18191a',
              }}
              onPressEnter={handleOnSubmit}
            />,
          )}
        </Form.Item>
        {type !== 'login' && (
          <>
            <Form.Item label="Birthday">
              {getFieldDecorator('birthday', {
                rules: [
                  {
                    required: true,
                    message: 'birthday required',
                  },
                ],
              })(
                <DatePicker
                  disabledDate={(current) =>
                    current && current > moment().endOf('day')
                  }
                />,
              )}
            </Form.Item>
            <Form.Item label="Sex">
              {getFieldDecorator('sex', {
                initialValue: 'male',
                rules: [
                  {
                    required: true,
                    message: 'sex required',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="Role">
              {getFieldDecorator('role', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>Admin </Radio>
                  <Radio value={0}>Customer </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </>
        )}
      </Row>
      {type === 'login' && (
        <p>
          Login Using：
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${github.client_id}&redirect_uri=${github.redirect_uri}`}
          >
            github
          </a>
        </p>
      )}
      <Button
        className="v2-soc-button primary"
        style={{ width: '100%', height: 40 }}
        onClick={handleOnSubmit}
      >
        {type === 'login' ? 'Login' : 'Register'}
      </Button>
    </Form>
  );
};

export default connect(({ BadBank_login }) => ({
  loginModel: BadBank_login,
}))(Form.create()(LoginForm));

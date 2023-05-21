import { Form, InputNumber, Button, Radio } from 'antd';
const BalanceForm = ({ form, title = "Deposit Amount", type = 'balance', labelSpan = 4, wrapperSpan = 19 , min, max, onSubmit, onChangeType}) => {
    const { getFieldDecorator } = form;

    const handleCheck = (rules,value,callback) => {
        if(value > max) {
            callback(new Error('不能超过账号最大值'))
        }
        callback()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if(!err) {
                onSubmit({...values, status: type}, () => form.resetFields())
            }
        })
    }

    const handleChangeType = (e) => 
    {
        onChangeType && onChangeType(e.target.value);
    }

    let labelProps = {};

    if(type !== 'balance') {
      labelProps = {
        labelCol : { span: 5 },
        wrapperCol: { span: 18 }
      }
    }

    return (
      <Form onSubmit={handleSubmit} labelCol={{ span: labelSpan }} wrapperCol={{ span: wrapperSpan }}>
        <Form.Item label={title}>
          {getFieldDecorator('balance', {
            rules: [
              {
                required: true,
                message: '请输入',

              },
              {
                validator: (rules,value,callback)=>{handleCheck(rules,value,callback)}

              }
            ],
          })(
            <InputNumber
              style={{ width: '100%' }}
              min={min}
              max={max}
              precision={2}
              step="0.01"
            />,
          )}
        </Form.Item>
        <Form.Item {...labelProps} label="Account Type">
          {getFieldDecorator('type', {
            initialValue: type !== 'cur' ? "cur" : "save",
          })(
            <Radio.Group onChange={handleChangeType}>
              <Radio disabled={type === 'cur'} value="cur">Checking Account</Radio>
              <Radio disabled={type === 'save'} value="save">Savings Account</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' type="primary">submit</Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default Form.create()(BalanceForm)
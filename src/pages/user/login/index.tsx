import React, { useState } from 'react';
import { Alert, Checkbox, message } from 'antd';
import { useRequest, Link, history } from 'umi';
import LoginForm from '@/components/LoginForm';
import {
  fakeAccountLogin,
  LoginParamsType,
} from '@/components/LoginForm/service';
import useAuth from '@/hooks/useAuth';
import { LOGIN_TYPE } from '@/pages/constant';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

export default function Login() {
  const { saveToken } = useAuth();
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const { loading, data = {}, run: submit } = useRequest(fakeAccountLogin, {
    manual: true,
    onSuccess: (data) => {
      saveToken(data.accessToken!);
      history.push('/homepage');
    },
    onError: (error) => message.error(error.message),
  });

  const handleSubmit = (values: LoginParamsType) => {
    const { userName, ...rest } = values;
    submit({
      ...rest,
      loginType: LOGIN_TYPE,
      mobilePhone: values.mobile,
      username: userName!,
    });
  };

  const { status, type: loginType } = data || { status: 'ok', type: 'account' };

  return (
    <div style={{ width: '75%', backgroundColor: 'white', padding: 40 }}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !loading && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="用户名: admin or user"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: ant.design"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="mobile" tab="手机号码登录">
          {status === 'error' && loginType === 'mobile' && !loading && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox
            checked={autoLogin}
            onChange={(e) => setAutoLogin(e.target.checked)}
          >
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <Submit loading={loading}>登录</Submit>
      </LoginForm>
      <div>
        <Link to="/user/register">还没有账户？去注册&gt;&gt;</Link>
      </div>
    </div>
  );
}

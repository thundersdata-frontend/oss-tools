/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2020-04-26 20:43:30
 * @LastEditors: 阮旭松
 * @LastEditTime: 2020-09-11 15:05:49
 */
import { request } from '@/common';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export interface LoginParams {
  mobilePhone: string;
  loginType: number;
  username: string;
}

export async function fakeAccountLogin(params: LoginParams) {
  // 暂时使用 maoyes 开发环境账号
  return request(
    'http://maoyes-base.dev.thundersdata.com/api/synergy/enterprise/user/login',
    {
      method: 'POST',
      data: params,
      headers: {
        accessToken: localStorage.getItem('accessToken')!,
      },
    },
  );
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

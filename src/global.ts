import { CustomWindow } from './interfaces/common';
import lscache from 'lscache';
import 'normalize.css';
import 'dayjs/locale/zh-cn';
import '@/services';

((window as unknown) as CustomWindow).requestConfig = {
  withCredentials: false,
  getToken() {
    const accessToken = lscache.get('access_token') || '';
    return Promise.resolve(accessToken);
  },
};

import { CustomWindow } from './interfaces/common';
import 'normalize.css';
import 'dayjs/locale/zh-cn';
import '@/services';

((window as unknown) as CustomWindow).requestConfig = {
  withCredentials: false,
  getToken() {
    const accessToken = localStorage.getItem('accessToken') || '';
    return Promise.resolve(accessToken);
  },
};

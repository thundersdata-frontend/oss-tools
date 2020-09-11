/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2019-10-27 16:26:45
 * @LastEditors: 阮旭松
 * @LastEditTime: 2020-09-11 18:21:03
 */
export default {
  '/resource': {
    success: true,
    data: [
      {
        id: 2004,
        resourceKey: 'HOME',
        apiUrl: '/homepage',
        icon: 'icon-screen',
        description: '首页',
        type: 0,
        orderValue: 1,
        privilegeList: [],
      },
      {
        id: 2005,
        resourceKey: 'history',
        apiUrl: '/history',
        icon: 'icon-screen',
        description: '历史记录',
        type: 0,
        orderValue: 1,
        privilegeList: [],
      },
    ],
    code: 20000,
    message: '成功',
  },
};

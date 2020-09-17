/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2020-05-08 14:23:36
 * @LastEditors: 阮旭松
 * @LastEditTime: 2020-09-17 10:36:14
 */

export const UPLOAD_URL = 'http://object-service.dev.thundersdata.com';

/** 登录方式：用户名 */
export const LOGIN_TYPE = 0;

/** 默认用微信电商小程序开发环境 token */
export const ACCESS_TOKEN = '223bc111017d323b00fee4cf9c59a2be';

/** 表格中最大显示字数 */
export const MAX_TABLE_LENGTH = 15;

/** 文件类型映射 */
export const FILE_TYPE_MAP = {
  图片: ['.jpg', '.jpeg', '.gif', '.png', '.bmp', '.webp'],
  压缩包: ['.rar', '.zip'],
  文档: ['.doc', '.docx', '.pdf'],
  表格: ['.xls'],
  视频: ['.avi', '.wmv', '.mpg', '.mpeg', '.mov', '.mp4', '.rm', '.ram'],
};

/** 文件类型图标映射 */
export enum FILE_TYPE_ICON_MAP {
  压缩包 = 'icon-yasuobao',
  表格 = 'icon-biaoge',
  视频 = 'icon-shipin',
  文档 = 'icon-wendang',
  文件 = 'icon-wenjian',
}

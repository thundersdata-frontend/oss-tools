/*
 * @文件描述: 字符串超出长度处理-目前主要用于table中
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-07-15 15:01:45
 * @LastEditors: 廖军
 * @LastEditTime: 2020-07-15 15:17:50
 */

import React from 'react';
import { Tooltip } from 'antd';
import string from '@/utils/string';

export default ({
  text = '',
  maxLength = 50,
}: {
  text?: string;
  maxLength?: number;
}) => {
  return text.length > maxLength ? (
    <Tooltip title={text}>
      <span>{string.textEllipsis(text, maxLength)}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};

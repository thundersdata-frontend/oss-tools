/*
 * @文件描述: 上传历史记录
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2020-09-11 18:11:16
 * @LastEditors: 阮旭松
 * @LastEditTime: 2020-09-17 11:58:10
 */

import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import string from '@/utils/string';
import { Store } from 'antd/es/form/interface';
import TextEllipsis from '@/components/TextEllipsis';
import {
  MAX_TABLE_LENGTH,
  FILE_TYPE_MAP,
  FILE_TYPE_ICON_MAP,
} from '../constant';
import Iconfont from '@/components/Iconfont';

export default () => {
  const dataSource = JSON.parse(
    localStorage.getItem('ossFileHistoryArr') || '[]',
  );

  const getFileType = (item: Store) => {
    // 文件后缀
    const fileSuffix =
      '.' + string.getLastSubstring(item.url, '.').toLowerCase();
    return (
      Object.keys(FILE_TYPE_MAP).find((type) =>
        FILE_TYPE_MAP[type].includes(fileSuffix),
      ) || '文件'
    );
  };
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<Store>[] = [
    {
      title: '文件Id',
      dataIndex: 'fileId',
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => (
        <TextEllipsis text={row.fileName} maxLength={MAX_TABLE_LENGTH} />
      ),
    },
    {
      title: '文件预览',
      dataIndex: 'preview',
      align: 'center',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => {
        const fileType = getFileType(row);
        if (fileType === '图片') {
          return (
            <img
              width={200}
              alt="文件预览"
              src={row.url}
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(row.url)}
            />
          );
        }
        return (
          <Iconfont
            name={FILE_TYPE_ICON_MAP[fileType]}
            style={{ color: '#333', fontSize: 26 }}
          />
        );
      },
    },
    {
      title: '文件链接',
      dataIndex: 'url',
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => getFileType(row),
    },
  ];
  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      bordered
      dataSource={dataSource}
      search={false}
      rowKey="url"
      pagination={{
        size: 'default',
      }}
      dateFormatter="string"
      headerTitle="上传历史记录"
      tableAlertRender={false}
      rowSelection={{}}
    />
  );
};

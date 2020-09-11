/*
 * @文件描述: 上传历史记录
 * @公司: thundersdata
 * @作者: 阮旭松
 * @Date: 2020-09-11 18:11:16
 * @LastEditors: 阮旭松
 * @LastEditTime: 2020-09-11 18:20:21
 */

import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Store } from 'antd/es/form/interface';
import TextEllipsis from '@/components/TextEllipsis';
import { MAX_TABLE_LENGTH } from '../constant';

export default () => {
  const dataSource = JSON.parse(
    localStorage.getItem('ossFileHistoryArr') || '[]',
  );
  console.log('dataSource: ', dataSource);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<Store>[] = [
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
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => row.url && <img alt="文件预览" src={row.url} />,
    },
    {
      title: '文件链接',
      dataIndex: 'url',
      align: 'left',
      copyable: false,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => (
        <TextEllipsis text={row.url} maxLength={MAX_TABLE_LENGTH} />
      ),
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

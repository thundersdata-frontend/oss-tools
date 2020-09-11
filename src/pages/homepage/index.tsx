import React, { useState } from 'react';
import { Upload, message, Input, Alert, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from '@td-design/web';
import { UPLOAD_URL } from '@/pages/constant';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { useImmer } from 'use-immer';
import string from '@/utils/string';
import date from '@/utils/date';
import styles from './index.module.less';

const { Dragger } = Upload;

interface AlertProps {
  visible: boolean;
  message: string | React.ReactNode;
  type: 'error' | 'info' | 'success' | 'warning';
}

const UploadPage = () => {
  const [fileId, setFileId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [alertStatusArr, setAlertStatusArr] = useState<AlertProps[]>([]);
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [spinObj, setSpinObj] = useImmer({
    visible: false,
    successCount: 0,
    failedCount: 0,
  });
  const { visible: spinVisible, successCount, failedCount } = spinObj;
  console.log('successCount: ', successCount);
  console.log('failedCount: ', failedCount);

  const UploadContent = () => (
    <div className={styles.uploadContent}>
      <PlusOutlined />
      <p>点击或将文件拖拽到这里{fileId ? '替换原文件' : '上传'}</p>
    </div>
  );

  // 复制文本
  const handleCopy = (text: string) => {
    string.copyText(text);
    message.success('复制成功！');
  };

  // 公共上传配置
  const commonProps = {
    name: 'file',
    multiple: false,
    onRemove: (file: UploadFile<any>) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (_file: UploadFile<any>, newFileList: UploadFile<any>[]) => {
      setFileList([...fileList, ...newFileList]);
      return true;
    },
    fileList,
  };

  // 上传配置
  const uploadProps = {
    ...commonProps,
    action: `${UPLOAD_URL}/file/uploadToPub`,
    data: {
      access_token: accessToken,
    },
    multiple: true,
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const fileObj = {};
      let successCount = 0;
      let failedCount = 0;
      const finishedCount = info.fileList.filter((item) => {
        if (item.status === 'done') {
          successCount += 1;
        }
        if (item.status === 'error') {
          failedCount += 1;
        }
        return item.status && item.status !== 'uploading';
      }).length;
      setSpinObj((config) => {
        config.visible = true;
        config.successCount = successCount;
        config.failedCount = failedCount;
      });
      /** 是否完全上传完毕 */
      if (finishedCount === info.fileList.length) {
        setSpinObj((config) => {
          config.visible = false;
        });
        const alertArr = info.fileList.map((item) => {
          const { response, status, name } = item;
          const formattedFileName = name.replace(/(\..*)$/, '');
          fileObj[formattedFileName] = response.data?.url;
          if (status === 'done') {
            if (response.data) {
              return {
                visible: true,
                type: 'success',
                message: (
                  <div className={styles.messageWrap}>
                    {name}上传成功，fileId为:
                    {response.data.fileId}，链接为{response.data.url}
                    <a onClick={() => handleCopy(response.data.fileId)}>
                      复制 fileId
                    </a>
                    <a onClick={() => handleCopy(response.data.url)}>
                      复制地址
                    </a>
                  </div>
                ),
              };
            }
            return {
              visible: true,
              type: 'error',
              message: '上传失败，请检查 access_token 是否有效',
            };
          }
          return {
            visible: true,
            type: 'error',
            message: `${name} 上传失败，${response.message}`,
          };
        });
        const originHistoryList = JSON.parse(
          localStorage.getItem('ossFileHistoryArr') || '[]',
        );
        console.log('fileObj: ', fileObj);
        console.log('上传文件结果：', originHistoryList);
        const newFileList = Object.keys(fileObj).map((key) => ({
          fileName: key,
          url: fileObj[key],
          createAt: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        }));
        const totalHistoryList = originHistoryList.concat(newFileList);
        localStorage.setItem(
          'ossFileHistoryArr',
          JSON.stringify(totalHistoryList),
        );
        console.log('totalHistoryList: ', totalHistoryList);
        setAlertStatusArr(alertArr as AlertProps[]);
      }
    },
  };

  // 重写配置
  const overrideProps = {
    ...commonProps,
    action: `${UPLOAD_URL}/file/override`,
    data: {
      fileId,
      access_token: accessToken,
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const { response, status } = info.file;
      if (status === 'done') {
        const fileUrl = `${UPLOAD_URL}/file/preview?fileId=${fileId}`;
        setAlertStatusArr([
          {
            visible: true,
            type: 'success',
            message: (
              <div className={styles.messageWrap}>
                {info.fileList[0].name} 重写成功，链接为:{fileUrl}
                <a onClick={() => handleCopy(fileUrl)}>复制地址</a>
              </div>
            ),
          },
        ]);
        setFileList([]);
      } else if (status === 'error') {
        setAlertStatusArr([
          {
            visible: true,
            type: 'error',
            message: `${info.fileList[0].name} 重写失败，${response.message}`,
          },
        ]);
      }
    },
  };

  /** 获得上传信息 */
  const getSpinTip = () =>
    `上传中${successCount || failedCount ? ',' : ''}${
      successCount ? `已上传 ${successCount}个${failedCount ? ',' : ''}` : ''
    } ${failedCount ? `上传失败 ${failedCount} 个` : ''}`;

  return (
    <div>
      <Spin className={styles.spin} spinning={spinVisible} tip={getSpinTip()} />
      <Card title="oss文件上传">
        <div className={styles.cardContent}>
          <div className={styles.inputWrap}>
            <div className={styles.fileInput}>
              <span>文件ID:</span>
              <Input
                value={fileId}
                placeholder="输入 ID 以重写文件"
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
            <div className={styles.tokenInput}>
              <span>access_token:</span>
              <Input
                placeholder="可以输入自己项目的 token 上传"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </div>

          {alertStatusArr.map((item, idx) => {
            const { message, type } = item;
            return (
              <Alert
                key={'' + message}
                className={styles.alertWrap}
                message={message}
                type={type}
                showIcon
                closable
                onClose={() => {
                  const modifiedArr = alertStatusArr.map((item, arrIdx) => {
                    if (arrIdx === idx) {
                      item.visible = false;
                    }
                    return item;
                  });
                  setAlertStatusArr(modifiedArr);
                }}
              />
            );
          })}
          <div className={styles.uploadWrap}>
            <Dragger {...(fileId ? overrideProps : uploadProps)}>
              <UploadContent />
            </Dragger>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadPage;

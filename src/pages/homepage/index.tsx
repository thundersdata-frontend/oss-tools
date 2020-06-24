import React, { useState } from 'react';
import { Upload, message, Input, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from '@td-design/web';
import { UPLOAD_URL, access_token } from '@/pages/constant';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { useImmer } from 'use-immer';
import string from '@/utils/string';
import styles from './index.module.less';

const { Dragger } = Upload;

interface AlertProps {
  visible: boolean;
  message: string | React.ReactNode;
  type: 'error' | 'info' | 'success' | 'warning';
}

// 初始化 alert 配置
const INITIAL_ALERT_STATUS: AlertProps = Object.freeze({
  /** 是否显示 */
  visible: false,
  /** alert 类型 */
  type: 'success',
  /** alert 提示信息 */
  message: '',
});

const UploadPage = () => {
  const [fileId, setFileId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [accessToken, setAccessToken] = useState<string>(access_token);
  const [alertStatusObj, setAlertStatusObj] = useImmer<AlertProps>(
    INITIAL_ALERT_STATUS,
  );
  const { visible, type, message: alertMessage } = alertStatusObj;

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
    beforeUpload: (file: UploadFile<any>) => {
      setFileList([...fileList, file]);
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
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const { response, status } = info.file;
      if (status === 'done') {
        if (response.data) {
          setAlertStatusObj((config) => {
            config.visible = true;
            config.type = 'success';
            config.message = (
              <div className={styles.messageWrap}>
                {info.fileList[0].name}上传成功，fileId为:
                {response.data.fileId}，链接为{response.data.url}
                <a onClick={() => handleCopy(response.data.fileId)}>
                  复制 fileId
                </a>
                <a onClick={() => handleCopy(response.data.url)}>复制地址</a>
              </div>
            );
          });
          setFileList([]);
        } else {
          setAlertStatusObj((config) => {
            config.visible = true;
            config.type = 'error';
            config.message = '上传失败，请检查 access_token 是否有效';
          });
        }
      } else if (status === 'error') {
        setAlertStatusObj((config) => {
          config.visible = true;
          config.type = 'error';
          config.message = `${info.fileList[0].name} 上传失败，${response.message}`;
        });
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
        setAlertStatusObj((config) => {
          config.visible = true;
          config.type = 'success';
          config.message = `${info.fileList[0].name} 重写成功！,链接为:${UPLOAD_URL}/file/preview?fileId=${fileId}`;
          config.message = (
            <div className={styles.messageWrap}>
              {info.fileList[0].name} 重写成功，链接为:{fileUrl}
              <a onClick={() => handleCopy(fileUrl)}>复制地址</a>
            </div>
          );
        });
        setFileList([]);
      } else if (status === 'error') {
        setAlertStatusObj((config) => {
          config.visible = true;
          config.type = 'error';
          config.message = `${info.fileList[0].name} 重写失败，${response.message}`;
        });
      }
    },
  };

  return (
    <div>
      <Card title="oss文件上传">
        <div className={styles.cardContent}>
          <div className={styles.inputWrap}>
            <div className={styles.fileInput}>
              <span>文件ID:</span>
              <Input
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
            <div className={styles.tokenInput}>
              <span>access_token:</span>
              <Input
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.alertWrap}>
            {visible && (
              <Alert
                message={alertMessage}
                type={type}
                showIcon
                closable
                onClose={() => {
                  setAlertStatusObj((config) => {
                    config.visible = false;
                  });
                }}
              />
            )}
          </div>
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

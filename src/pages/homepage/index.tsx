import React, { useState } from 'react';
import { Upload, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from '@td-design/web';
import { UPLOAD_URL, access_token } from '@/pages/constant';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/es/upload/interface';
import styles from './index.module.less';

const { Dragger } = Upload;

const UploadPage = () => {
  const [fileId, setFileId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const UploadContent = () => (
    <div className={styles.uploadContent}>
      <PlusOutlined />
      <p>点击或将文件拖拽到这里{fileId ? '替换原文件' : '上传'}</p>
    </div>
  );

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
      access_token,
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const { response, status } = info.file;
      if (status === 'done') {
        message.success(
          `${info.fileList[0].name} 上传成功！，fileId为:${response.data.fileId},链接为${response.data.url}`,
        );
        setFileList([]);
      } else if (status === 'error') {
        message.error(`${info.fileList[0].name} 上传失败，${response.message}`);
      }
    },
  };

  // 重写配置
  const overrideProps = {
    ...commonProps,
    action: `${UPLOAD_URL}/file/override`,
    data: {
      fileId,
      access_token,
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const { response, status } = info.file;
      if (status === 'done') {
        message.success(
          `${info.fileList[0].name} 重写成功！,链接为:${UPLOAD_URL}/file/preview?fileId=${fileId}`,
        );
        setFileList([]);
      } else if (status === 'error') {
        message.error(`${info.fileList[0].name} 重写失败，${response.message}`);
      }
    },
  };

  return (
    <div>
      <Card title="oss文件上传">
        <div className={styles.cardContent}>
          <div className={styles.fileInput}>
            <span>文件ID:</span>
            <Input value={fileId} onChange={(e) => setFileId(e.target.value)} />
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

# 前端业务辅助工具-上传维护文件

## 概要

用于对接 oss 文件服务，上传文件到远程 oss 服务。

## 使用方法

### 一、上传文件

1.在 access_token 中输入自己项目可用的 access_token，可替换默认的 access_token(位于 pages/constant.ts 下)，如果已失效请更新 access_token。

2.点击或拖动文件到加号处上传，即可看到上传后远程文件的 fileId 和 链接地址，点击“复制 fileId”可以复制文件 id，点击“复制地址”可以复制远程文件的静态文件地址。

### 二、重写文件

1.填入有效的 access_token 或用自动填充的 access_token。

2.将上传文件时获得的 fileId 输入文件 ID 的输入框，再选择远程文件即可替换文件为当前文件，点击 “复制地址” 可以复制远程文件的链接。

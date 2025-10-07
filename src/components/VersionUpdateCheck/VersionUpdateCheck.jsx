import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Alert } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * 版本更新检查组件
 * 功能：定期检查服务器上的版本信息，当检测到新版本时提示用户更新
 * 更新机制：通过刷新页面加载最新资源
 */
const VersionUpdateCheck = () => {
  const [showUpdate, setShowUpdate] = useState(false); // 控制更新提示弹窗的显示/隐藏
  const [latestVersion, setLatestVersion] = useState(''); // 存储从服务器获取的最新版本号

  useEffect(() => {
    if (!isProduction) {
      console.info('开发环境，跳过版本检查');
      return;
    }

    /**
     * 版本检查函数流程：
     * 1. 从服务器获取 version.json 文件（带时间戳避免缓存）
     * 2. 比较当前存储版本与服务器版本
     * 3. 如果版本不同，显示更新提示
     */
    const checkVersion = async () => {
      try {
        // 获取版本信息（添加时间戳参数防止浏览器缓存）
        const response = await fetch(`/reactExamples/version.json?t=${Date.now()}`);

        // 解析JSON数据，提取版本号
        const { version } = await response.json();

        // 从 localStorage 获取当前存储的版本号
        const currentVersion = localStorage.getItem('app-version');

        // 首次访问处理：若本地没有存储版本，则初始化存一份
        if (!currentVersion) {
          localStorage.setItem('app-version', version);
        }
        // 若本地有版本，再比较一下本地和服务器版本，二者不一致，说明有新版本
        else if (currentVersion !== version) {
          setLatestVersion(version); // 更新最新版本号
          setShowUpdate(true); // 打开更新提示弹窗
          // 更新本地版本号确保不会一直出现弹框提示
          localStorage.setItem('app-version', version);
          console.info(`检测到新版本: ${version} (当前: ${currentVersion})`);
        }
      } catch (error) {
        console.error('版本检查失败:', error);
      }
    };

    // 组件挂载后立即执行一次版本检查
    checkVersion();

    // 每1分钟检查一次版本更新
    const timer = setInterval(checkVersion, 1 * 60 * 1000);

    // 组件卸载时时候清除定时器
    return () => {
      clearInterval(timer);
      console.info('清除版本检查定时器');
    };
  }, []); // 空依赖数组确保只didMount运行一次

  const handleUpdate = () => {
    // 刷新页面，强制浏览器重新加载所有资源
    window.location.reload();
  };

  const handleKnow = () => {
    // 关闭弹窗
    setShowUpdate(false);
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <strong>系统更新提示</strong>
        </Space>
      }
      open={showUpdate}
      onCancel={handleKnow}
      footer={
        <Space>
          <Button onClick={handleKnow}>
            我知道了，后续手动刷新页面
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleUpdate}
          >
            立即更新
          </Button>
        </Space>
      }
      width={500}
      closable={false}
      maskClosable={false}
      centered
    >
      <Alert
        message="发现新版本"
        description={
          <div>
            <p>系统已发布新版本 {latestVersion}，是否立即更新获取最新功能？</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              • 更新将刷新当前页面，请确保已保存所有重要数据<br />
              • 更新过程只需几秒钟
            </p>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: '16px' }}
      />
    </Modal>
  );
};

export default VersionUpdateCheck;
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import { useSearchParams } from 'react-router-dom';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

const TabStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 从 URL 参数中获取当前 tab，如果没有则默认为 '1'
  const tabValue = searchParams.get('tab') || '1';
  const [activeKey, setActiveKey] = useState(tabValue);

  // 当 URL 参数变化时，更新 activeKey
  useEffect(() => {
    const currentTab = searchParams.get('tab') || '1';
    setActiveKey(currentTab);
  }, [searchParams]);

  const onChange = (key: string) => {
    console.log('切换到 tab:', key);
    setActiveKey(key);

    // 更新 URL 参数，保持当前 tab 状态
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', key);
      return newParams;
    }, { replace: true });
  };

  return <Tabs activeKey={activeKey} items={items} onChange={onChange} />;
};

export default TabStatus;
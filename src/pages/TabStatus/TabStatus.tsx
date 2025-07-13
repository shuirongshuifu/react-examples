import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
/**
 * useLocation用于获取完成地址栏信息
 * useSearchParams用于获取查询query信息，并返回可读写的searchParams对象
 * */
import { useSearchParams } from 'react-router-dom'
import type { TabsProps } from 'antd';

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

export default function TabStatus() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. 默认高亮第一个tab
  const [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    // 2. 当页面didMounted的时候获取地址栏tab参数，并修改tab高亮
    const queryObj = Object.fromEntries(searchParams.entries())
    setActiveKey(queryObj.tab || '1')
    // 3. 后续当地址栏参数发生变化的时候，也去获取地址栏tab参数，并修改tab高亮
  }, [searchParams]) // 也可以只单独监听tab [searchParams.get('tab')] 不过最好提取出来

  const onChange = (key: string) => {
    console.log('onChange', key);
    // 4. 当tab高亮发生变化时，修改地址栏参数
    const queryObj = Object.fromEntries(searchParams.entries())
    queryObj['tab'] = key
    setSearchParams(queryObj)
    // setSearchParams({tab: key}) // 注意不要只修改tab把别的地址栏参数覆盖掉了
  };

  return (
    <div>
      <h2>TabStatus——刷新依旧保留当前tab状态</h2>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </div>
  )
}

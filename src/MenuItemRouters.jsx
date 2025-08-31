import Home from './pages/Home/Home'
import Crud from './pages/Crud/Crud'
import TabStatus from './pages/TabStatus/TabStatus'
import AnimationEvent from './pages/AnimationEvent/AnimationEvent'
import FormExample from './pages/FormExample/FormExample'
import RightMenu from './pages/RightMenu/RightMenu'
import VerticalSelection from './pages/VerticalSelection/VerticalSelection'

import { AndroidOutlined } from '@ant-design/icons';

const basePath = '/reactExamples'

export const MenuItemRouters = [
    {
        key: `${basePath}/`,
        label: '首页',
        icon: <AndroidOutlined />,
        element: <Home />
    },
    {
        key: `${basePath}/crud`,
        label: '增删改查',
        icon: <AndroidOutlined />,
        element: <Crud />
    },
    {
        key: `${basePath}/tabStatus`,
        label: '标签状态',
        icon: <AndroidOutlined />,
        element: <TabStatus />
    },
    {
        key: `${basePath}/animationEvent`,
        label: '动画事件',
        icon: <AndroidOutlined />,
        element: <AnimationEvent />
    },
    {
        key: `${basePath}/myForm`,
        label: '二次封装表单',
        icon: <AndroidOutlined />,
        element: <FormExample />
    },
    {
        key: `${basePath}/rightMenu`,
        label: '右键菜单',
        icon: <AndroidOutlined />,
        element: <RightMenu />
    },
    {
        key: `${basePath}/verticalSelection`,
        label: '竖向选中',
        icon: <AndroidOutlined />,
        element: <VerticalSelection />
    },
]


/**
 * 路由懒加载
 * */ 
// import { lazy, Suspense } from 'react';
// import { Route, Routes } from 'react-router-dom';

// // 使用 lazy 动态导入组件
// const LazyAbout = lazy(() => import('./pages/LazyAbout.jsx'));

// function App() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>
//         {/* 在路由配置中使用懒加载的组件 */}
//         <Route path="lazy-about" element={<LazyAbout />} />
//       </Routes>
//     </Suspense>
//   );
// }

// export default App;
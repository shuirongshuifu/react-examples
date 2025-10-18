import Home from './pages/Home/Home'
import Crud from './pages/Crud/Crud'
import TabStatus from './pages/TabStatus/TabStatus'
import AnimationEvent from './pages/AnimationEvent/AnimationEvent'
import FormExample from './pages/FormExample/FormExample'
import RightMenu from './pages/RightMenu/RightMenu'
import VerticalSelection from './pages/VerticalSelection/VerticalSelection'
import Ollama from './pages/Ollama/Ollama'
import TrueFalse from './pages/TrueFalse/TrueFalse'
import ImagePoint from './pages/ImagePoint/ImagePoint'
import Sse from './pages/Sse/Sse'
import Sse2 from './pages/Sse2/Sse2'

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
    {
        key: `${basePath}/ollama`,
        label: 'Ollama',
        icon: <AndroidOutlined />,
        element: <Ollama />
    },
    {
        key: `${basePath}/trueFalse`,
        label: 'TrueFalse',
        icon: <AndroidOutlined />,
        element: <TrueFalse />
    },
    {
        key: `${basePath}/imagePoint`,
        label: '图片区域打点',
        icon: <AndroidOutlined />,
        element: <ImagePoint />
    },
    {
        key: `${basePath}/sse`,
        label: 'SSE',
        icon: <AndroidOutlined />,
        element: <Sse />
    },
    {
        key: `${basePath}/sse2`,
        label: 'SSE2',
        icon: <AndroidOutlined />,
        element: <Sse2 />
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
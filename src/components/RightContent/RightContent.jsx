import { Routes, Route } from 'react-router-dom';
import TopHeader from '@/components/TopHeader/TopHeader';

// 右侧内容区（路由映射）
const RightContent = ({ MenuItemRouters }) => {
    return (
        <div style={{ flex: 1, backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
            <TopHeader MenuItemRouters={MenuItemRouters}></TopHeader>
            <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
                <Routes>
                    {
                        MenuItemRouters.map((item) => <Route key={item.key} path={item.key} element={item.element} />)
                    }
                </Routes>
            </div>
        </div>
    )
}

export default RightContent
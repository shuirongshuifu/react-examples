import { Menu } from 'antd'; // 按需引入antd组件
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import userImg from '/user.png';
import userImg from '@/assets/img/user.png'; // 引入logo图片
import './LeftMenu.css'; // 引入样式文件

// 左侧菜单导航区
const LeftMenu = ({ MenuItemRouters }) => {
    const [collapsed, setCollapsed] = useState(false); // 菜单收缩状态
    const [width, setWidth] = useState(240); // 菜单宽度
    const navigate = useNavigate();
    const onSelect = (e) => {
        // console.log('click ', e);
        navigate(e.key)
    };
    const setCollapsedFn = () => {
        setCollapsed(!collapsed);
        if (collapsed) {
            setWidth(240);
        } else {
            setWidth(80);
        }
    }
    const location = useLocation();
    useEffect(() => {
        // 开发环境，开始严格模式StrictMode，会打印两次
        // console.log('useEffect');
    }, [])
    return (
        <div className='leftMenu' style={{ width: width, height: '100%' }}>
            <div className='menuLogoBox'>
                <img
                    className='menuLogo'
                    src={userImg}
                    alt="logo"
                    onClick={setCollapsedFn} // 点击图片收缩菜单
                />
            </div>
            <Menu
                style={{ flex: 1 }}
                selectedKeys={[location.pathname]} // 选中菜单项
                mode="inline"
                theme="dark"
                items={MenuItemRouters}
                inlineCollapsed={collapsed}
                onSelect={onSelect}
            />
        </div>
    )
}

export default LeftMenu
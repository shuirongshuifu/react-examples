import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './ContextMenu.module.css';

// 菜单项组件
const MenuItem = ({ menu, onMenuItemClick }) => {
    const handleClick = (e) => {
        if (menu.disabled) {
            console.warn('菜单项禁用，点击不触发事件动作');
            return;
        }
        menu.onClick(menu, e); // 触发父组件（最外层）的点击事件
        onMenuItemClick?.(); // 点击后关闭菜单
    };

    return (
        <div
            className={`${styles.menuItem} ${menu.disabled ? styles.disabled : ''}`}
            data-disabled={menu.disabled}
            onClick={handleClick}
        >
            {/* 菜单图标 */}
            {menu.icon && (
                <div className={styles.menuItemIcon}>
                    {React.createElement(menu.icon)}
                </div>
            )}
            {/* 菜单文本 */}
            {menu.label && (
                <div className={styles.menuItemLabel}>
                    {menu.label}
                </div>
            )}
        </div>
    );
};

// 主右键菜单组件
const ContextMenu = ({ children, menus = [] }) => {
    const [menuInfo, setMenuInfo] = useState({
        show: false,
        x: 0,
        y: 0
    });

    const menuRef = useRef(null);
    const menuWrapRef = useRef(null);
    const margin = 36; // 菜单与视口边缘的最小间距

    // 计算菜单正确位置
    const calculateMenuPosition = useCallback((clientX, clientY, actualWidth, actualHeight) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = clientX;
        let y = clientY;

        // 水平边界检查
        if (x + actualWidth + margin > viewportWidth) {
            x = viewportWidth - actualWidth - margin;
        }

        // 垂直边界检查  
        if (y + actualHeight + margin > viewportHeight) {
            y = viewportHeight - actualHeight - margin;
        }

        // 确保菜单不超出左/上边界
        x = Math.max(margin, x);
        y = Math.max(margin, y);

        return { x, y };
    }, [margin]);

    // 处理右键菜单逻辑
    const handleContextMenu = useCallback(async (e) => {
        e.preventDefault(); // 阻止浏览器默认右键菜单
        e.stopPropagation(); // 阻止事件冒泡，避免触发外部关闭逻辑

        const clickX = e.clientX; // 获取点击的x坐标
        const clickY = e.clientY; // 获取点击的y坐标

        // 首先在屏幕外先显示菜单以获取实际尺寸
        setMenuInfo({
            show: true,
            x: -9999,
            y: -9999
        });

        // 然后，再等待下一个事件循环，确保DOM已渲染（相当于vue的nexttick）
        await new Promise((resolve) => setTimeout(resolve, 0));

        if (menuWrapRef.current) {
            const rect = menuWrapRef.current.getBoundingClientRect();
            const actualWidth = rect.width;
            const actualHeight = rect.height;

            // 计算菜单的正确位置并重新定位
            const { x, y } = calculateMenuPosition(clickX, clickY, actualWidth, actualHeight);

            // 最后，再在正确的右键菜单点击的位置，显示出来菜单（从可视区域外，到可视区域里）
            setMenuInfo({
                show: true,
                x,
                y
            });
        }
    }, [calculateMenuPosition]);

    // 关闭菜单
    const closeMenu = useCallback((e) => {
        // 检查点击的是否是菜单内部的元素
        const isMenuClick = e.target.closest('#contextMenuWrap');

        // 如果点击的是菜单内部，不关闭菜单（让菜单项自己处理）
        if (isMenuClick) {
            return;
        }

        // 点击菜单外部，关闭菜单
        setMenuInfo(prev => ({ ...prev, show: false }));
    }, []);

    // 菜单项点击处理
    const handleMenuItemClick = useCallback(() => {
        setMenuInfo(prev => ({ ...prev, show: false }));
    }, []);

    // 监听事件和取消监听事件
    useEffect(() => {
        const menuElement = menuRef.current;
        if (!menuElement) return;

        menuElement.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', closeMenu, true);
        window.addEventListener('contextmenu', closeMenu, true);
        window.addEventListener('scroll', closeMenu, true);

        return () => {
            menuElement.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', closeMenu, true);
            window.removeEventListener('contextmenu', closeMenu, true);
            window.removeEventListener('scroll', closeMenu, true);
        };
    }, [handleContextMenu, closeMenu]);

    // 创建Portal到body（Vue中的<teleport to="body">也是这个意思）
    const menuPortal = ReactDOM.createPortal(
        <div
            className={`${styles.menuWrap} ${menuInfo.show ? styles.show : ''}`}
            id="contextMenuWrap"
            ref={menuWrapRef}
            style={{ left: `${menuInfo.x}px`, top: `${menuInfo.y}px` }}
        >
            {menus.map((menu, index) => (
                <MenuItem
                    key={index}
                    menu={menu}
                    onMenuItemClick={handleMenuItemClick}
                />
            ))}
        </div>,
        document.body
    );

    return (
        <div className={styles.contextMenu} ref={menuRef}>
            {children}
            {menuInfo.show && menuPortal}
        </div>
    );
};

export default ContextMenu;
import ContextMenu from './ContextMenu'

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const RightMenu = () => {
    const menus = [
        {
            label: '新增新增新增新增新增新增新增新增新增新增新增新增新增新增新增^_^',
            icon: PlusOutlined,
            onClick: (menu, e) => {
                console.log('新增', menu);
            }
        },
        {
            label: '编辑',
            icon: EditOutlined,
            onClick: (menu, e) => {
                console.log('编辑', menu);
            },
        },
        {
            label: '删除',
            icon: DeleteOutlined,
            onClick: (menu, e) => {
                console.log('删除', menu);
            },
            disabled: true
        }
    ];

    return (
        <div className="boxWrap">
            <ContextMenu menus={menus}>
                <div style={{ height: '100vh', border: '1px solid #666' }}>
                    我是box
                </div>
            </ContextMenu>
        </div>
    );
};


export default RightMenu;
import './TopHeader.css'; // 引入样式文件
import { Select, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GithubIcon from '@/components/GithubIcon/GithubIcon'; // 假设你有一个GithubIcon组件

export default function TopHeader({ MenuItemRouters }) {
    const [value, setValue] = useState('/'); // 默认选中项
    const location = useLocation();
    const navigate = useNavigate();
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        navigate(value);
        setValue(value);
    };
    useEffect(() => {
        // console.log('location', location.pathname);
        setValue(location.pathname);
    }, [location.pathname]);
    return (
        <div className='TopHeader'>
            <Space wrap>
                <Select
                    showSearch
                    optionFilterProp="label"
                    value={value}
                    style={{ width: 180 }}
                    onChange={handleChange}
                    fieldNames={{ label: 'label', value: 'key' }}
                    options={MenuItemRouters}
                />
            </Space>
            <Space wrap>
                <a href="https://github.com/shuirongshuifu/react-examples" target='_blank'><GithubIcon></GithubIcon></a>
            </Space>
        </div>
    )
}
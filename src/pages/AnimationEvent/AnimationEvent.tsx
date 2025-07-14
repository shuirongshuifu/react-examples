import React, { useRef, useEffect, useState } from 'react'
import { Input, Button, InputRef } from 'antd';


const AnimationEvent: React.FC = () => {
    const [val, setVal] = useState<string>('初始值');

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        console.log('useEffect实例', inputRef?.current?.input?.value);
    }, [val])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setVal(target.value);
    }

    const clickBtn = () => {
        console.log('点击按钮提交数据', val);
    }

    return (
        <div>
            <h2>请输入文字，至少五个字符</h2>
            <Input value={val} ref={inputRef} onChange={onChange} placeholder="请输入" style={{ width: 240 }} />
            <br />
            <Button onClick={clickBtn} style={{ marginTop: '12px' }} type="primary">提交</Button>
        </div>
    )
}

export default AnimationEvent

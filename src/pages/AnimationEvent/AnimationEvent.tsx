import React, { useRef, useEffect, useState } from 'react'
import { Input, Button, InputRef } from 'antd';
import './AnimationEvent.css'
import classNames from 'classnames'

const AnimationEvent: React.FC = () => {
    const [val, setVal] = useState<string>('初始值');
    const [err, setErr] = useState<'' | 'warning' | 'error' | undefined>('');
    const [isDisabledBtn, setIsDisabledBtn] = useState<boolean>(false);

    const inputRef = useRef<InputRef>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setVal(target.value);
    }

    useEffect(() => {
        const handleAnimationStart = () => {
            console.log('动画开始');
            setIsDisabledBtn(true);
        }

        const handleAnimationIteration = () => {
            console.log('动画迭代');
        }

        const handleAnimationEnd = () => {
            console.log('动画结束');
            setVal('') // 清空输入框
            setErr('') // 清空错误提示
            setIsDisabledBtn(false); // 取消按钮禁用
        }

        inputContainerRef.current?.addEventListener('animationstart', handleAnimationStart)
        inputContainerRef.current?.addEventListener('animationiteration', handleAnimationIteration)
        inputContainerRef.current?.addEventListener('animationend', handleAnimationEnd)
        return () => {
            inputContainerRef.current?.removeEventListener('animationstart', handleAnimationStart)
            inputContainerRef.current?.removeEventListener('animationiteration', handleAnimationIteration)
            inputContainerRef.current?.removeEventListener('animationend', handleAnimationEnd)
        }
    }, [])

    const clickBtn = () => {
        if (val.trim().length < 5) {
            setErr('error')
            return
        }
        alert('提交成功')
    }

    return (
        <div>
            <h2>动画事件的应用场景举例</h2>
            <h3>请输入文字，至少五个字符</h3>
            <div className={classNames('inputContainer', { 'errorInput': err })} ref={inputContainerRef}>
                <Input status={err} value={val} ref={inputRef} onChange={onChange} placeholder="请输入" style={{ width: 240 }} />
                {err && <div className='errorText'>请输入至少五个字符</div>}
            </div>
            <br />
            <Button onClick={clickBtn} style={{ marginTop: '12px' }} type="primary" disabled={isDisabledBtn}>提交</Button>
        </div>
    )
}

export default AnimationEvent

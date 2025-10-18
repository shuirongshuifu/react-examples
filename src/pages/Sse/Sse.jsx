import React, { useState, useEffect, useRef } from 'react'
import { Button, Progress } from 'antd'
import './Sse.css'

export default function Sse() {
    const [articleText, setArticleText] = useState('') // 文章内容
    const currentTextRef = useRef('') // 存储打字机效果中累积的文本内容
    const [progress, setProgress] = useState(0) // sse返回的进度
    const [isStreaming, setIsStreaming] = useState(false) // 是否正在接收
    const eventSourceRef = useRef(null) // sse链接实例
    const typeWriterTimerRef = useRef(null) // 定时器的id，用于清理定时器
    const promiseChainRef = useRef(Promise.resolve()) // Promise链

    // 清理函数
    useEffect(() => {
        return () => {
            // 组件卸载清理关闭sse连接和定时器
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
            if (typeWriterTimerRef.current) {
                clearInterval(typeWriterTimerRef.current)
            }
        }
    }, [])

    // 打字机效果返回Promise，确保顺序执行
    const typeWriter = (text) => {
        return new Promise((resolve) => {
            let index = 0
            const interval = setInterval(() => {
                // 组件被卸载了，停止打字机效果
                if (!typeWriterTimerRef.current) {
                    clearInterval(interval)
                    return
                }
                // 定时器循环赋值刷新UI，直到赋值完成，再执行resolve
                if (index < text.length) {
                    currentTextRef.current += text[index]
                    setArticleText(currentTextRef.current)
                    index++
                } else {
                    clearInterval(interval)
                    typeWriterTimerRef.current = null
                    resolve()
                }
            }, 50)
            typeWriterTimerRef.current = interval
        })
    }

    // 开始SSE连接
    const startSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        // 重置状态
        currentTextRef.current = ''
        setArticleText('')
        setProgress(0)
        setIsStreaming(true)
        promiseChainRef.current = Promise.resolve() // 重置Promise链

        // 创建SSE连接
        const eventSource = new EventSource('https://ashuai.site/fastify-api/sse/article/66')
        eventSourceRef.current = eventSource

        // 监听后端自定义的start事件
        eventSource.addEventListener('start', (event) => {
            const data = JSON.parse(event.data)
            console.log('SSE开始:', data)
        })

        // 监听后端自定义的chunk事件
        eventSource.addEventListener('chunk', (event) => {
            const data = JSON.parse(event.data)
            console.log('接收到的数据:', data)

            // 链式调用：等前一个完成后再执行，这样能够确保前一句话完成，再执行下一句话
            promiseChainRef.current = promiseChainRef.current
                .then(() => typeWriter(data.content))
                .then(() => setProgress(data.progress))
        })

        // 监听后端自定义的end事件
        eventSource.addEventListener('end', (event) => {
            const data = JSON.parse(event.data)
            setIsStreaming(false)
            console.log('SSE结束:', data)

            // 关闭连接
            eventSource.close()
            eventSourceRef.current = null
        })

        // 监听后端自定义的error事件
        eventSource.addEventListener('error', (event) => {
            console.error('SSE错误:', event)
            setIsStreaming(false)

            if (eventSourceRef.current) {
                eventSourceRef.current.close()
                eventSourceRef.current = null
            }
            // 也可以加上定时器重连机制
        })
    }

    // 取消SSE连接
    const cancelSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
        }
        if (typeWriterTimerRef.current) {
            clearInterval(typeWriterTimerRef.current)
            typeWriterTimerRef.current = null
        }
        setIsStreaming(false)
        promiseChainRef.current = Promise.resolve()
    }

    return (
        <div>
            <div className="article-container">
                <div className="article-text">
                    {articleText}
                    {/* 当正在接收时，使用span元素模拟鼠标光标 */}
                    {isStreaming && <span className="cursor"></span>}
                </div>
            </div>
            <Progress percent={progress} />
            <Button
                type="primary"
                onClick={startSSE}
                disabled={isStreaming}
            >
                {isStreaming ? '正在接收...' : '开始接收'}
            </Button>
            <Button onClick={cancelSSE} disabled={!isStreaming}>{isStreaming ? '取消链接' : '未曾链接'}</Button>
        </div>
    )
}
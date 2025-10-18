import React, { useState, useRef, useEffect } from 'react'
import { Button, Progress } from 'antd'
import './Sse2.css'

export default function Sse2() {
    const [articleText, setArticleText] = useState('') // 显示在界面上的文章内容
    const [progress, setProgress] = useState(0) // 当前加载进度（0-100）
    const [isStreaming, setIsStreaming] = useState(false) // 标记是否正在接收数据流
    const currentTextRef = useRef('') // 打字机效果中实时累积的文本内容（缓存）
    const typeWriterTimerRef = useRef(null) // 打字机定时器的 ID，用于在需要时清理定时器
    const promiseChainRef = useRef(Promise.resolve()) // Promise 链，确保多个打字机效果按顺序执行，不会乱序
    const abortControllerRef = useRef(null) // 用于中断 fetch 请求的控制器

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            if (typeWriterTimerRef.current) {
                clearInterval(typeWriterTimerRef.current)
            }
        }
    }, [])

    const typeWriter = (text) => {
        return new Promise((resolve) => {
            let index = 0 // 当前要显示的字符索引
            const interval = setInterval(() => {
                // 安全检查：如果组件已卸载（定时器被清除），停止执行
                if (!typeWriterTimerRef.current) {
                    clearInterval(interval)
                    return
                }
                
                // 还有字符没显示完，继续逐个添加
                if (index < text.length) {
                    currentTextRef.current += text[index] // 累积文本到 ref 中
                    setArticleText(currentTextRef.current) // 更新界面显示
                    index++ // 移动到下一个字符
                } else {
                    // 所有字符都显示完了，清理定时器并通知 Promise 完成
                    clearInterval(interval)
                    typeWriterTimerRef.current = null
                    resolve() // 告诉外部：这段文本显示完了，可以显示下一段了
                }
            }, 50) // 每 50ms 显示一个字符
            
            typeWriterTimerRef.current = interval // 保存定时器 ID，方便后续清理
        })
    }

    /**
     * 处理从服务器接收到的分块数据
     * @param {Object} data - 服务器返回的数据对象
     * 
     * 数据类型说明：
     * - type: 'chunk' -> 文章内容片段，需要用打字机效果显示
     * - type: 'end' -> 传输结束标记
     * - type: 'error' -> 错误信息
     */
    const handleChunkedData = async (data) => {
        // 情况1：接收到一段文章内容
        if (data.type === 'chunk') {
            promiseChainRef.current = promiseChainRef.current
                .then(() => typeWriter(data.content))   // 先等上一段显示完
                .then(() => setProgress(data.progress)) // 再更新进度条
            return
        }

        // 情况2：接收到结束标记
        if (data.type === 'end') {
            // 等待所有文本都显示完成后，再标记传输结束
            // 这样不会出现文本还没显示完，按钮就变成可点击的情况
            promiseChainRef.current = promiseChainRef.current.then(() => {
                setIsStreaming(false)
            })
            return
        }

        // 情况3：服务器返回了错误
        if (data.type === 'error') {
            throw new Error(data.message || '服务器返回错误')
        }
    }

    /**
     * 使用 fetch + ReadableStream 接收服务器的流式数据
     * 
     * 流式传输的优势：
     * 1. 数据边接收边显示，不用等所有数据到达后才显示
     * 2. 类似于 ChatGPT 的效果，用户体验更好
     * 3. 可以处理大量数据，不会一次性占用太多内存
     */
    const startChunkedStream = async () => {
        // 如果之前有未完成的请求，先取消掉
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // 创建新的取消控制器，用于取消这次请求
        abortControllerRef.current = new AbortController()

        // 重置所有状态，准备接收新数据
        currentTextRef.current = ''      // 清空缓存的文本
        setArticleText('')               // 清空界面显示
        setProgress(0)                   // 进度归零
        setIsStreaming(true)             // 标记为正在接收
        promiseChainRef.current = Promise.resolve() // 重置 Promise 链

        try {
            // 向服务器发起请求
            const response = await fetch('https://ashuai.site/fastify-api/sse/article2/1', {
                signal: abortControllerRef.current.signal // 传入取消控制器，可随时中断请求
            })

            // 检查请求是否成功
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            // 获取响应体的读取器（用于读取流式数据）
            const reader = response.body.getReader()
            // 创建文本解码器（将二进制数据转换为文本）
            const decoder = new TextDecoder()
            // 缓冲区：用于存储不完整的数据
            let buffer = ''

            // 循环读取数据流
            while (true) {
                // 读取一块数据
                const { done, value } = await reader.read()

                // 如果数据读取完毕，退出循环
                if (done) {
                    break
                }

                // 将二进制数据解码成文本
                const chunk = decoder.decode(value, { stream: true })
                buffer += chunk // 累积到缓冲区

                // 按行分割数据（服务器每次发送一个完整的 JSON 对象，以换行符分隔）
                const lines = buffer.split('\n')
                
                // 处理每一行数据（除了最后一行，因为最后一行可能不完整）
                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim()
                    // 忽略空行和 '0'（'0' 是 chunked 编码的结束标记）
                    if (line && line !== '0') {
                        try {
                            // 将 JSON 字符串解析为对象
                            const data = JSON.parse(line)
                            // 处理这条数据（显示文本、更新进度等）
                            await handleChunkedData(data)
                        } catch (e) {
                            // 如果解析失败，忽略这条数据，继续处理下一条
                        }
                    }
                }

                // 将不完整的行保留在缓冲区中，等待下次接收数据时拼接
                const lastNewlineIndex = buffer.lastIndexOf('\n')
                if (lastNewlineIndex !== -1) {
                    buffer = buffer.substring(lastNewlineIndex + 1)
                }
            }

        } catch (error) {
            // 处理错误
            if (error.name === 'AbortError') {
                console.log('传输已取消')
            } else {
                console.error('Chunked传输错误:', error)
            }
            setIsStreaming(false)
        } finally {
            // 无论成功或失败，都清空取消控制器
            abortControllerRef.current = null
        }
    }

    /**
     * 取消正在进行的流式传输
     * 需要清理三个东西：
     * 1. 网络请求
     * 2. 打字机定时器
     * 3. Promise 链
     */
    const cancelStream = () => {
        // 1. 取消网络请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
        
        // 2. 停止打字机效果
        if (typeWriterTimerRef.current) {
            clearInterval(typeWriterTimerRef.current)
            typeWriterTimerRef.current = null
        }
        
        // 3. 更新状态
        setIsStreaming(false)
        
        // 4. 重置 Promise 链
        promiseChainRef.current = Promise.resolve()
    }

    return (
        <div style={{ width: '720px' }}>
            {/* 文章显示区域 */}
            <div className="article-container">
                <div className="article-text">
                    {articleText}
                    {/* 当正在接收时，显示一个闪烁的光标，模拟打字效果 */}
                    {isStreaming && <span className="cursor"></span>}
                </div>
            </div>
            <Progress percent={progress} />
            <Button
                type="primary"
                onClick={startChunkedStream}
                disabled={isStreaming}  // 正在接收时禁用，避免重复点击
            >
                {isStreaming ? '正在接收...' : '开始接收'}
            </Button>
            
            <Button onClick={cancelStream} disabled={!isStreaming}>
                {isStreaming ? '取消传输' : '未在传输'}
            </Button>
        </div>
    )
}
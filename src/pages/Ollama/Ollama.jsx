import { useState } from 'react'
import axios from 'axios'
import { Input } from 'antd'
import styles from './Ollama.module.css'

export default function Ollama() {
    const [messages, setMessages] = useState([]) // 存储对话数据
    const [inputValue, setInputValue] = useState('') // 输入框内容
    const [isLoading, setIsLoading] = useState(false) // 加载状态

    // 发请求
    const sendApiRequest = () => {
        if (!inputValue.trim()) return // 如果输入为空，不发送请求

        const userMessage = inputValue.trim()
        setIsLoading(true)

        // 添加用户消息到对话数据
        setMessages(prev => [...prev, { type: 'user', content: userMessage }])
        setInputValue('') // 清空输入框

        axios.post('/ollama/api/generate', {
            model: "qwen2.5:0.5b",
            prompt: userMessage,
            stream: false
        }).then((response) => {
            const { response: aiResponse } = response.data
            // 添加AI回复到对话数据
            setMessages(prev => [...prev, { type: 'ai', content: aiResponse }])
            setIsLoading(false)
        }).catch((error) => {
            setMessages(prev => [...prev, { type: 'error', content: JSON.stringify(error) }])
            setIsLoading(false)
        })
    }

    // 处理输入框按键事件
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendApiRequest()
        }
    }

    return (
        <div>
            <h3>Ollama调用大模型</h3>

            {/* 对话区 */}
            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {messages.length === 0 ? (
                        <div className={styles.emptyMessage}>
                            暂无数据，请开始与AI对话吧！🤔🤔🤔
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${styles[message.type]}`}
                            >
                                <div className={styles.messageContent}>
                                    {message.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 输入区 */}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleKeyPress}
                placeholder="输入问题，回车发送"
                disabled={isLoading}
            />
        </div>
    )
}
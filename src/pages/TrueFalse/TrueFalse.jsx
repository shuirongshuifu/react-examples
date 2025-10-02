import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from 'antd'
import errorAudio from '../../assets/audio/trueFalse/error.mp3'
import rightAudio from '../../assets/audio/trueFalse/right.mp3'

/**
 * 音频播放自定义 Hook
 * @param {string} audioFile - 音频文件路径
 * @returns {Object} 返回音频控制的状态和方法
 * @returns {boolean} isPlaying - 是否正在播放
 * @returns {boolean} isLoading - 是否正在加载音频
 * @returns {string|null} error - 错误信息
 * @returns {Function} playAudio - 播放音频方法
 * @returns {Function} stopAudio - 停止播放方法
 */
function useAudioContext(audioFile) {
    // 创建 AudioContext 实例（惰性初始化，只创建一次）
    // 用于处理和控制音频播放，兼容 webkit 浏览器
    const [audioContext] = useState(() => new (window.AudioContext || window.webkitAudioContext)())
    
    // 使用 ref 存储音频源节点，避免不必要的重新渲染
    // 音频源节点的变化不需要触发组件更新
    const sourceNodeRef = useRef(null)
    
    // 播放状态：控制 UI 显示和按钮状态
    const [isPlaying, setIsPlaying] = useState(false)
    
    // 加载状态：显示加载动画，防止重复加载
    const [isLoading, setIsLoading] = useState(false)
    
    // 错误信息：用于展示错误提示
    const [error, setError] = useState(null)
    
    // 音频缓冲数据：解码后的音频数据，可重复播放
    const [audioBuffer, setAudioBuffer] = useState(null)

    /**
     * 加载音频文件
     * 使用 useCallback 避免在 useEffect 中造成无限循环
     * 依赖项：audioFile 改变时重新加载，audioContext 保持不变
     */
    const loadAudio = useCallback(async () => {
        if (!audioFile || !audioContext) {
            setError('音频文件必传或浏览器不支持')
            return
        }

        try {
            setIsLoading(true)
            setError(null) // 清除之前的错误
            
            // 1. 获取音频文件
            const response = await fetch(audioFile)
            if (!response.ok) throw new Error('网络请求失败')
            
            // 2. 转换为 ArrayBuffer 格式
            const arrayBuffer = await response.arrayBuffer()
            
            // 3. 解码音频数据为可播放的格式
            const audioData = await audioContext.decodeAudioData(arrayBuffer)
            
            // 4. 保存解码后的音频数据
            setAudioBuffer(audioData)
        } catch (err) {
            setError('加载音频失败: ' + err.message)
            console.error('音频加载错误:', err)
        } finally {
            // 无论成功或失败都要结束加载状态
            setIsLoading(false)
        }
    }, [audioFile, audioContext])

    /**
     * 播放音频
     * 使用 useCallback 缓存函数，避免每次渲染创建新函数
     * 依赖项：audioBuffer 和 audioContext
     */
    const playAudio = useCallback(() => {
        // 检查音频数据是否已加载
        if (!audioBuffer || !audioContext) {
            setError('音频未加载完成')
            return
        }

        // 如果有正在播放的音频，先停止
        // 避免多个音频同时播放造成混乱
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop(0)
            sourceNodeRef.current = null
        }

        try {
            // 创建新的音频源节点（每次播放都需要新建）
            const newSourceNode = audioContext.createBufferSource()
            
            // 设置音频数据
            newSourceNode.buffer = audioBuffer
            
            // 连接到音频输出设备（扬声器/耳机）
            newSourceNode.connect(audioContext.destination)

            // 监听播放结束事件
            newSourceNode.onended = () => {
                setIsPlaying(false)
                sourceNodeRef.current = null
            }

            // 开始播放（参数 0 表示立即播放）
            newSourceNode.start(0)
            
            // 保存节点引用，用于后续控制
            sourceNodeRef.current = newSourceNode
            setIsPlaying(true)
        } catch (err) {
            setError('播放失败: ' + err.message)
            console.error('播放错误:', err)
        }
    }, [audioBuffer, audioContext])

    /**
     * 停止播放音频
     * 依赖数组为空，因为使用 ref 访问 sourceNode，不需要依赖状态
     */
    const stopAudio = useCallback(() => {
        if (sourceNodeRef.current) {
            try {
                // 立即停止播放
                sourceNodeRef.current.stop(0)
                sourceNodeRef.current = null
                setIsPlaying(false)
            } catch (err) {
                console.error('停止错误:', err)
            }
        }
    }, [])

    /**
     * 组件挂载时加载音频，卸载时清理资源
     */
    useEffect(() => {
        // 加载音频文件
        loadAudio()

        // 清理函数：组件卸载时执行
        return () => {
            // 停止并清理音频源节点
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop(0)
                sourceNodeRef.current = null
            }
            
            // 关闭 AudioContext，释放系统资源
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close().catch(console.error)
            }
        }
    }, [loadAudio])

    // 返回外部需要的状态和方法
    return {
        isPlaying,    // 播放状态
        isLoading,    // 加载状态
        error,        // 错误信息
        playAudio,    // 播放方法
        stopAudio     // 停止方法
    }
}

function TrueFalse() {
    // 使用自定义 Hook 管理两个音频
    const correctAudio = useAudioContext(rightAudio)
    const incorrectAudio = useAudioContext(errorAudio)

    return (
        <div>
            <h2>回答正确或错误播放对应音频</h2>

            <Button
                onClick={correctAudio.isPlaying ? correctAudio.stopAudio : correctAudio.playAudio}
                disabled={correctAudio.isLoading || !!correctAudio.error}
                type={correctAudio.isPlaying ? 'default' : 'primary'}
                loading={correctAudio.isLoading}
                style={{ marginRight: '10px' }}
            >
                {correctAudio.isPlaying ? '停止播放' : '回答正确'}
            </Button>

            <Button
                onClick={incorrectAudio.isPlaying ? incorrectAudio.stopAudio : incorrectAudio.playAudio}
                disabled={incorrectAudio.isLoading || !!incorrectAudio.error}
                type={incorrectAudio.isPlaying ? 'default' : 'primary'}
                danger
                loading={incorrectAudio.isLoading}
            >
                {incorrectAudio.isPlaying ? '停止播放' : '回答错误'}
            </Button>

            {(correctAudio.error || incorrectAudio.error) && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                    错误：{correctAudio.error || incorrectAudio.error}
                </p>
            )}
        </div>
    )
}

export default TrueFalse
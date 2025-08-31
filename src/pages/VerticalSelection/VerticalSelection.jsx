import { useState, useRef, useEffect } from 'react'
import styles from './VerticalSelection.module.css'

export default function VerticalSelection() {
    const [selectArr, setSelectArr] = useState([]) // 存放选中的项
    const [isMouseDown, setIsMouseDown] = useState(false) // 鼠标是否按下
    const listBoxRef = useRef(null) // dom引用实例，用于绑定事件
    const isCtrlPressedRef = useRef(false) // 是否按下ctrl键

    // 监听全局Ctrl键是否按下
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Control') {
                isCtrlPressedRef.current = true
            }
        }
        const handleKeyUp = (e) => {
            if (e.key === 'Control') {
                isCtrlPressedRef.current = false
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    const handleMouseDown = (e) => {
        if (e.target.dataset?.['disabled'] === 'true') {
            console.warn('此单元格已经被禁用，不可使用')
            return
        }
        if (!isCtrlPressedRef.current) {
            console.warn('若想进行多选操作，请按下ctrl键')
            return
        }
        const whichIndex = e.target.dataset.index;
        if (!whichIndex) return
        const whichItem = list[Number(whichIndex)];
        if (!whichItem) return
        setIsMouseDown(true)
        setSelectArr((prev) => {
            const isExist = prev.some(item => item.id === whichItem.id)
            if (!isExist) { // 不存在就是新的项，就添加，若项存在则不操作
                return [...prev, whichItem]
            }
            return prev
        })
    }

    const handleMouseMove = (e) => {
        // 需要满足按住Ctrl键后，鼠标按下才可以多选操作
        if (!isMouseDown || !isCtrlPressedRef.current) return
        const whichIndex = e.target.dataset.index;
        if (!whichIndex) {
            return
        }
        const whichItem = list[Number(whichIndex)];
        if (!whichItem) {
            return
        }
        if (whichItem.disabled) {
            console.warn('此单元格已经被禁用，不可使用')
            return
        }
        setSelectArr((prev) => {
            // 多选只追加
            const isExist = prev.some(item => item.id === whichItem.id)
            if (!isExist) {
                return [...prev, whichItem]
            }
            return prev
        })
    }

    const handleMouseUp = (e) => {
        setIsMouseDown(false)
    }

    const handleMouseLeave = (e) => {
        setIsMouseDown(false)
    }

    useEffect(() => {
        const listBoxDom = listBoxRef.current
        if (!listBoxDom) return

        listBoxDom.addEventListener('mousedown', handleMouseDown)
        listBoxDom.addEventListener('mousemove', handleMouseMove)
        listBoxDom.addEventListener('mouseup', handleMouseUp)
        listBoxDom.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            listBoxDom.removeEventListener('mousedown', handleMouseDown)
            listBoxDom.removeEventListener('mousemove', handleMouseMove)
            listBoxDom.removeEventListener('mouseup', handleMouseUp)
            listBoxDom.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave])

    const list = [
        { name: '孙悟空', id: '1' },
        { name: '猪八戒', id: '2' },
        { name: '沙和尚', id: '3', disabled: true },
        { name: '唐僧', id: '4' },
        { name: '白龙马', id: '5' },
        { name: '白骨精', id: '6' },
        { name: '玉兔精', id: '7' },
        { name: '嫦娥', id: '8' },
        { name: '二郎神', id: '9' },
    ]

    const clickItem = (e, item) => {
        if (item.disabled) return
        setSelectArr((prev) => {
            // 不存在则追加，存在则去掉
            const isExist = prev.some((pr) => pr.id === item.id)
            if (!isExist) {
                return [...prev, item]
            } else {
                return prev.filter((pr) => pr.id !== item.id)
            }
        })
    }

    const clearSelect = (e) => {
        e.preventDefault() // 右键清空所有选中
        setSelectArr([])
    }

    // 是否选中，要看这一项中的id在不在选中数组中里面
    const isCurSelected = (item) => selectArr.some((s) => s.id === item?.id)

    // 是否当前项和下一项，同时被选中
    const isCurAndNextBothSelected = (item, index) => {
        if (index === list.length - 1) {
            return false
        }
        if (!isCurSelected(item)) {
            return false
        } else {
            const nextItem = list[index + 1]
            return isCurSelected(nextItem)
        }
    }

    return (
        <div>
            <h3>竖向选中</h3>
            <p style={{ fontSize: '13px' }}>已选中：{selectArr.map(s => s.name).join('、')}</p>
            <div className={styles.listBox} onContextMenu={clearSelect} ref={listBoxRef}>
                {list.map((item, index) =>
                    <div onClick={(e) => clickItem(e, item)}
                        className={`
                            ${styles.item} 
                            ${item.disabled && styles.disabled} 
                            ${isCurSelected(item) ? styles.hl : ''}
                            ${isCurAndNextBothSelected(item, index) ? styles.curAndNextSelected : ''}
                        `}
                        key={item.id}
                        data-disabled={item.disabled}
                        data-index={index}
                    >
                        {item.name}
                    </div>)
                }
            </div>
        </div>
    )
}
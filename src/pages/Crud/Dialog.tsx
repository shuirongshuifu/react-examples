import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal } from 'antd';

const Dialog = forwardRef((_, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [row, setRow] = useState<Record<string, any>>({});

    const handleOk = () => {
        setIsModalOpen(false);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }

    useImperativeHandle(ref, () => ({
        openDialog: (row: Record<string, any>) => {
            row && setRow(row);
            setIsModalOpen(true);
        }
    }))


    return <div>
        <Modal open={isModalOpen} title={row.id ? '编辑' : '新增'} onOk={handleOk} okText="确定" cancelText="取消"
            onCancel={handleCancel}>
            <p>{row.name}</p>
            <p>{row.age}</p>
        </Modal>
    </div>
})

export default Dialog;
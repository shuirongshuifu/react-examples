import React, { memo, useState } from 'react'
import { Button, Input, message, Modal } from 'antd';
import { downExcelTempFn, restoreDataFn, uploadExcelFn, selectDeleteFn, selectExportFn } from '@/api/crud/crud';
import { downloadFile } from '@/utils';

const Btns: React.FC<{ selectedRowKeys: number[], update: Function }> = ({ selectedRowKeys, update }) => {

    const clickDownExcelTemplate = async () => {
        try {
            const res = await downExcelTempFn();
            downloadFile(res, '模板.xlsx');
        } catch (error) {
            console.error('下载失败:', error);
        }
    }

    const clickRestoreData = async () => {
        try {
            const res = await restoreDataFn();
            if (res.code === 0) {
                message.success('恢复成功');
                update('');
            } else {
                message.error(res.data);
            }
        } catch (error) {
            console.error('恢复失败:', error);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            update(e.currentTarget.value);
        }
    }

    const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            const res = await uploadExcelFn(formData);
            if (res.code === 0) {
                message.success('上传成功');
                update('');
            } else {
                message.error(res.data);
            }
        }
    }

    const clickSelectExport = async () => {
        const res = await selectExportFn(selectedRowKeys.join(','));
        downloadFile(res, '导出.xlsx');
    }

    const clickSelectDelete = async () => {
        Modal.confirm({
            title: '确定删除吗？',
            onOk: async () => {
                const res = await selectDeleteFn(selectedRowKeys.join(','));
                if (res.code === 0) {
                    message.success(res.data);
                    update('');
                } else {
                    message.error(res.msg);
                }
            }
        });
    }

    return (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
                <Button type="primary">新增</Button>
                <Button type="primary" onClick={clickSelectExport} disabled={selectedRowKeys.length === 0}>勾选导出</Button>
                <Button type="primary" onClick={clickSelectDelete} disabled={selectedRowKeys.length === 0}>删除勾选</Button>
                <Button type="primary" onClick={clickDownExcelTemplate}>下载模板</Button>
                {/* 上传文件 */}
                <Button type="primary" onClick={() => document.getElementById('uploadExcel')?.click()}>上传</Button>
                <input id="uploadExcel" type="file" style={{ display: 'none' }} onChange={handleUploadExcel} accept=".xlsx,.xls" multiple={false} />
                <Button type="primary" onClick={clickRestoreData}>一键恢复</Button>
                <Input style={{ width: 240 }} placeholder='回车搜索' onKeyDown={handleKeyDown} allowClear />
            </div>
        </div>
    )
}

// 使用memo包裹组件，防止组件重复渲染
export default memo(Btns) 
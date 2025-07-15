import { get, post } from '../api/api';

interface queryInfo {
    pageIndex: number;
    pageSize: number;
    sortWord: string;
    sortOrder: string;
    searchWord: string;
}

interface res {
    code: number;
    data: any;
    msg: string;
}

// 获取表格数据
export const getTableDataFn = (queryInfo: queryInfo) => {
    return get('/getTableData', queryInfo) as Promise<res>;
}

// 获取总条数
export const getTotalCountFn = (queryInfo: queryInfo) => {
    return get('/getTotalCount', queryInfo) as Promise<res>;
}

// 下载模板
export const downExcelTempFn = () => {
    return get('/downExcelTemp', {}, {
        responseType: 'blob'
    }) as Promise<Blob>;
}

// 恢复数据
export const restoreDataFn = () => {
    return get('/recover') as Promise<res>;
}

// 删除单条数据
export const deleteDataFn = (id: number) => {
    return get('/deleteData', { id }) as Promise<res>;
}

// 删除多条数据
export const selectDeleteFn = (ids: string) => {
    return get('/selectDelete', { ids }) as Promise<res>;
}

// 上传文件
export const uploadExcelFn = (file: FormData) => {
    return post('/uploadExcel', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }) as Promise<res>;
}

// 勾选导出
export const selectExportFn = (ids: string) => {
    return post('/exportExcel', { ids }, {
        responseType: 'blob'
    }) as Promise<Blob>;
}

// 新增数据
export const addDataFn = (data: Record<string, any>) => {
    return post('/addData', data) as Promise<res>;
}

// 编辑数据
export const editDataFn = (data: Record<string, any>) => {
    return post('/editData', data) as Promise<res>;
}
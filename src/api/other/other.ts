import { get } from '../api/api';

interface res {
    code: number;
    data: any;
    msg: string;
}

// 获取下拉框选项
export const getOptionsFn = () => {
    return get('/op2') as Promise<res>;
}
export interface QueryInfo {
    pageIndex: number;
    pageSize: number;
    sortWord: string;
    sortOrder: string;
    searchWord: string;
}

export interface ColumnType {
    id: number;
    name: string;
    age: number;
    home: string;
    remark: string;
    is_delete_status: number;
    ctime: string;
}

export const restColumns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
},
{
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    sorter: true,
},
{
    title: '地址',
    dataIndex: 'home',
    key: 'home',
    sorter: true,
},
{
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    sorter: true,
},
{
    title: '创建时间',
    dataIndex: 'ctime',
    key: 'ctime',
    sorter: true,
}]
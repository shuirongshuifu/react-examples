import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Pagination, Button, Modal, message } from 'antd';
import type { TableProps } from 'antd';
import { getTableDataFn, getTotalCountFn, deleteDataFn, addDataFn, editDataFn } from '@/api/crud/crud';
import { QueryInfo, ColumnType, restColumns } from './data';
import Btns from './Btns';
import Dialog from './Dialog';

const Crud: React.FC = () => {

  const columns: TableProps<ColumnType>['columns'] = [
    {
      title: '序号',
      width: 72,
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1 + (queryInfo.pageIndex - 1) * queryInfo.pageSize,
    },
    ...restColumns,
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => <div style={{ display: 'flex' }}>
        <Button type="link" onClick={() => editRow(record)}>编辑</Button>
        <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
      </div>,
    }
  ];

  const [tableData, setTableData] = useState<ColumnType[]>([]);

  const [queryInfo, setQueryInfo] = useState<QueryInfo>({
    pageIndex: 1,
    pageSize: 10,
    sortWord: 'id',
    sortOrder: 'DESC',
    searchWord: '',
  });

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const dialogRef = useRef<any>(null);

  useEffect(() => {
    fetchData();
  }, [queryInfo]);

  const fetchData = async () => {
    setLoading(true);
    const res = await getTableDataFn(queryInfo);
    if (res.code === 0) {
      setTableData(res.data);
    }
    const res2 = await getTotalCountFn(queryInfo);
    if (res2.code === 0) {
      setTotal(res2.data);
    }
    setLoading(false);
  };

  const handleTableChange = (_: any, __: any, sorter: any) => {
    const { field, order } = sorter;
    if (!order) return;
    setQueryInfo({ ...queryInfo, sortWord: field, sortOrder: order === 'ascend' ? 'ASC' : 'DESC' });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryInfo({ ...queryInfo, pageIndex: page, pageSize: pageSize });
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const rowSelection: TableProps<ColumnType>['rowSelection'] = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    },
  };

  const update = useCallback((value: string) => {
    setQueryInfo(prev => ({ ...prev, searchWord: value }));
  }, [queryInfo.searchWord]);

  const editRow = (record: ColumnType) => {
    console.log('editRow', record);
    dialogRef.current.openDialog(JSON.parse(JSON.stringify(record)));
  }

  const handleAdd = (record: Record<string, any>) => {
    console.log('handleAdd', record);
    addDataFn(record).then(res => {
      if (res.code === 0) {
        message.success('新增成功');
        dialogRef.current.closeDialog();
        fetchData();
      } else {
        message.error(res.data);
      }
    });
  }

  const handleEdit = (record: Record<string, any>) => {
    editDataFn(record).then(res => {
      if (res.code === 0) {
        message.success('编辑成功');
        dialogRef.current.closeDialog();
        fetchData();
      } else {
        message.error(res.data);
      }
    });
  }

  const handleDelete = (record: ColumnType) => {
    Modal.confirm({
      title: '确定删除吗？',
      onOk: async () => {
        const res = await deleteDataFn(record.id);
        if (res.code === 0) {
          message.success('删除成功');
          fetchData();
        } else {
          message.error(res.data);
        }
      }
    });
  }

  const addOpenDialog = () => {
    dialogRef.current.openDialog();
  }
  return <div style={{ width: '96%' }}>
    <Btns selectedRowKeys={selectedRowKeys} update={update} addOpenDialog={addOpenDialog} />
    <Table<ColumnType>
      columns={columns}
      dataSource={tableData}
      rowKey="id"
      pagination={false}
      onChange={handleTableChange}
      scroll={{ y: '64vh' }}
      rowSelection={rowSelection}
      loading={loading}
    />
    <Pagination
      style={{ marginTop: 10 }}
      current={queryInfo.pageIndex}
      pageSize={queryInfo.pageSize}
      total={total}
      showTotal={(total) => `共 ${total} 条数据`}
      showQuickJumper
      onChange={handlePageChange}
      showSizeChanger
    />
    <Dialog ref={dialogRef} handleAdd={handleAdd} handleEdit={handleEdit}/>
  </div>
};

export default Crud;
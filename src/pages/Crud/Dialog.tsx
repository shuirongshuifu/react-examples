import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal } from 'antd';
import type { FormProps } from 'antd';
import { Button, Form, Input, InputNumber } from 'antd';

const { TextArea } = Input;

type FieldType = {
    name?: string;
    age?: number;
    home?: string;
    remark?: string;
    [key: string]: any;
};

// 定义 ref 暴露的方法类型
type DialogRef = {
    openDialog: (row?: Record<string, any>) => void;
};

// 定义组件 props 类型
type DialogProps = {
    handleAdd: (values: FieldType) => void;
    handleEdit: (values: FieldType) => void;
};

const Dialog = forwardRef<DialogRef, DialogProps>(({ handleAdd, handleEdit }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        openDialog: (row?: Record<string, any>) => {
            setIsModalOpen(true);
            if (row) {
                // 编辑赋值数据
                console.log('编辑赋值数据', row);
                form.setFieldsValue(row)
            } else {
                // 新增重置字段值
                form.resetFields();
            }
        },
        closeDialog() {
            setIsModalOpen(false);
        }
    }))
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        // handleAdd(values);

        const allValues = form.getFieldsValue(true);
        console.log('allValues', allValues)

        allValues.id ? handleEdit(allValues) : handleAdd(allValues);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.warn('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    return <div>
        <Modal open={isModalOpen} title={'操作'} okText="确定" cancelText="关闭" footer={null} onCancel={() => setIsModalOpen(false)}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
                preserve={true}
            >
                <Form.Item<FieldType>
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: '请输入姓名' }]}
                >
                    <Input allowClear maxLength={8} showCount />
                </Form.Item>

                <Form.Item<FieldType>
                    label="年龄"
                    name="age"
                    rules={[{ required: true, message: '请输入年龄' }]}
                >
                    <InputNumber max={999} min={0} maxLength={3} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="家乡"
                    name="home"
                    rules={[{ required: true, message: '请输入家乡' }]}
                >
                    <Input allowClear maxLength={12} showCount />
                </Form.Item>

                <Form.Item<FieldType>
                    label="备注"
                    name="remark"
                    rules={[{ required: true, message: '请输入备注' }]}
                >
                    <TextArea allowClear maxLength={24} showCount />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    &nbsp;&nbsp;
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    </div>
})

export default Dialog;
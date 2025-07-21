import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Radio, Checkbox, DatePicker, Button, Row, Col } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 表单类型映射
const FormItemMap = {
    input: Input, // 文本输入框
    textarea: Input.TextArea, // 文本域
    select: Select, // 下拉选择
    radio: Radio.Group, // 单选框
    checkbox: Checkbox.Group, // 多选框
    date: DatePicker, // 日期选择
    dateRange: RangePicker, // 日期范围选择
    // 可扩展的表单项类型
};

// JSON配置化表单组件
const MyForm = forwardRef(({ config, onFinish, onFinishFailed, initialValues = {}, rowProps = {}, colProps = {} }, ref) => {

    /**
     * 创建表单实例，用于控制表单的状态
     *  form.setFieldsValue(values)：设置表单字段值
     *  form.validateFields()：手动触发表单校验
     *  form.resetFields()：重置表单字段
     *  form.submit()：触发表单提交
     * */
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        submit: () => {
            form.submit();
        },
        resetFields: () => {
            form.resetFields();
        }
    }));

    // 根据传递的JSON数组配置项，渲染对应表单类型项
    const renderFormItems = () => {
        return (
            <Row gutter={16} {...rowProps}>
                {config.map((item) => {
                    const {
                        key,
                        label,
                        type = 'input', // 默认输入框，若是不填写type类型的话
                        rules = [], // 校验规则
                        options = [], // 下拉框，单选框，多选框的选项数组
                        fieldProps = {}, // 表单项的属性
                        formItemProps = {},
                        defaultValue, // 表单项的默认值，比如默认性别男
                        colSpan = 24, // 默认占满一行
                        colStyle = {},
                    } = item;

                    const FormItemComponent = FormItemMap[type] || Input; // 根据type类型，获取对应的表单项组件

                    // 处理选项类型组件，比如下拉框，单选框，多选框
                    const renderOptions = () => {
                        if (type === 'select' || type === 'radio') {
                            return options.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ));
                        }

                        if (type === 'checkbox') {
                            return options.map(option => (
                                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                            ));
                        }

                        return null;
                    };

                    // 处理特殊组件属性
                    const getComponentProps = () => {
                        const props = { ...fieldProps };

                        if (type === 'radio' || type === 'checkbox') {
                            props.options = options;
                        }

                        return props;
                    };

                    return (
                        <Col key={key} span={colSpan} style={colStyle} {...colProps}>
                            <Form.Item
                                label={label}
                                name={key}
                                rules={rules}
                                initialValue={defaultValue}
                                {...formItemProps}
                            >
                                {type === 'select' || type === 'radio' || type === 'checkbox' ? (
                                    <FormItemComponent {...getComponentProps()}>
                                        {/* 带选项的组件，比如单选框，多选框，下拉框，还需再渲染选项 */}
                                        {renderOptions()}
                                    </FormItemComponent>
                                ) : (
                                    // 不带选项的组件，比如输入框，文本域，日期选择，日期范围选择，直接渲染组件
                                    <FormItemComponent {...getComponentProps()} />
                                )}
                            </Form.Item>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    return (
        <Form
            form={form}
            name="jsonForm"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {renderFormItems()}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    搜索
                </Button>
                <Button style={{ marginLeft: 8 }} htmlType="reset">
                    重置
                </Button>
            </Form.Item>
        </Form>
    );
});

export default MyForm;
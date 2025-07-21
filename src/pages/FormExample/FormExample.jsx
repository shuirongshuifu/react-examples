import MyForm from '@/components/MyForm/MyForm'
import dayjs from 'dayjs';
import { getOptionsFn } from '@/api/other/other';
import { useState, useEffect, useRef } from 'react';

const FormExample = () => {

    const formRef = useRef(null);

    const [options, setOptions] = useState([]);
    useEffect(() => {
        getOptionsFn().then(res => {
            if (res.code == '0') {
                const _options = res.data.map((item, index) => ({ key: index, label: item.na, value: item.va }));
                setOptions(_options);
                console.log('options', options);
            }
        });
    }, []);

    const formConfig = [
        {
            type: 'input', // 表单项的类型
            key: 'username', // 表单项的key，存储对应字段值
            label: '姓名', // 表单项的label
            colSpan: 8, // 表单项的栅格布局宽度
            rules: [{ required: true, message: '请输入姓名' }], // 表单项的校验规则
            // 单纯给组件用的属性，比如专门给Input组件用的属性
            fieldProps: {
                placeholder: '请输入姓名',
                allowClear: true,
                prefix: '😀',
                suffix: '😄',
                maxLength: 10,
                showCount: true,
            },
            // 专门给Form.Item用的属性（注意，Form.Item再往里走一层才是单纯的组件，比如Input组件）
            formItemProps: {
                colon: false, // 不显示label后面的冒号
                tooltip: '用户名必须唯一', // 显示提示信息
                extra: '支持中英文，长度2-20', // 显示额外信息
                // 表单项的默认值
                initialValue: '孙悟空',
            }
        },
        {
            type: 'radio',
            key: 'gender',
            label: '性别',
            colSpan: 8,
            colStyle: {
                textAlign: 'center',
                fontWeight: 'lighter',
            },
            options: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
                { label: '保密', value: 'secret' },
            ],
            /**
             * 注意，formItemProps.initialValue和defaultValue都可以设置默认值
             * 但是，如果两个都设置了，那么formItemProps.initialValue会优先级更高
             * 参见MyForm组件的initialValue={defaultValue}和{...formItemProps}
             * 后者会覆盖前者，类似于formItemProps兜底对象，类似于vue的attr
             * --------------------------------------------------------------
             * 建议使用formItemProps.initialValue作为初始值
             * */
            defaultValue: 'male',
            formItemProps: {
                // 表单项的默认值
                initialValue: 'female',
                layout: 'vertical', // horizontal 水平布局，vertical 垂直布局
            }
        },
        {
            // 注意，如果是只有两三个选项，那么使用radio或checkbox更合适
            type: 'checkbox',
            key: 'hobbies',
            label: '爱好',
            colSpan: 8,
            options: [
                { label: '读书', value: 'reading' },
                { label: '运动', value: 'sports' },
                { label: '音乐', value: 'music' },
            ],
        },
        {
            type: 'date',
            key: 'birthday',
            label: '出生日期',
            colSpan: 8,
            fieldProps: {
                showTime: false, // 不显示时间 时分秒
                placeholder: '请选择出生日期',
                allowClear: true,
            },
            formItemProps: {
                // 日期初始值设置这里使用dayjs或者momentjs都可以
                initialValue: dayjs('2025-07-01', 'YYYY-MM-DD'),
            }
        },
        {
            type: 'dateRange',
            key: 'registerTime',
            label: '注册时间',
            colSpan: 16,
            fieldProps: {
                showTime: true, // 显示时间 时分秒
                placeholder: ['开始日期', '结束日期'],
                allowClear: true,
            },
            formItemProps: {
                // 日期初始值设置这里使用dayjs或者momentjs都可以
                initialValue: [dayjs('2025-07-21 10:00:00', 'YYYY-MM-DD HH:mm:ss'), dayjs('2025-07-22 10:00:00', 'YYYY-MM-DD HH:mm:ss')],
            }
        },
        {
            type: 'textarea',
            key: 'address',
            label: '地址',
            colSpan: 8,
            fieldProps: {
                rows: 2,
                placeholder: '请输入地址',
            },
        },
        {
            // 大于等于4个选项，使用select更合适
            type: 'select',
            key: 'city',
            label: '城市',
            colSpan: 8,
            options: [
                { label: '北京', value: 'beijing' },
                { label: '上海', value: 'shanghai' },
                { label: '广州', value: 'guangzhou' },
                { label: '深圳', value: 'shenzhen' },
            ],
        },
        {
            // 大于等于4个选项，使用select更合适
            type: 'select',
            key: 'carBand',
            label: '车辆品牌',
            colSpan: 8,
            fieldProps: {
                placeholder: '请选择车辆品牌',
                mode: 'multiple',
            },
            // 发请求拿数据，然后设置options
            options: options,
        },
    ];

    /**
     * 子组件调用父组件传递过去的onFinish方法
     * */ 
    const onFinish = (values) => {
        // 加工birthday日期字段
        if (values.birthday && values.birthday.format) {
            /**
             * DatePicker组件会把选中的日期以 dayjs 对象的形式返回。
             * 需要我们自己加工一下，变成字符串，然后提交给后端
             * */
            values.birthday = values.birthday.format('YYYY-MM-DD');
        }
        // 加工registerTime日期范围字段
        if (values.registerTime && values.registerTime.length > 0) {
            values.registerTime = values.registerTime.map(item => item.format('YYYY-MM-DD HH:mm:ss'));
        }
        console.log('发请求给后端:', values);
    };

    const onFinishFailed = (errorInfo) => console.error('表单提交失败:', errorInfo);

    return (
        <div>
            <MyForm 
                ref={formRef}
                config={formConfig}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed} />
            <br />
            <br />
            <button onClick={() => formRef.current.submit()}>外部搜索</button>&nbsp;&nbsp;
            <button onClick={() => formRef.current.resetFields()}>外部重置</button>
        </div>
    )
}

export default FormExample
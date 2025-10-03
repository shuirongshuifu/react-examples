import React, { useEffect } from 'react'
import exampleImg from '@/assets/img/example.png'
import { message } from 'antd'

export default function ImagePoint() {
    useEffect(() => {
        // 确保 jQuery 和 maphilight 已加载
        if ($ && $.fn.maphilight) {
            // 初始化maphilight，使用正确的选择器
            $('.example-image').maphilight({
                fill: true,          // 填充区域
                fillOpacity: 0.3,    // 填充透明度（0.3为半透明）
                // 为true的话，会初始高亮，为false的话，则是悬浮高亮
                // alwaysOn: true,
                alwaysOn: false,
            });
        }
    }, []);

    const showPathInfo = (pathName) => {
        message.info(pathName);
    };

    return (
        <>
            <h2>图片区域打点</h2>
            <p>鼠标悬停在图片的矩形、多边形、圆形区域上查看高亮效果，点击查看信息</p>
            <img
                src={exampleImg}
                alt="example"
                className="example-image"
                useMap="#pathMap"
                style={{ width: 'fit-content', height: 'auto' }}
            />
            <map name="pathMap" id="pathMapID">
                <area
                    shape="rect"
                    coords="84,188,200,255"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showPathInfo('矩形区域'); }}
                    alt="矩形"
                    title="矩形区域"
                />
                <area
                    shape="circle"
                    coords="752,221,72"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showPathInfo('圆形区域'); }}
                    alt="圆形"
                    title="圆形区域"
                />
                <area
                    shape="poly"
                    coords="439,158,513,284,366,284"
                    href="#"
                    onClick={(e) => { e.preventDefault(); showPathInfo('多边形区域'); }}
                    alt="多边形"
                    title="多边形区域"
                />
            </map>
        </>
    )
}
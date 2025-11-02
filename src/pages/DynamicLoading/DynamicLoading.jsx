import masonryUrl from "@/assets/js/masonry.js?url";
import { useEffect } from "react";

const DynamicLoading = () => {

    useEffect(() => {
        loadMasonry().then(() => {
            console.log('Masonry加载成功可打印', window.Masonry);
        });

        loadUnderscore().then(() => {
            console.log('underscore loaded', window._);
        })
    }, []);

    // 使用import语法动态加载
    const loadUnderscore = () => {
        return new Promise((resolve, reject) => {
            import('@/assets/js/underscore.js').then(module => {
                resolve();
            }).catch(error => {
                reject();
            });
        });
    }

    // 使用script标签动态加载
    const loadMasonry = () => {
        return new Promise((resolve, reject) => {
            // 判断是否已经加载
            if (window.Masonry) {
                // console.log('masonry already loaded');
                resolve();
                return;
            }
            // 创建新的script标签
            const script = document.createElement('script');
            script.src = masonryUrl;
            script.onload = () => {
                // console.log('masonry loaded');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load masonry'));
            };
            document.body.appendChild(script);
        });
    };

    return <div>
        <ul>
            <li>方式一（script）：传统但灵活、适合CDN和特殊场景</li>
            <li>方式二（import）：现代化、适合模块化项目</li>
        </ul>
    </div>;
};

export default DynamicLoading;
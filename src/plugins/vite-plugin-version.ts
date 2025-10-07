// vite-plugin-version.js
import fs from 'fs';
import path from 'path';

/**
 * Vite插件：生成版本信息文件
 * 在构建开始时读取package.json中的版本号，并生成包含版本和构建时间的JSON文件
 */
export default function versionPlugin() {
    return {
        name: 'version-plugin',
        /* Vite 构建开始时的钩子函数 */
        buildStart() {
            // 只在生产环境才去生成版本文件
            if (process.env.NODE_ENV !== 'production') {
                return;
            }

            // 1. 读取package.json文件对象里面的version版本号
            const pkgPath = path.resolve(process.cwd(), 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

            // 2. 准备新版本信息和新版本构建时间
            const versionInfo = {
                // 使用这次发布的package.json版本号，如从0.0.0到0.0.1
                version: pkg.version,
                buildTime: new Date().toLocaleString('zh-CN')
            };

            // 3. 写入public目录
            const publicDir = path.resolve(process.cwd(), 'public');
            // 不存在则创建
            if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

            // 4. 将版本信息写入version.json文件
            fs.writeFileSync(
                path.join(publicDir, 'version.json'),
                JSON.stringify(versionInfo, null, 2) // 缩进2个空格
            );

            console.log(`😁😁😁 版本文件已生成: v${pkg.version}`);
        }
    };
}
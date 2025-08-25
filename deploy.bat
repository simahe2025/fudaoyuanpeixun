@echo off
echo ====================================
echo 辅导员培训网站 - GitHub部署脚本
echo ====================================

echo.
echo 正在初始化Git仓库...
git init

echo.
echo 添加远程仓库...
git remote add origin https://github.com/simahe2025/fudaoyuanpeixun.git

echo.
echo 添加所有文件到Git...
git add .

echo.
echo 提交文件...
git commit -m "feat: 网站优化版本2.0

- 🎨 完全重新设计的现代化UI界面
- 📱 全新响应式布局，完美支持移动端
- ♿ 无障碍性改进，支持屏幕阅读器
- 🚀 性能优化，图片懒加载和代码分离  
- 🌙 支持暗色模式和高对比度模式
- 📊 SEO优化和结构化数据
- 🔧 模块化JavaScript架构
- 📝 完善的代码注释和文档

技术栈:
- HTML5语义化标签
- CSS3现代特性 (Grid、Flexbox、自定义属性)
- ES6+现代JavaScript
- 响应式Web设计
- 渐进式增强"

echo.
echo 推送到GitHub主分支...
git branch -M main
git push -u origin main

echo.
echo ====================================
echo 部署完成！
echo 请访问以下链接查看您的网站：
echo GitHub仓库: https://github.com/simahe2025/fudaoyuanpeixun
echo GitHub Pages: https://simahe2025.github.io/fudaoyuanpeixun/
echo ====================================

pause
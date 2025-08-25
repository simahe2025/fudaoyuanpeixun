@echo off
chcp 65001
echo ====================================
echo 辅导员培训网站 - GitHub部署脚本
echo ====================================

echo.
echo 切换到项目目录...
cd /d "C:\Users\Administrator\Nutstore\1\trae\2025\08\项目代码\辅导员培训网站优化"

echo.
echo 当前目录: %CD%

echo.
echo 删除现有.git目录（如果存在）...
if exist .git rmdir /s /q .git

echo.
echo 初始化Git仓库...
git init

echo.
echo 配置Git用户信息...
git config user.name "simahe2025"
git config user.email "simahe2025@users.noreply.github.com"

echo.
echo 添加远程仓库...
git remote add origin https://github.com/simahe2025/fudaoyuanpeixun.git

echo.
echo 添加所有文件到Git...
git add .

echo.
echo 提交文件...
git commit -m "feat: 网站优化版本2.0 - 完全重新设计的现代化UI界面，全新响应式布局，无障碍性改进，性能优化，模块化架构"

echo.
echo 推送到GitHub主分支...
git branch -M main
git push -u origin main --force

echo.
echo ====================================
echo 部署完成！
echo GitHub仓库: https://github.com/simahe2025/fudaoyuanpeixun
echo GitHub Pages: https://simahe2025.github.io/fudaoyuanpeixun/
echo ====================================
echo.

pause
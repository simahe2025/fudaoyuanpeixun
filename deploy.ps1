# 辅导员培训网站 - GitHub部署脚本
Write-Host "====================================" -ForegroundColor Green
Write-Host "辅导员培训网站 - GitHub部署脚本" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# 切换到项目目录
$projectPath = "C:\Users\Administrator\Nutstore\1\trae\2025\08\项目代码\辅导员培训网站优化"
Set-Location $projectPath
Write-Host "当前目录: $(Get-Location)" -ForegroundColor Yellow

# 初始化Git仓库
Write-Host "`n正在初始化Git仓库..." -ForegroundColor Yellow
git init

# 添加远程仓库
Write-Host "`n添加远程仓库..." -ForegroundColor Yellow
git remote add origin https://github.com/simahe2025/fudaoyuanpeixun.git

# 配置Git用户信息（如果需要）
git config user.name "simahe2025"
git config user.email "simahe2025@users.noreply.github.com"

# 添加所有文件
Write-Host "`n添加所有文件到Git..." -ForegroundColor Yellow
git add .

# 提交文件
Write-Host "`n提交文件..." -ForegroundColor Yellow
$commitMessage = @"
feat: 网站优化版本2.0

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
- 渐进式增强
"@

git commit -m $commitMessage

# 设置主分支并推送
Write-Host "`n推送到GitHub主分支..." -ForegroundColor Yellow
git branch -M main
git push -u origin main --force

Write-Host "`n====================================" -ForegroundColor Green
Write-Host "部署完成！" -ForegroundColor Green
Write-Host "请访问以下链接查看您的网站：" -ForegroundColor Cyan
Write-Host "GitHub仓库: https://github.com/simahe2025/fudaoyuanpeixun" -ForegroundColor Cyan
Write-Host "GitHub Pages: https://simahe2025.github.io/fudaoyuanpeixun/" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Green

Write-Host "`n请按任意键继续..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
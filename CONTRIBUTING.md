# 贡献指南

感谢您对辅导员培训班网站项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果您发现了错误或有改进建议，请：

1. 检查 [Issues](https://github.com/simahe2025/fudaoyuanpeixun/issues) 页面，确认问题尚未被报告
2. 创建新的 Issue，请包含：
   - 问题的详细描述
   - 重现步骤
   - 预期行为
   - 实际行为
   - 浏览器和设备信息
   - 截图（如适用）

### 提交代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

#### HTML
- 使用语义化标签
- 添加适当的ARIA属性
- 确保无障碍性
- 使用正确的标题层级

#### CSS
- 使用CSS自定义属性（变量）
- 遵循BEM命名规范
- 确保响应式设计
- 优先使用Flexbox和Grid

#### JavaScript
- 使用ES6+语法
- 添加适当的注释
- 处理错误情况
- 确保性能优化

### 提交信息规范

请使用清晰、描述性的提交信息：

```
类型(范围): 简短描述

详细描述（可选）

关联的Issue（可选）
```

类型包括：
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式修改
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 测试

在提交之前，请确保：
- 在不同浏览器中测试
- 检查响应式设计
- 验证无障碍性
- 确保性能没有明显下降

## 开发环境设置

1. 克隆仓库：
```bash
git clone https://github.com/simahe2025/fudaoyuanpeixun.git
cd fudaoyuanpeixun
```

2. 使用本地服务器运行项目（推荐使用Live Server扩展或Python的http.server）

3. 在浏览器中打开 `http://localhost:8000`

## 文件结构

```
├── index.html          # 主页面
├── css/
│   ├── main.css        # 主样式文件
│   ├── responsive.css  # 响应式样式
│   └── animations.css  # 动画效果
├── js/
│   ├── main.js         # 主脚本文件
│   ├── tabs.js         # 标签切换功能
│   └── utils.js        # 工具函数
├── images/             # 图片资源
└── docs/               # 文档目录
```

## 联系方式

如有疑问，请通过以下方式联系：
- 创建Issue
- 发送邮件至：wanghuilin@gdei.edu.cn

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
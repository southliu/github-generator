# 功能介绍
### 使用一串代码自动生成github page所需的静态文件。
<br />

# 逻辑实现
1. config文件输入目标github项目地址和github page项目地址。
2. 代码根据github项目文件路径生成相对于的树形菜单。
3. 自动打包到github page项目地址上。
<br />

# 文件结构案例
```
前端^
├── JS基础
|   |—— 原型链.md
|   |—— 闭包.md
|   └── Promise.md
└── Vue
    └── Vue-cli.md
后端^
└── Go基础
    └── 基础类型.md
```
<br />

# 功能介绍
### 使用一串代码自动生成github page所需的静态文件。

# 配置说明
* markdown github链接：https://github.com/SouthLiu/blog (url链接，而不是git clone用的链接，确保有main分支)
* page github链接：git@github.com:SouthLiu/test.git (SSH链接，而不是git clone用的链接)

# 逻辑实现
1. config文件输入目标github项目地址和github page项目地址。
2. 下载github项目，并获取文件夹名录，递归渲染md文件。
3. 规划模板文件，根据文件夹目录生成模板菜单数据。
4. 模板文件全局覆盖github page项目。
<br />

# 文件结构
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

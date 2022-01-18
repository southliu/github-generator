## 功能介绍
### 一键生成github风格的免费博客。
## 业务场景
### 当你有用github写markdown文章习惯，我们这套代码可以一键将markdown文章项目转成github page所需静态页面。
```
博客github项目 => github page(免费域名)所需文件 
```

## 操作指令
### 下载操作
```
npm i -g github-generator
```
### 生成并替换代码
```
github start
```
### 配置参数
```
github config
```

## 配置说明
* markdown github链接: https://github.com/SouthLiu/blog (url链接，而不是git clone用的链接，确保有main分支)
* page github链接: git@github.com:SouthLiu/SouthLiu.github.io.git (SSH链接，而不是git clone用的链接)
* title: 个人博客

## 逻辑实现
1. config文件输入目标github项目地址和github page项目地址。
2. 下载github项目，并获取文件夹名录，递归渲染md文件。
3. 规划模板文件，根据文件夹目录生成模板菜单数据。
4. 模板文件全局覆盖github page项目。

## 博客项目
### 图片文件名**不能重复**
```
前端^1
├── JS基础
|   |—— images
|   |—— 原型链^.md
|   |—— 闭包.md
|   └── Promise.md
└── Vue
    |—— images
    └── Vue-cli.md
后端^2
└── Go基础
    |—— images
    └── 基础类型.md
```
## favicon.ico需要放在根目录下
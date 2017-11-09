# 管控台项目 - Beatle Boilerplate Console

在构建应用之前，我们必须先设置好开发环境，如果你的机器上还没有Node.js®和npm，请先安装它们。

> 请先在终端/控制台窗口中运行命令 node -v 和 npm -v， 来验证一下你正在运行 node6.9.x 和 npm 3.x.x 以上的版本。 更老的版本可能会出现错误，更新的版本则没问题。

你在公司内，还需要安装tnpm
```
  npm install -g tnpm registry=http://registry.npm.alibaba-inc.com
```

### 前期工作

1. 具备`React` `React-Router`、`Beatle`基础知识。点击[学习文档](https://lark.alipay.com/dtboost/opoa/framework)
2. 安装CLI工具
```
  tnpm install @ali/honeypack -g
```
3. 启动应用
```
  hoenypack start
```

### 样板库具备的功能

1. 标准管控台界面布局

2. 标准页头

3. 自动加载路由 以及 数据模型
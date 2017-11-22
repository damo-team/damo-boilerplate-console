import React from "react";
import ReactDOM from 'react-dom';
import Damo from 'damo-core';

import setGlobalConfig from './app.config';

// #! 全局app样式，一般来说放主题样式
import './app.less';

// #! 初始化
Damo.init();

// #! 应用配置
setGlobalConfig(Damo);

// 自动加载数据模型
Damo.autoLoadModels(require.context('./models', false, /\w+\.js$/));

// 自动加载路由
Damo.autoLoadRoutes(require.context('./scenes', true, /index\.jsx$/), {strict: false});

Damo.route('*', require('./scenes/feedback/exception'));
// 启动
Damo.run(document.getElementById('main'), window.CONFIG && window.CONFIG.APPNAME);

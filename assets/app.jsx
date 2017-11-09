import React from "react";
import ReactDOM from 'react-dom';
import damo from 'damo-core';

import setGlobalConfig from './app.config';

// #! 全局app样式，一般来说放主题样式
import './app.less';

damo.init();

// 应用配置
setGlobalConfig(damo);

// 自动加载数据模型
damo.autoLoadModels(require.context('./models', false, /\w+\.js$/), require.context('./resources', false, /\w+\.js$/));

// 自动加载全局服务
damo.autoLoadServices(require.context('./services', false, /\w+\.js$/));

// 自动加载路由
damo.autoLoadRoutes(require.context('./scenes', true, /index\.jsx$/), {strict: false});

damo.run();

import React from "react";
import ReactDOM from 'react-dom';
import Beatle from '@ali/beatle';

import setGlobalConfig from './app.config';

// #! 全局app样式，一般来说放主题样式
import './app.less';

const app = new Beatle();

setGlobalConfig(app);

// 自动加载数据模型
app.loadModels(require.context('./models', false, /\w+\.js$/), require.context('./resources', false, /\w+\.js$/));

app.loadRoutes(require.context('./scenes', true, /index\.jsx$/), {strict: false});

app.run();

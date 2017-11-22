import notification from 'antd/lib/notification';
export default function setGlobalConfig(app){

  // 模拟接口
  if (process.env.NODE_ENV === 'development' && window.location.search.indexOf('debug=true') > -1) {
    const Mocky = require('./devtool/mocker');
    Mocky.Api = app.Api;
    window.mocker = new Mocky();
    app.Api.preFetch = (ajaxOptions) => {
      const option = window.mocker.setParams(ajaxOptions, {
        getName(ajaxOptions){
          return ajaxOptions.url.split('/devtool/mockData/')[1].split('/')[0];
        },
        getId(ajaxOptions){
          const mt =  ajaxOptions.url.match(/\:id/);
          if(mt){
            return mt[0];
          }else{
            const paths = ajaxOptions.url.split('/');
            return ['query', 'list'].indexOf(paths[paths.length - 2]) === -1;
          }
        }
      });
      ajaxOptions.url = `/assets/devtool/schemas/${option.name}.json`;
      ajaxOptions.path = option.path;
      return ajaxOptions;
    }
  }else{
    app.Api.preFetch = (ajaxOptions) => {
      ajaxOptions.url = (window.CONFIG && window.CONFIG.APPNAME || '/assets/') + ajaxOptions.url.slice(0, -1) + '.json';
      return ajaxOptions;
    }
  }

  // #! 接口请求报错统一处理
  app.Api.processData = (res, ajaxOptions) => {
    if (window.mocker) {
      res = window.mocker.mock(res, ajaxOptions.path);
    }
    if (res instanceof Promise) {
      return res.then(app.Api.processData);
    } else if(res.code && res.code !== 'SUCCESS'){
      let message = res.message || '接口错误, 无错误消息';
      if (Object(message) === message){
          message = JSON.stringify(message);
      }
      notification.error({
        message: res.code || 'NO_ERROR_CODE',
        description: message,
        duration: 6
      });   
      return false;
    }else{
      return res.data;
    }
  }
}


import notification from 'antd/lib/notification';
export default function setGlobalConfig(app){
  
  // #! 接口请求报错统一处理
  app.Api.checkStatus = res => {
    if(res.code && res.code !== 'SUCCESS'){
      return false;
    }
  }
}

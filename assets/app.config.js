import notification from 'antd/lib/notification';
export default function setGlobalConfig(app){
  
  // #! 接口请求报错统一处理
  app.Api.checkStatus = res => {
    if(!res.code || res.code !== 'SUCCESS'){
      let message = res.message || '接口错误, 无错误消息';
      if (Object(message) === message){
          message = JSON.stringify(message);
      }
      notification.error({
        message: error.code || 'NO_ERROR_CODE',
        description: message,
        duration: 6
      });   
      return false;
    }
  }
}

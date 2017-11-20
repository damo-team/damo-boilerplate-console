import Damo from 'damo-core';

export default class User extends Damo.BaseModel{
  static initialState = {
    profile: {}
  }

  getUser(params){
    this.setState({
      profile: {
        response: Damo.Api({
          url: '../assets/devtool/mockData/account/',
          method: 'get',
          data: params
        })
      }
    });
  }
}

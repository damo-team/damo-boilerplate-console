import damo from 'damo-core';

export default class User extends damo.BaseModel{
  static initialState = {
    profile: {}
  }

  getUser(){
    this.setState({
      profile: {
        response: damo.Api.get('https://api.github.com/users/baqian')
      }
    })
  }
}

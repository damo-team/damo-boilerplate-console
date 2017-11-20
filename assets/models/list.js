import Damo from 'damo-core';

export default class List extends Damo.BaseModel{
  static initialState = {
    list: {
      data: [],
      metric: {
        loading: true,
        total: 0
      }
    },
    item: {}
  }

  getList(params){
    return this.setState({
      list: {
        response: Damo.Api({
          url: '../assets/devtool/mockData/todo_list/query/', 
          method: 'get',
          data: params
        }),
        change: (res) => {
          return {
            data: res.data,
            metric: {
              total: res.total,
              loading: false
            }
          }
        }
      }
    });
  }

  getItem(params){
    return this.setState({
      item: {
        response: Damo.Api({
          url: '../assets/devtool/mockData/todo_list/:id/', 
          method: 'get',
          data: params
        })
      }
    });
  }
}

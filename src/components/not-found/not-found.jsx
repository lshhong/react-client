//404组件
import React, {Component} from 'react';
import {Button} from 'antd-mobile'

export default class NotFound extends Component {
  render(){
    return(
      <div>
        <p className="not-found">找不到对应的网页</p>
        <Button type="primary" onClick={()=>this.props.history.replace('/')}>返回首页</Button>
      </div>
    )
  }
}


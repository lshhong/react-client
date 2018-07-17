import React, {Component} from 'react';
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile'

import Logo from '../../components/logo/logo'

export default class Login extends Component{
  //定义初始化状态
  state = {
    username:'',
    password:'',
  }
  handleChange = (name,val) =>{
    this.setState({
      [name]:val
    })
  }

  register = ()=>{
    console.log(this.state);
  }

  goLogin = ()=>{
    //跳转到登录界面
    this.props.history.replace("/register")
  }

  render(){
    return (
      <div>
        <NavBar>用户登录</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={val=>this.handleChange('username',val)}>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder='请输入密码' onChange={val=>this.handleChange('password',val)}>密码:</InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.goLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
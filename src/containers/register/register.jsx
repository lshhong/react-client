import React, {Component} from 'react';
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Radio,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {register} from "../../redux/actions";
import Logo from '../../components/logo/logo'

class Register extends Component{
  //定义初始化状态
  state = {
    username:'',
    password:'',
    password1:'',
    type:'dashen'
  }
  handleChange = (name,val) =>{
    this.setState({
      [name]:val
    })
  }

  register = ()=>{
    console.log(this.state);
    this.props.register(this.state)
  }

  goLogin = ()=>{
    //跳转到登录界面
    this.props.history.replace("/login")
  }

  render(){
    const {type} = this.state;
    const {msg, redirectTo} = this.props.user;
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>用户注册</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            <p className='error-msg'>{msg}</p>
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={val=>this.handleChange('username',val)}>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder='请输入密码' onChange={val=>this.handleChange('password',val)}>密码:</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder='请确认输入密码' onChange={val=>this.handleChange('password1',val)}>确认密码:</InputItem>
            <WhiteSpace/>
            <List.Item>
              <span>用户类型:</span>&nbsp;&nbsp;
              <Radio checked={type==="dashen"} onChange={()=>this.handleChange("type","dashen")}>大神</Radio>&nbsp;&nbsp;&nbsp;
              <Radio checked={type==="laoban"} onChange={()=>this.handleChange("type","laoban")}>老板</Radio>
            </List.Item>
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

export default connect(
  state=>({user:state.user}),
  {register}
)(Register)


/*
大神信息完善路由组件
*/
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar,WingBlank,InputItem,List,TextareaItem,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from "../../redux/actions";

class DashenInfo extends Component {
  state ={
    header:'',
    post:'',
    info:''
  }

  handleChange = (name,value)=>{
    this.setState({
      [name]:value
    })
  }
  setHeader =(header)=>{
    this.setState({header})
  }
  save = ()=>{
    this.props.updateUser(this.state)
  }
  render(){
    const {header} = this.props.user;
    if(header){//用户信息已完善
      return <Redirect to='/laoban'/>
    }
    return(
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <WingBlank>
          <List>
            <InputItem placeholder="请输入求职岗位" onChange={value =>this.handleChange("post",value)}>求职岗位:</InputItem>
            <TextareaItem title="个人介绍" onChange={value =>this.handleChange("info",value)} rows={3}/>
            <Button type="primary" onClick={this.save}>保存</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state=>({user:state.user}),
  {updateUser}
)(DashenInfo)
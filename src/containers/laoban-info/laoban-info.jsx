/*
老板信息完善路由组件
*/
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar,WingBlank,InputItem,List,TextareaItem,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import {updateUser} from '../../redux/actions'
import HeaderSelector from '../../components/header-selector/header-selector'

class LaobanInfo extends Component {
  state ={
    header:'',
    post:'',
    company:'',
    info:'',
    salary:''
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
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <WingBlank>
          <List>
            <InputItem placeholder="请输入招聘职位" onChange={value =>this.handleChange("post",value)}>招聘职位:</InputItem>
            <InputItem placeholder="请输入公司名称" onChange={value =>this.handleChange("company",value)}>公司名称:</InputItem>
            <InputItem placeholder="请输入职位薪资" onChange={value =>this.handleChange("salary",value)}>职位薪资:</InputItem>
            <TextareaItem title="职位要求" onChange={value =>this.handleChange("info",value)} rows={3}/>
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
)(LaobanInfo)
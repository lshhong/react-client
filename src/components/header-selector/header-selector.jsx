/*
用户头像选择组件
*/
import React, {Component} from 'react';
import {Grid,List} from 'antd-mobile';
import PropTypes from 'prop-types';


export default class HeaderSelector extends Component {
  state = {
    icon:null//需要显示的图片对象
  }

  static propTypes ={
    setHeader:PropTypes.func.isRequired
  };

  selectHeader = ({text,icon}) =>{
    // debugger
    //更新父组件状态,保存头像名
    this.props.setHeader(text)
    //保存头像图片对象
    this.setState({icon})
  };


  render(){
    const headerList=[];
    for(var i =0; i < 20; i++){
      const text = "头像" + (i + 1);
      headerList.push({
        text,
        icon:require(`./imgs/${text}.png`)
      })
    }
    const {icon} =this.state;
    const header = icon ? <span>已选择头像<img src={icon}/></span> : "请选择头像:";
    return(
      <List renderHeader={()=>header}>
        <Grid columnNum={5}
        onClick={this.selectHeader}
        data={headerList}/>
      </List>
    )
  }
}






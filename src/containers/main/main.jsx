import React, {Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom'
import {NavBar} from 'antd-mobile'
import Cookies from 'js-cookie'
import {connect} from 'react-redux'

import {getUser} from '../../redux/actions'
import {getRedirectTo} from '../../utils'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'

class Main extends Component{

  // 给组件对象添加一个属性navList: 后面访问: this.navList
  navList = [
    {
      path: '/laoban', // 路由路径
      component: Laoban,
      title: '大神列表',
      icon: 'dashen',
      text: '大神',
    },
    {
      path: '/dashen', // 路由路径
      component: Dashen,
      title: '老板列表',
      icon: 'laoban',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]
  componentDidMount(){
    //当前没有登录过,但前面登录过==>发ajax请求获取用户信息
    const id = this.props.user._id;
    const userid =  Cookies.get('userid');
    if(!id && userid){
      this.props.getUser()
    }
  }

  render(){
    // 1. 如果从来没有登陆过(cookie中没有userid), 自动跳转到login
    const userid = Cookies.get('userid');
    if(!userid){
      return <Redirect to="/login"/>
    }
    // 2. 登陆过(cookie中有userid), 但当前还没有登陆(state.user._id没有), 需要实现自动登陆(发请求获取当前user)
    const {user, unReadCount} = this.props;
    if(!user._id){
      //render中不能发送ajax请求
      return null
    }

    // 3. 当前已经登陆了, 如果请求的是根路径: '/', 自动跳转到对应的路由(getRedirectTo())
    //得到当前请求的路径
    const path = this.props.location.pathname
    if(path ==="/"){
      return <Redirect to={getRedirectTo(user.type,user.header)}/>
    }

    //从navList中得到nav         //find(): 返回一个回调函数返回true的元素
    const currentNav = this.navList.find(function(nav,index){
      return path === nav.path
    })
    // console.log(currentNav);
    //根据用户类型决定隐藏哪个nav
    const {navList} = this
    if(user.type ==="dashen"){
      navList[0].hide = true;
    }else{
      navList[1].hide = true
    }

    return (
      <div>
        {currentNav ? <NavBar className="fix-top">{currentNav.title}</NavBar> : null}
        <Switch>
          <Route path="/laobaninfo" component={LaobanInfo}/>
          <Route path="/dasheninfo" component={DashenInfo}/>
          <Route path="/laoban" component={Laoban}/>
          <Route path="/dashen" component={Dashen}/>
          <Route path="/message" component={Message}/>
          <Route path="/personal" component={Personal}/>
          <Route path="/chat/:userid" component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        {currentNav ? <NavFooter unReadCount={unReadCount} navList={navList}/> : null}
      </div>
    )
  }
}

export default connect(
  state=>({user:state.user,unReadCount:state.chat.unReadCount}),
  {getUser}
)(Main)
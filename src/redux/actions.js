/*
包含n个action creator函数的模块
同步action:对象( 与action type 一一对应)
异步action:函数
*/

// 引入客户端io
import io from 'socket.io-client'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_CHAT_MSGS,
  RECEIVE_CHAT_MSG,
  CHAT_MSG_READ
} from './actions-types';

import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUsers,
  reqChatMsgList,
  reqReadChatMsg
} from '../api'

//成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
//失败的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
//接收用户同步action
const recieveUser = (user) =>({type:RECEIVE_USER,data:user});
//重置用户同步action
export const resetUser = (msg) =>({type:RESET_USER,data:msg});
//接收用户同步列表action
const receiveUserList = (userList) =>({type:RECEIVE_USER_LIST,data:userList})
//接收消息列表的同步action
const receiveChatMsgs = ({users,chatMsgs,meId}) =>({type:RECEIVE_CHAT_MSGS,data:{users,chatMsgs,meId}})
//接收一条消息的同步action
const receiveChatMsg = (chatMsg ,meId) =>({type:RECEIVE_CHAT_MSG,data:{chatMsg , meId}})
// 一个聊天的消息更新为已读了
const chatMsgRead = ({from, to, count}) => ({type: CHAT_MSG_READ, data: {from, to, count}})

//注册的异步action
//1.执行异步代码(发ajax请求)
//2.有了结果以后分发一个同步action
export function register(user) {
  const {username, password, password1, type} = user;
  // 进行前台表单验证, 如果不通过, 分发失败的同步action对象
  if (!username) {
    return errorMsg("必须指定用户名")
  } else if (!password) {
    return errorMsg("必须指定用户密码")
  } else if (password !== password1) {
    return errorMsg("两次密码必须一致")
  } else if (!type) {
    return errorMsg("必须指定用类型")
  }


  return async dispatch => {
    //1.执行异步代码(发ajax请求)
    // const promise = reqRegister({username,password,type})
    //   promise.then(response=>{
    //   const result = response.data;
    //   if(result.code === 0){//成功
    //     //分发成功的action
    //     dispatch(authSuccess(result.data))
    //   }else{//失败
    //     //分发失败的action
    //     dispatch(errorMsg(result.msg))
    //   }
    // })
    const response = await reqRegister({username, password, type})
    const result = response.data;
    // console.log(result);
    if (result.code === 0) {//成功
      getChatMsgs(dispatch,result.data._id)
      //分发成功的action
      dispatch(authSuccess(result.data))
    } else {//失败
      //分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
}

//登录的异步action
export function login(user) {
  const {username, password} = user;
  return async dispatch => {
    // 进行前台表单验证, 如果不通过, 分发失败的同步action对象
    if (!username) {
      dispatch(errorMsg("必须指定用户名"))
      return
    } else if (!password) {
     dispatch(errorMsg("必须指定用户密码"))
      return
    }

    const response = await reqLogin(username, password)//reqLogin方法定义的时候是传两个参数
    const result = response.data;
    if (result.code === 0) {//成功
      getChatMsgs(dispatch,result.data._id)
      //分发成功的action
      dispatch(authSuccess(result.data))
    } else {//失败
      //分发失败的action
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新用户的异步action
export function updateUser(user){
  return async dispatch =>{
    const response = await reqUpdateUser(user)
    const result = response.data;//{code:0,data:user} {code:1,msg:xxx}
    if (result.code === 0) {//成功
      //分发成功的action
      dispatch(recieveUser(result.data))
    } else {//失败
      //分发失败的action
      dispatch(resetUser(result.msg))
    }
  }
}


//获取当前用户的异步action
export function getUser(){
  return  async dispatch =>{
    const response = await reqUser()
    const result = response.data;
    if(result.code ===0){
      getChatMsgs(dispatch,result.data._id)
      dispatch(recieveUser(result.data))
    }else{
      dispatch(resetUser(result.data))
    }
  }
}

//获取指定分类的用户列表的异步action
export function getUserList(type){
  return async dispatch =>{
    const response = await reqUsers(type)
    const result = response.data;
    if(result.code === 0){
      dispatch(receiveUserList(result.data))
    }
  }
}


// 连接服务器, 得到代表连接的socket对象
const socket = io('ws://localhost:4000');

function initIO(dispatch,meId){
  if(!io.socket){  //保证on()只执行一次
    io.socket = socket
    // 绑定接收服务器发送消息的监听(receiveMsg: chatMsg)
    socket.on('recieveMsg', function (chatMsg) {
      if(meId === chatMsg.to || meId === chatMsg.from){
        // console.log('浏览器端接收到消息:', chatMsg)
        dispatch(receiveChatMsg(chatMsg,meId))
      }
    })
  }
}


//向服务器发送socketio消息的异步action
export function sendMessage({content,from,to}) {
  return dispatch =>{
    // 向服务器发送的消息
    socket.emit("sendMsg",{content,from,to})
    // console.log("sendMsg", {content, from, to});
  }

}

//获取所有当前用户聊天的异步action
async function getChatMsgs(dispatch, meId){
  initIO(dispatch,meId);

  const response = await reqChatMsgList()
  const result = response.data;
  if(result.code===0){
    const {users,chatMsgs} = result.data
    dispatch(receiveChatMsgs({users,chatMsgs,meId}))
  }
}

/*
查看更新未读消息的异步action
 */
export function readChatMsg(from,to) {
  return async dispatch =>{
    const response = await reqReadChatMsg(from)
    const result = response.data
    if(result.code === 0){
      const count = result.data;
      dispatch(chatMsgRead({from,to,count}))
    }
  }
}


import {combineReducers} from 'redux'
import {getRedirectTo} from '../utils'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RESET_USER,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RECEIVE_CHAT_MSGS,
  RECEIVE_CHAT_MSG,
  CHAT_MSG_READ
} from './actions-types';

//产生user的reducer
const initUser = {
  username:'',
  type:'',
  msg:'',
  redirectTo:''
}
function user(state = initUser,action) {
  switch (action.type){
    case AUTH_SUCCESS:
      const user = action.data;
      return {...user,redirectTo:getRedirectTo(user.type,user.header)}
    case ERROR_MSG:
      const msg = action.data;
      return {...state, msg};
    case RECEIVE_USER:
      return action.data;
    case RESET_USER:
      return {...initUser, msg:action.data}
    default:
      return state;
  }
}

//产生userlist的reducer
const initUserList = []
function userList(state=initUserList,action){
  switch(action.type){
    case RECEIVE_USER_LIST:
      return action.data
    default:
      return state
  }
}


//产生chat相关数据的reducer
const initChat = {
  users:{},
  chatMsgs:[],
  unReadCount:0 //总得未读数量
}
function chat(state=initChat,action){
  switch(action.type){
    case RECEIVE_CHAT_MSGS:
      var {users,chatMsgs,meId} = action.data;
      return {
        users,
        chatMsgs,
        unReadCount:chatMsgs.reduce(function (preCount,msg) {
          return preCount + (!msg.read && msg.to === meId ? 1 : 0)
        },0)
      }
    case RECEIVE_CHAT_MSG:
      var {chatMsg, meId }= action.data
      return {
        users:state.users,
        chatMsgs:[...state.chatMsgs,chatMsg],
        unReadCount: state.unReadCount + !chatMsg.read && chatMsg.to === meId ? 1 : 0
      }
    case CHAT_MSG_READ:
      const {from ,to,count} = action.data
      return {
        users:state.users,
        chatMsgs:state.chatMsgs.map(msg =>{
          if(msg.from === from && msg.to === to && !msg.read){
            return {...msg, read:true}
          }
          return msg
        }),
        unReadCount: state.unReadCount - count
      }
    default:
      return state
  }
}

//合并多个reducer,生成一个新的reducer
//返回的状态,是包含所有状态的对象:{user:xxx}

export default combineReducers({
  user,
  userList,
  chat
})














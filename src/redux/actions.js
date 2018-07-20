/*
包含n个action creator函数的模块
同步action:对象( 与action type 一一对应)
异步action:函数
*/
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER
} from './actions-types';

import {
  reqRegister,
  reqLogin,
  reqUpdateUser
} from '../api'

//成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
//失败的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});
//接收用户同步action
const recieveUser = (user) =>({type:RECEIVE_USER,data:user});
//重置用户同步action
const resetUser = (msg) =>({type:RESET_USER,data:msg});



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


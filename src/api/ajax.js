/*
发送ajax请求函数模块
函数返回promise对象
 */
import axios from 'axios';

export default function ajax(url = '', data = {}, type = 'GET') {
  if(type === 'GET'){ //发送get请求
   //将data中的所有数据拼接到url中
    //username=Tom&password=123
    let dataStr = '';
    Object.keys(data).forEach(key =>{//keys()方法得到是data所有属性名组成的数组
      const value = data[key];
      dataStr += key + "=" + value + "&";
    })
    if(dataStr){//username=Tom&password=123&
      //去掉最后的&
      dataStr = dataStr.substring(0,dataStr.length-1)
      url = "?" + dataStr
    }
    return axios.get(url)
  }else{
    //发送post请求
    return axios.post(url,data)
  }
}










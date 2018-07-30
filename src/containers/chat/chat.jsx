/*
聊天主界面
 */


import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Grid,NavBar, List, InputItem,Icon} from 'antd-mobile'

import {sendMessage,readChatMsg} from '../../redux/actions'
const Item = List.Item

class Chat extends Component {
  state = {
    content:'',
    isShow:false
  }
  send = ()=>{
    const {content} = this.state;
    const to = this.props.match.params.userid;
    const from = this.props.user._id
    this.props.sendMessage({content,from,to})
    this.setState({content:''})
  };

  componentWillMount(){
    const emojisStr = '❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤🐰🎥🍂👨💪🎓🔥🎃😞😟😤😢😭😦😧😨😩😁😃😂❤😉😊😋😎🇨🇳🐰🎥🍂👨💪🎓🔥🎃😞😟😤😢😭😦😧😨😩😁😃😂❤'
    const emojis = [];
    emojisStr.split('').forEach(emoji =>{
      emojis.push({
        text: emoji
      })
    })
    this.emojis = emojis
  }

  componentDidMount() {
    // 初始显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentDidUpdate () {
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentWillUnmount(){
    //更新为已读
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    this.props.readChatMsg(from,to)
  }

  toggleShow = () =>{
    const isShow = !this.state.isShow
    if(isShow){
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'))
      },0)
    }
    this.setState({isShow})
  }


  render() {
    const targetId = this.props.match.params.userid;
    const {users,chatMsgs} = this.props.chat;
    if(!users[targetId]) { // users中没有数据
      return null // 暂时不做任何显示
    }
    // console.log(chatMsgs);
    // console.log(users);
    const {user} = this.props;
    const meId = user._id;
    const chatId = [targetId,meId].sort().join('_');
    //对chatMsg进行过滤得到我与targetId的所有chatMsg的数据
    const msgs = chatMsgs.filter(msg =>msg.chat_id === chatId )
    const targetIcon = require(`../../assets/imgs/${users[targetId].header}.png`)
    return (
      <div id='chat-page'>
        <NavBar
          className="fix-top"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          {users[targetId].username}
        </NavBar>
        <List style={{marginTop:50, marginBottom:50}}>
          {
            msgs.map(msg =>{
              // console.log(msg);

              if(msg.to === meId){
                return (
                  <Item
                    key={msg._id}
                    thumb={targetIcon}
                  >
                    {msg.content}

                  </Item>
                )
              }else{
                return (
                  <Item
                    key={msg._id}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>

        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            onChange={(val) =>this.setState({content:val})}
            value={this.state.content}
            extra={
              <div>
                <span onClick={this.toggleShow} style={{marginRight:10}}>😀</span>
                <span onClick={this.send}>发送</span>
              </div>
            }
          />
          {
            this.state.isShow ?(
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({content: this.state.content + item.text})
                }}
              />
            ) : null
          }
        </div>

      </div>
    )
  }
}

export default connect(
  state => ({user:state.user,chat:state.chat}),
  {sendMessage,readChatMsg}
)(Chat)

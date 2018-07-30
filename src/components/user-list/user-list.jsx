import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Card, WhiteSpace,WingBlank } from 'antd-mobile';
import {withRouter} from 'react-router-dom'

class UserList extends Component {
  static propTypes = {
    userList:PropTypes.array.isRequired
  }

  render(){
    const userList = this.props.userList.filter(user=>user.header)//只显示有头像的
    return(
      <WingBlank style={{marginBottom:50,marginTop:50}}>
        {
          userList.map(user=>(
            <div key={user._id}>
              <WhiteSpace/>
              <Card onClick={()=>this.props.history.push(`/chat/${user._id}`)}>
                <Card.Header
                  thumb={require(`../../assets/imgs/${user.header}.png`)}
                  extra={<span>{user.username}</span>}
                />
                <Card.Body>
                  <div>职位:{user.post}</div>
                  <div>描述:{user.info}</div>
                  {user.company ? <div>公司:{user.company}</div> :null}
                  {user.salary ? <div>薪资:{user.salary}</div> :null}
                </Card.Body>
              </Card>
            </div>
          ))
        }
      </WingBlank>
    )
  }
}
export default withRouter(UserList)


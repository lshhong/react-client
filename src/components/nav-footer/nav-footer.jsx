import React, {Component} from 'react';
import {TabBar} from 'antd-mobile'
import {PropTypes} from 'prop-types'
import {withRouter} from 'react-router-dom'

class NavFooter extends Component {
  static propTypes = {
    navList:PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  }

  render(){
    // console.log(this.props.navList);
    const navList = this.props.navList.filter(nav=> !nav.hide)
    const path = this.props.location.pathname;
    // console.log(navList);
    //根据数据数组生成数组标签
    return(
      <TabBar>
        {
          navList.map(nav =>(
            <TabBar.Item key={nav.path}
              badge={nav.path === '/message' ? this.props.unReadCount : 0}
              title={nav.text}
              icon={{uri: require(`./imgs/${nav.icon}.png`)}}
              selectedIcon={{uri: require(`./imgs/${nav.icon}-selected.png`)}}
              selected={nav.path===path}
              onPress={()=>this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    )
  }
}

export default withRouter(NavFooter)
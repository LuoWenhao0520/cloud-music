import React, { useState, useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import Player from '../Play';

import {
  Top,
  Tab,
  TabItem
} from './style'

import { renderRoutes } from 'react-router-config'

function Home(props){
  const [state, setState] = useState()

  const { route } = props

  useEffect(() => {

  }, [])

  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont serach">&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
      </Tab>
      { renderRoutes(route.routes) }
      <Player></Player>
    </div>
  )
}

export default React.memo(Home)
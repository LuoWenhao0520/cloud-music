import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config';

import { filterIndex } from '../../api/utils';
import Scroll from '../../baseUI/scroll';

import { EnterLoading } from '../Singers/style'
import Loading from '../../baseUI/loading'

import { getRankList } from './store'

import { Container, List, ListItem, SongList } from './style'

function Rank(props){
  const { rankList: list, loading } = props;

  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS() : []

  let globalStartIndex = filterIndex(rankList)
  let officalList = rankList.slice(0,globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)
  
  let displayStyle = loading ? {"display": "none"} : {"display": ""};

  useEffect(() => {
    getRankListDataDispatch()
  }, [])

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  }

  const renderRankList = (list,global) => {
    return (
      <List globalRank={ global }>
        {
          list.map(item => {
            return (
              <ListItem
                key={item.coverImgId}
                tracks={ item.tracks }
                onClick={ () => enterDetail (item)}
              >
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt=""></img>
                  <div className="decorate"></div>
                  <span className="update_frequecy">{ item.updateFrequency }</span>
                </div>
                { renderSongList(item.tracks) }
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item,index) => {
            return <li key={index}>{index+1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
            { renderRankList(officalList) }
          <h1 className="global" style={ displayStyle }>全球榜</h1>
            { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
        </div>
      </Scroll>
      {renderRoutes (props.route.routes)}
    </Container>
  )
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank','rankList']),
  loading: state.getIn(['rank','loading'])
})

const mapDispatchToProps = (dispatch) => ({
  getRankListDataDispatch() {
    dispatch(getRankList());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))
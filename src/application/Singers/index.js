import React, { useState, useEffect, useContext } from 'react';
import Horizen from '../../baseUI/horizen-item';

import { categoryTypes, alphaTypes } from '../../api/config'

import { NavContainer, List, ListItem, ListContainer } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';

import * as actionCreators from './store/actionCreators'

import { connect } from 'react-redux';
import { CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY } from './data';
import { renderRoutes } from 'react-router-config';

import { Data } from './data';


function Singers(props){
  const { data, dispatch } = useContext(CategoryDataContext)
  const { category, alpha } = data.toJS()

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props

  const { pullUpRefreshDispatch, pullDownRefreshDispatch } = props;

  const { updateDispatch, getHotSingerDispatch } = props


  

  let handleClickCategroy = (val) => {
    dispatch({type: CHANGE_CATEGORY, data: val})
    updateDispatch(val,alpha)
  }

  let handleClickAlpha = (val) => {
    dispatch({type: CHANGE_ALPHA, data: val})
    updateDispatch(category,val)
  }

  let handlePullUp = () => {
    console.log('PullUp');
    pullUpRefreshDispatch(category,alpha,category === '',pageCount);
  }

  let handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  }

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`);
  }

  const renderSingerList = () => {
    return (
      <List>
        {
          singerListJS.map((item,index) => {
            return (
              <ListItem key={item.accountId + '' + index} onClick={ () => enterDetail(item.id) }>
                <div className="img_wrapper">
                  <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"></img>
                </div>
                <span className="name">{ item.name }</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  useEffect(() => {
    getHotSingerDispatch()
    console.log(enterLoading);
  }, [])

  const singerListJS = singerList ? singerList.toJS() : []

  return (
    <div>
      <Data>
        <NavContainer>
          <Horizen
            list={categoryTypes}
            title={"?????? (????????????):"}
            handleClick={(val) => handleClickCategroy(val)}
            oldVal={category}
          ></Horizen>
          <Horizen
            list={alphaTypes}
            title={"?????????:"}
            handleClick={(val) => handleClickAlpha(val)}
            oldVal={alpha}
          ></Horizen>
        </NavContainer>
        <ListContainer>
          <Scroll
            pullUp={ handlePullUp }
            pullDown={ handlePullDown }
            pullUpLoading={ pullUpLoading }
            pullDownLoading={ pullDownLoading }
          >
          { renderSingerList() }
          </Scroll>
          <Loading show={enterLoading}></Loading>
        </ListContainer>
      </Data>
      { renderRoutes(props.route.routes) }
    </div>
    
  )
}

const mapStateToProps = (state) => {
  return {
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(actionCreators.getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(actionCreators.changePageCount(0));//??????????????????????????????pageCount??????
      dispatch(actionCreators.changeEnterLoading(true));//loading?????????????????????????????????????????????????????????????????????loading??????
      dispatch(actionCreators.getSingerList(category, alpha));
    },
    // ????????????????????????????????????
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(actionCreators.changePullUpLoading(true));
      dispatch(actionCreators.changePageCount(count+1));
      if(hot){
        dispatch(actionCreators.refreshMoreHotSingerList());
      } else {
        dispatch(actionCreators.refreshMoreSingerList(category, alpha));
      }
    },
    //??????????????????
    pullDownRefreshDispatch(category, alpha) {
      dispatch(actionCreators.changePullDownLoading(true));
      dispatch(actionCreators.changePageCount(0));//????????????????????????
      if(category === '' && alpha === ''){
        dispatch(actionCreators.getHotSingerList());
      } else {
        dispatch(actionCreators.getSingerList(category, alpha));
      }
    }
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Singers))
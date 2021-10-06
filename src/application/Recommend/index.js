import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'

import Slider from '../../components/slider';
import List from '../../components/list';
import Scroll from '../../baseUI/scroll';

import { forceCheck } from 'react-lazyload'

import Loading from '../../baseUI/loading/index';

import { Content } from './style'
import { renderRoutes } from 'react-router-config';

function Recommend(props){
  const { bannerList, recommendList, enterLoading } = props

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  useEffect(() => {
    if(!bannerList.size)
      getBannerDataDispatch()
    if(!recommendList.size)
      getRecommendListDataDispatch()
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content>
      <Scroll className="list" onScroll={ forceCheck }>
        <div>
          <Slider bannerList={ bannerListJS }></Slider>
          <List recommendList={ recommendListJS }></List>
        </div>
      </Scroll>
      { enterLoading ? <Loading></Loading> : null}
      { renderRoutes (props.route.routes) }
    </Content>
  )
}

const mapStateToProps = (state) => ({
  bannerList: state.getIn(['recommend','bannerList']),
  recommendList: state.getIn(['recommend','recommendList']),
  enterLoading: state.getIn(['recommend','enterLoading'])
})

const mapDispathcToPrpos = dispatch => ({
  getBannerDataDispatch(){
    dispatch(actionCreators.getBannerList());
  },
  getRecommendListDataDispatch() {
    dispatch(actionCreators.getRecommendList())
  }
})

export default connect(mapStateToProps,mapDispathcToPrpos)(React.memo(Recommend))
import { getHotSingerRequest, getSingerListRequest } from "../../../api/request";
import { categoryMap } from "../../../api/config";

import * as actionTypes from './contants'

import { fromJS } from "immutable";

const changeSingerList = (data) => (
  {
    type: actionTypes.CHANGE_SINGER_LIST,
    data: fromJS(data)
  }
)

export const changePageCount = (data) => (
  {
    type: actionTypes.CHANGE_PAGE_COUNT,
    data
  }
)

export const changeEnterLoading = (data) => {
  return {
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
  }
}

//滑动最底部loading
export const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
});

//顶部下拉刷新loading
export const changePullDownLoading = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data
});

export const getHotSingerList = () => dispatch => {
  getHotSingerRequest(0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }
  ).catch(() => {
    console.log('加载热门歌手数据失败');
  })
}

export const refreshMoreHotSingerList = () => (dispatch,getState) => {
  const pageCount = getState().getIn(['singers','pageCount']);
  const singerList = getState().getIn(['singers','singerList']).toJS();
  getHotSingerRequest(pageCount).then(res => {
    const data = [...singerList,...res.artists]
    dispatch(changeSingerList(data))
    dispatch(changePullUpLoading(false))
  }).catch(() => {
    console.log('加载热门歌手数据失败');
  })
}

export const getSingerList = (category, alpha) => (dispatch,getState) => {
  const { type, area } = !!category ? categoryMap.get(category) : {}
  getSingerListRequest(type, area, alpha, 0).then(res => {
    const data = res.artists;
    dispatch(changeSingerList(data));
    dispatch(changeEnterLoading(false));
    dispatch(changePullDownLoading(false));
  })
  .catch(() => {
    console.log('加载歌手数据失败');
  })
}

export const refreshMoreSingerList = (category, alpha) => (dispatch,getState) => {
  const pageCount = getState().getIn(['singers','pageCount'])
  const singerList = getState().getIn(['singers','singerList'])
  const { type, area } = !!category ? categoryMap.get(category) : {}

  getSingerListRequest(type, area, alpha,pageCount).then(res => {
    const data = [...singerList,...res.artists]
    dispatch(changeSingerList(data))
    dispatch(changePullUpLoading(false))
  }).catch(() => {
    console.log('歌手数据获取失败');
  });
}

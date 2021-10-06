import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}

export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}

export const getHotSingerRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

export const getSingerListRequest = (type, area, alpha, offset) => {
  return axiosInstance.get( `/artist/list?${ type && area ? `type=${type}&area=${area}` : '' }&initial=${alpha.toLowerCase()}&offset=${offset}` );
}

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}

export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`);
}

export const getLyricRequest = id => {
  return axiosInstance.get(`/lyric?id=${id}`);
}
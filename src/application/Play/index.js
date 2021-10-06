import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux'

import * as actions from './store/actionCreators'

import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer'
import PlayList from '../PlayList';
import Lyric from '../../api/lyric-parser';

import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils'

import Toast from '../../baseUI/Toast';
import { playMode } from '../../api/config';
import { getLyricRequest } from '../../api/request';

function Player(props){

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modeText, setModeText] = useState('');
  const [preSong, setPreSong] = useState({});
  const [currentPlayLyric, setPlayingLyric] = useState("");
  const songReady = useRef(true);
  const audioRef = useRef()
  const toastRef = useRef()
  const currentLyric = useRef();
  const currentLineNum = useRef(0)

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;



  const { 
    playing,
    currentSong: immutableCurrentSong,
    currentIndex,
    mode,
    sequencePlayList: immutableSequencePlayList,
    playList: immutablePlayList,
    fullScreen
  } = props;
  const { 
    toggleFullScreenDispatch, 
    togglePlayingDispatch, 
    togglePlayListDispatch,
    changeCurrentIndexDispatch, 
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch
  } = props;


  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  }

  const clickPlaying = (e,state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    if(currentLineNum.current){
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if(!playing){
      togglePlayingDispatch(true)
    }
    if(currentLyric.current){
      currentLyric.current.seek(newTime * 1000);
    }
  }

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true)
    audioRef.current.play();
  }

  const handlePrev = () => {
    if(playList.length === 1){
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if(index < 0)
      index = playList.length - 1;
    if(!playing)
      togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }

  const handleNext = () => {
    if(playList.length === 1){
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if(index >= playList.length)
      index = 0;
    if(!playing)
      togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  }

  const handleEnd = () => {
    if(mode === playMode.loop){
      handleLoop();
    }else{
      handleNext();
    }
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if(newMode === 0){
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index)
      setModeText('顺序循环')
    }else if(newMode === 1){
      changePlayListDispatch(sequencePlayList);
      setModeText('单曲循环')
    }else if(newMode === 2){
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong,newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText('随机播放')
    }
    changeModeDispatch(newMode);
    toastRef.current.show()
  }

  const getLyric = id => {
    let lyric = "";
    if(currentLyric.current){
      currentLyric.current.stop();
    }
    getLyricRequest(id)
    .then(data => {
      lyric = data.lrc.lyric;
      if(!lyric){
        currentLyric.current = null;
        return
      }

      currentLyric.current = new Lyric(lyric, handleLyric);

      currentLyric.current.play();
      currentLineNum.current = 0;
      currentLyric.current.seek(0);
      console.log(currentLyric.current);
    })
    .catch(() => {
      console.log('catch');
      songReady.current = true;
      audioRef.current.play();
    })
  }

  const handleLyric = ({lineNum, txt}) => {
    if(!currentLyric.current) return
    currentLineNum.current = lineNum;
    setPlayingLyric(txt)
  }


  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS();
  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList [currentIndex] ||
      playList [currentIndex].id === preSong.id ||
      !songReady.current// 标志位为 false
    )
      return
    let current = playList[currentIndex];
    setPreSong(current)
    songReady.current = false
    changeCurrentDispatch(current);//赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true);//播放状态
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0);//时长
    getLyric(current.id);
  }, [playList, currentIndex]);

  const handleError = () => {
    songReady.current = true;
    alert('播放出错')
  }

 

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  },[playing])


  
  return (
    <div>
      { isEmptyObject(currentSong) ? null : 
        <MiniPlayer
        song={ currentSong }
        fullScreen={ fullScreen }
        toggleFullScreen={ toggleFullScreenDispatch }
        playing={ playing }
        clickPlaying={ clickPlaying }
        duration={ duration }
        currentTime={ currentTime }
        percent={ percent }
        togglePlayList={ togglePlayListDispatch }

      ></MiniPlayer>}
      { isEmptyObject(currentSong) ? null :
      <NormalPlayer
        song={ currentSong }
        fullScreen={ fullScreen }
        toggleFullScreen={ toggleFullScreenDispatch }
        playing={ playing }
        clickPlaying={ clickPlaying }
        onProgressChange={ onProgressChange }
        percent={ percent }
        currentTime={ currentTime }
        duration={ duration }
        handlePrev={ handlePrev }
        handleNext={ handleNext }
        mode={ mode }
        changeMode={ changeMode }
        currentLyric={ currentLyric.current }
        currentPlayLyric={ currentPlayLyric }
        currentLineNum={ currentLineNum.current }
      ></NormalPlayer>}
      {
        isEmptyObject(currentSong) ? null : 
        <PlayList></PlayList>
      }
      <audio 
        ref={ audioRef }
        onTimeUpdate={ updateTime }
        onEnded={ handleEnd }  
        onError={ handleError }
        togglePlayList={ togglePlayListDispatch }
      ></audio>
      <Toast text={ modeText } ref={ toastRef }></Toast>
    </div>
  )
}

const mapStateToProps = state => ({
  fullScreen: state.getIn(['player','fullScreen']),
  playing: state.getIn(['player','playing']),
  sequencePlayList: state.getIn(['player','sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  mode: state.getIn(['player','mode']),
  currentIndex: state.getIn(['player','currentIndex']),
  showPlayList: state.getIn(['player','showPlayList']),
  currentSong: state.getIn(['player','currentSong'])
})

const mapDispatchToProps = dispatch => ({
  togglePlayingDispatch(data) {
    dispatch(actions.changePlayingState(data))
  },
  toggleFullScreenDispatch(data){
    dispatch(actions.changeFullScreen(data))
  },
  togglePlayListDispatch(data){
    dispatch(actions.changeShowPlayList(data))
  },
  changeCurrentIndexDispatch(data){
    dispatch(actions.changeCurrentIndex(data))
  },
  changeCurrentDispatch(data){
    dispatch(actions.changeCurrentSong(data))
  },
  changeModeDispatch(data){
    dispatch(actions.changePlayMode(data))
  },
  changePlayListDispatch(data){
    dispatch(actions.changePlayList(data))
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Player))
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group'
import { BgLayer, CollectButton, Container, ImgWrapper, SongListWrapper } from './style'
import SongsList from "../SongsList";
import { HEADER_HEIGHT } from '../../api/config'

import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll';
import MusicNote from '../../baseUI/music-note';
import { changeEnterLoading, getSingerInfo } from './store/actionCreators';

import { connect } from 'react-redux'

import Loading from '../../baseUI/loading';


function Singer(props) {

  const [showStatus, setShowStatus] = useState(true)
  
  const musicNoteRef = useRef();

  const musicAnimation = (x,y) => {
    musicNoteRef.current.startAnimation({x,y});
  }

  const {
    artist: immutableArtist,
    songs: immutableSongs,
    loading
  } = props;

  const { getSingerDataDispatch } = props;

  const artist = immutableArtist ? immutableArtist.toJS() : {}
  const songs = immutableSongs ? immutableSongs.toJS() : {};

  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    const percent = Math.abs(newY / height)
    if(newY > 0){
      imageDOM.style ["transform"] = `scale (${1 + percent})`;
      buttonDOM.style ["transform"] = `translate3d (0,${newY}px,0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    }else if(newY >= minScrollY){
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;

      buttonDOM.style ["transfrom"] = `translate3d(0,${newY}px,0)`;
      buttonDOM.style ["opacity"] = `${1-percent * 2}`;
    }else if(newY < minScrollY){
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;

      headerDOM.style.zIndex = 100;

      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }
, [])

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();

  const initialHeight = useRef(0)

  const OFFSET = 5;

  useEffect(()=>{
    const id = props.match.params.id;
    getSingerDataDispatch(id);
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h;

    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh();
  }, [])

  const setShowStatusFalse = useCallback(()=>{
    setShowStatus(false);
  }, [])

  return (
    <div>
      <CSSTransition
        in={ showStatus }
        timeout={300}
        classNames="fly"
        appear={true}
        unmountOnExit
        onExited={ () => props.history.goBack() }
      >      
        <Container>
          <Header
            handleClick={setShowStatusFalse}
            title={"头部"}
            ref={header}
          ></Header>
          <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl} >
            <div className="filter"></div>
          </ImgWrapper>
          <CollectButton ref={collectButton}>
            <i className="iconfont">&#xe62d;</i>
            <span className="text">收藏</span>
          </CollectButton>

          <BgLayer ref={layer}></BgLayer>
          <SongListWrapper ref={songScrollWrapper}>
            <Scroll ref={songScroll} onScroll={ handleScroll }>
              <SongsList
                songs={songs}
                showCollect={false}
                musicAnimation={ musicAnimation }
              ></SongsList>
            </Scroll>
          </SongListWrapper>
        { loading ? <Loading></Loading> : null }
        <MusicNote ref={ musicNoteRef }></MusicNote>
        </Container>
      </CSSTransition>
    </div>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(['singerInfo','artist']),
  songs: state.getIn(['singerInfo','songsOfArtist']),
  loading: state.getIn(['singerInfo','loading'])
})

const mapDispatchToProps = dispatch => ({
  getSingerDataDispatch(id){
    dispatch(changeEnterLoading(true));
    dispatch(getSingerInfo(id))
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(Singer)
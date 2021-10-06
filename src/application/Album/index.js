import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Container, TopDesc, Menu, SongList, SongItem } from './style';
import { CSSTransition } from 'react-transition-group'

import SongsList from '../SongsList';

import Header from '../../baseUI/header';
import Scroll from '../../baseUI/scroll';
import MusicNote from '../../baseUI/music-note';
import { getCount, getName, isEmptyObject } from '../../api/utils';

import style from '../../assets/global-style'
import { getAlbumList, changeEnterLoading } from './store/actionCreators';
import { connect } from 'react-redux';

import Loading from '../../baseUI/loading'

export const HEADER_HEIGHT = 45

function Album (props) {

  const [showStatus, setShowStatus] = useState(true)
  const [ isMarquee, setIsMarquee ] = useState(false)
  const [title, setTitle] = useState('歌单')

  const headerEl = useRef();
  const musicNoteRef = useRef();

  const musicAnimation = (x,y) => {
    musicNoteRef.current.startAnimation({x,y});
  }

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, [])

  const handleScroll = (pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);
    let headerDom = headerEl.current;

    if(pos.y < minScrollY){
      headerDom.style.backgroundColor = style['theme-color'];
      headerDom.style.opacity = Math.min(1,(percent-1)/2);
      setTitle(currentAlbum.name)
      setIsMarquee(true);
    }else{
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle('歌单')
      setIsMarquee(false);
    }
  }

  const renderTopDesc = () => {
    return (
      <TopDesc background={ currentAlbum.coverImgUrl }>
        <div className="background">
          <div className="filter"></div>
        </div>

        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={ currentAlbum.coverImgUrl } alt=""/>
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万</span>
          </div>
        </div>

        <div className="desc_wrapper">
          <div className="title">{ currentAlbum.name }</div>
          <div className="person">
            <div className="avatar">
              <img src={ currentAlbum.creator.avatarUrl } alt=""/>
            </div>
            <div className="name">{ currentAlbum.creator.nickname }</div>
          </div>
        </div>
      </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  const renderSongList = () => {
    return (
      <SongsList
        songs={currentAlbum.tracks}
        collectCount={currentAlbum.subscribedCount}
        showCollect={true}
        showBackground={true}
        musicAnimation={musicAnimation}
      >
      </SongsList>
    )
  }

  const id = props.match.params.id;

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props;

  let currentAlbum = currentAlbumImmutable ? currentAlbumImmutable.toJS() : {}


  useEffect(()=>{
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch,id])

  return  !isEmptyObject(currentAlbum) ?  (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header title={title} handleClick={handleBack} ref={headerEl} isMarquee={isMarquee}></Header>
        <Scroll bounceTop={ false } onScroll={ handleScroll }>
          <div>
            { renderTopDesc() }
            { renderMenu() }
            { renderSongList() }
            
          </div>
        </Scroll>
        { enterLoading ? <Loading /> : null }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  ) : null
}

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album','currentAlbum']),
  enterLoading: state.getIn(['album','enterLoading'])
})

const mapDispatchToProps = (dispatch) => ({
  getAlbumDataDispatch(id){
    dispatch(changeEnterLoading(true))
    dispatch(getAlbumList(id))
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Album))
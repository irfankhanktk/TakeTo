import React, { useRef, useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import
  MediaControls, {PLAYER_STATES}
from 'react-native-media-controls';


const VideoPlayer = ({visible, onClose, video, onPress}) => {

  const videoPlayer = useRef()
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [
    playerState, setPlayerState
  ] = useState(PLAYER_STATES.PLAYING);
 

  const [screenType, setScreenType] = useState('content');

  const onSeek = (seek) => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = (playerState) => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = (data) => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onEnd = () => {
    videoPlayer.current.seek(0);
    setCurrentTime(0)
    //onReplay()
    onClose()
  };

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };

  const enterFullScreen = () => {};

  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == 'content') setScreenType('cover');
    else setScreenType('content');
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = (currentTime) => setCurrentTime(currentTime);






  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{margin: 0}}>
      <View
        style={{
          height : '100%',  
          alignSelf: 'center',
          backgroundColor: colors.white,
          width: '100%',
          position: 'absolute',
          bottom: 0,
        }}>

           {<View 
            style={{ 
              height : '100%',
              width : '100%',
              position : 'absolute'
            }}
            >
            <Video
              onError={onError}
              onEnd={onEnd}
              onLoad={onLoad}
              onLoadStart={onLoadStart}
              onProgress={onProgress}
              paused={paused}
              ref={videoPlayer}
              resizeMode={'contain'}
             // onFullScreen={isFullScreen}
              //source={{uri: "https://api.taketo.exodevs.com/storage/threads/9572b823-f1d3-424a-8ea2-83d4786e4bc3/videos/pexels-david-gallie-10275544_1643359915.mp4"}}
              source={{uri : video}}
              style={styles.mediaPlayer}
              volume={10}
            />
            <MediaControls
              duration={duration}
              isLoading={isLoading}
              mainColor="#333"
              //onFullScreen={onFullScreen}
              onPaused={onPaused}
              onReplay={onReplay}
              onSeek={onSeek}
              onSeeking={onSeeking}
              playerState={playerState}
              progress={currentTime}
              // toolbar={renderToolbar()}
              // toolbarStyle = {{backgroundColor:'red'}}
              // sliderStyle = {{bottom:0}}
              containerStyle = {{
                backgroundColor : null
              }}

            />
          </View>}  
          <TouchableOpacity
          onPress = {()=>{
            setCurrentTime(0)
            onClose()
          }
          }
          style = {{
            position : 'absolute',
            right : mvs(22),
            top : mvs(30),
            zIndex : 1000,
            elevation : 10,
            justifyContent:'center',
            alignItems:'center',
            padding : mvs(10),
            }}
          >
          <Icon 
          onPress = {onClose}
          name="close" size={ mvs(30) } 
          color={colors.white} 
          />
          </TouchableOpacity>    
      </View>
    </ReactNativeModal>
  );
};
export default VideoPlayer;
const styles = StyleSheet.create({
  item: {
    paddingVertical: mvs(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.doted,
  },
  container: {
    flex: 1,
  },
  // toolbar: {
  //   marginTop: 30,
  //   backgroundColor: 'white',
  //   padding: 10,
  //   borderRadius: 5,
  // },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});

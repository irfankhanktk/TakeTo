import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  Event,
  useProgress,
  State,
  usePlaybackState,
  RepeatMode,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from 'react-native-slider';
import {mvs} from '../../config/metrices';
import colors from '../../config/colors';

export const MusicPlayer = ({data, msgId, trackId = 0}) => {
  console.log('trackId: ', trackId);
  console.log('data', data);
  const [playUrl, setPlayUrl] = React.useState('');
  const playbackStack = usePlaybackState();
  const progress = useProgress();

//   React.useEffect(() => {
//     (async () => {
//       await setupPlayer();
//       TrackPlayer.skip(trackId);
//     })();
//   }, [playUrl]);

  React.useEffect(() => {
    setPlayUrl(data);
  }, [data]);

  React.useEffect(()=>{
    TrackPlayer.reset()
  },[])

  

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    // if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
    //     const track = await TrackPlayer.getTrack(event.nextTrack);
    //     const {title} = track || {};
    //     setTrackTitle(title);
    // }
    TrackPlayer.seekTo(0);
    TrackPlayer.pause();
  });
  const setupPlayer = async () => {
    const temp = playUrl?.split(/[\s/]+/);
    const audio = temp[temp.length - 1];
    await TrackPlayer.setupPlayer({});
    TrackPlayer.add({
      url: {
        uri: `https://api.taketo.exodevs.com/storage/threads/9572b823-f1d3-424a-8ea2-83d4786e4bc3/audio/${audio}`,
      },
    });
  };
  const togglePlayback = async playbackStack => {
    console.log('tid:', trackId);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      if (playbackStack === State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => togglePlayback(playbackStack)}>
          <Ionicons
            color={colors.primary}
            name={
              playbackStack === State.Playing
                ? `ios-pause-circle`
                : `ios-play-circle-sharp`
            }
            size={20}
          />
        </TouchableOpacity>
        <Slider
          style={{width: mvs(200)}}
          value={progress.position}
          minimumValue={0}
          // buffered={progress.buffered}
          thumbTintColor={colors.primary}
          maximumValue={progress.duration}
          thumbStyle={{height: mvs(15), width: mvs(15)}}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.black}
          onSlidingComplete={async v => {
            await TrackPlayer.seekTo(v);
            // console.log('progress.duration',progress.duration);
            // console.log('progress.position',progress.position);
            // if(progress.duration<=progress.position){
            //     await TrackPlayer.seekTo(0);
            // }
            // if(new Date((progress.duration - progress.position) * 1000).toISOString().substr(14, 5)==='00:00'){
            // }
          }}
          // onValueChange={async(v)=>{
          //     if(progress.duration<=progress.position){
          //         await TrackPlayer.seekTo(0);
          //     }
          // }}
        />
      </View>
      <View style={styles.icon_container}>
        <Text>
          {new Date(progress.position * 1000).toISOString().substr(14, 5)}
        </Text>
        <Text>
          {new Date((progress.duration - progress.position) * 1000)
            .toISOString()
            .substr(14, 5)}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: mvs(10),
    borderTopLeftRadius: mvs(10),
    borderTopEndRadius: mvs(10),
    backgroundColor: colors.white,
    padding: mvs(10),
    marginTop: mvs(15),
    width: mvs(250),
  },
  icon_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: mvs(200),
    paddingLeft: mvs(35),
  },
});

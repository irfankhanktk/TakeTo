import React from 'react';
import {StyleSheet, Text, View, Image, FlatList, ScrollView, Share} from 'react-native';
import Header from '../../../components/molecules/header/header-1x';
import colors from '../../../config/colors';
import * as Images from '../../../../resource/assets/invite-friends';
import Medium from '../../../presentation/typography/medium-text';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import Buttons from '../../../components/atoms/Button';

const InviteFriends = props => {
  const Gift = Images['gift'];
  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="invite friends" allowBackBtn userIcon = {false}/>
      <View style={styles.container}>
        <ScrollView  
        nestedScrollEnabled 
        showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:mvs(100)}}>
        <View style={styles.giftContainer}>
          <Gift />
          <Medium label="Get US$ 10" style={styles.prize} />

          <View style={styles.mixTxts}>
            <Regular label="Earn" style={styles.mixTxt1} />
            <Regular label=" US$ 10" style={styles.mixTxt2} />
            <Regular
              label=" for each friend who uses"
              style={styles.mixTxt1}
            />
            <Regular label=" Taketo." style={styles.mixTxt3} />
          </View>
          <View style={{...styles.mixTxts, marginTop: 0}}>
            <Regular label="Reward them with" style={styles.mixTxt1} />
            <Regular label=" 3 x US$ 3" style={styles.mixTxt2} />
          </View>
        </View>

        <View style={styles.earningContainer}>
          <Regular
            label="Total earnings from invitations"
            style={{...styles.mixTxt1}}
          />
          <Regular
            label="US$ 30"
            style={{...styles.mixTxt2, marginTop: mvs(7)}}
          />

          <View style={{marginTop: mvs(2), width: '100%', height : mvs(180)}}>
            <FlatList
            nestedScrollEnabled
              data={[1,2,4,5,6,7,8]}
              showsVerticalScrollIndicator = {false}
              keyExtractor={(item,index)=>index.toString()}
              renderItem={({item, index}) => (
                <View style={styles.recordMainContainer}>
                  <View style={styles.recordContainer}>
                    <Image source={TAKE_TO_IMAGES.chat_dp} style={styles.dp} />
                    <Regular
                      label="Zenab Thaqi"
                      style={{
                        ...styles.mixTxt1,
                        marginTop: 0,
                        marginLeft: mvs(5),
                      }}
                    />

                    <View
                      style={{
                        ...styles.mixTxts,
                        marginTop: 0,
                        position: 'absolute',
                        right: mvs(6),
                      }}>
                      <Regular
                        label="Rewarded"
                        style={{...styles.mixTxt1,color:colors.primary, marginTop: 0}}
                      />
                      <Regular
                        label=" 3 x US$ 3"
                        style={{...styles.mixTxt2, marginTop: 0}}
                      />
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item?.toString()}
            />
          </View>
        </View>
        </ScrollView>
        <View style={styles.button}>
          <Buttons.ButtonPrimary onClick={() => {Share.share({message : "sharing..."})}} title="Share" />
        </View>
      </View>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  giftContainer: {
    //height : mvs(182.55),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(101.9),
    alignItems: 'center',
  },
  prize: {
    fontSize: mvs(24),
    color: colors.primary,
    marginTop: mvs(34),
  },
  mixTxts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: mvs(7),
  },
  mixTxt1: {
    fontSize: mvs(13),
    color: colors.typeHeader,
  },
  mixTxt2: {
    fontSize: mvs(13),
    color: colors.primary,
  },
  mixTxt3: {
    fontSize: mvs(13),
    color: colors.primary,
  },
  earningContainer: {
    // height: mvs(236),
    paddingVertical: mvs(20),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(40.6),
    //backgroundColor: colors.lightgrey,
    borderRadius: mvs(10),
    alignItems: 'center',
    //paddingHorizontal: mvs(10),
  },
  recordMainContainer: {
    height: mvs(57),
    width: '100%',
    paddingLeft : mvs(10),
    paddingRight : mvs(16),
    //borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    borderColor: colors.price_border,
    backgroundColor : colors.secondary,
    borderRadius : mvs(10),
    marginTop : mvs(10)
  },
  recordContainer: {
    height: mvs(37),
    //borderWidth : 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dp: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(8),
  },
  button: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: mvs(20),
    width: '100%',
  },
});

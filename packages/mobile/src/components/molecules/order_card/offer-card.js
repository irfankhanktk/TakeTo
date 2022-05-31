import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { mvs } from '../../../config/metrices';
import * as Images from '../../../../resource/assets/bank-info-icons';
import colors from '../../../config/colors';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';

const OfferCard = ({
  image,
  name,
  price,
  deliveryOn,
  deliveryBefore,
  type,
  style,
  onClick,
  ...props
}) => {
  const Check = Images['check'];
  const CrossYellow = Images['cross_yellow'];
  const CrossPink = Images['cross_pink'];
  console.log(type)
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{ ...styles.mainContainer, ...style }}>
      <View style={styles.statusContainer}>
        {type == 'rejected' ? (
          <CrossPink />
        ) : type == 'Disputed' ? (
          <CrossYellow />
        ) : type == 'accepted' ? (
          <Check />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.offerMainContainer}>
        <View style={styles.userInfoContainer}>
          <ImagePlaceholder bg_img={image} containerStyle={styles.image} />
          <View style={styles.midContainer}>
            <Regular label={name} style={styles.name} />
            <Regular label="Delivery on" style={styles.title1} />
          </View>
          <View style={styles.endContainer}>
            <Regular label={price} style={styles.price} />
            <Regular label={deliveryOn} style={{ ...styles.title1, color: colors.typeHeader }} />
          </View>
        </View>

        <View
          style={{
            ...styles.userInfoContainer,
            height: null,
            marginTop: mvs(4),
            justifyContent: 'space-between',
          }}>
          <Regular
            label={"Status"}
            style={{
              ...styles.title1,
              color: colors.lightgrey2,
              marginLeft: mvs(37 + 10),
            }}
          />
          {/* {type != 'rejected' && type != 'Disputed' && ( */}
          <Regular
            label={type === 'rejected' ? "Rejected" : type === 'Disputed' ? 'Disputed' : type === 'accepted' ? 'Accepted' : 'Open'}
            style={{
              ...styles.title1, color:
                type === 'rejected' ? colors.pink : type === 'Disputed' ? colors.disputes : type === 'accepted' ? colors.green : colors.primary
            }}
          />
          {/* )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  mainContainer: {
    height: mvs(71),
    //borderWidth : 1,
    flexDirection: 'row',
  },
  statusContainer: {
    height: '100%',
    width: mvs(24),
    justifyContent: 'center',
    //borderWidth : 1
  },
  offerMainContainer: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,//0.5
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    padding: mvs(10),
    borderColor: colors.price_border,
    backgroundColor: colors.white,
  },
  userInfoContainer: {
    height: mvs(37),
    width: '100%',
    //borderWidth : 1,
    borderColor: 'green',
    flexDirection: 'row',
  },
  image: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(8),
  },
  midContainer: {
    height: '100%',
    marginLeft: mvs(10),
    //borderWidth : 1,
    borderColor: 'red',
    justifyContent: 'space-around',
  },
  name: {
    fontSize: mvs(12),
    color: colors.typeHeader,
  },
  title1: {
    fontSize: mvs(9),
    color: colors.lightgrey2,
  },
  endContainer: {
    height: '100%',
    marginLeft: mvs(2),
    //borderWidth : 1,
    borderColor: 'red',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
  },
  price: {
    fontSize: mvs(13),
    color: colors.primary,
  },
});

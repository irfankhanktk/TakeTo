import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Animated,
  TouchableOpacity,
  Linking,
} from 'react-native';

import colors from '../../../config/colors';
import Regular from '../../../presentation/typography/regular-text';
import * as Images from '../../../../resource/assets/order-car-icons';
import { mvs } from '../../../config/metrices';
import InputWithTitle from '../input-with-title';

function OrderDetailsAnimated({
  deliveryBefore,
  quantity,
  packaging,
  site,
  instruction,
  product_details,
  order_data,
  location,
  ...props
}) {
  const Location = Images['location_active'];
  const RightIcon = Images['right'];

  const [collapsed, setCollapsed] = useState(true);
  const [rotate, setRotate] = useState(true);
  const [mHeight, setMHeight] = useState(58);
  const [spin, setSpin] = useState('0deg');
  const animationHeight = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setRotate(!rotate);
  };

  const collapseView = () => {
    Animated.timing(animationHeight, {
      duration: 500,
      toValue: mvs(58),
      // useNativeDriver:true
    }).start();
  };

  const expandView = () => {
    Animated.timing(animationHeight, {
      duration: 500,
      toValue: mvs(400),
      // useNativeDriver:true
    }).start();
  };

  const Down = () => {
    Animated.timing(rotation, {
      duration: 300,
      toValue: 1,
      // useNativeDriver:true
    }).start();
  };

  const Right = () => {
    Animated.timing(rotation, {
      duration: 300,
      toValue: 0,
      // useNativeDriver:true
    }).start();
  };

  useEffect(() => {
    if (collapsed) {
      collapseView();
    } else {
      expandView();
    }
  }, [collapsed]);

  useEffect(() => {
    if (rotate) {
      Right();
    } else {
      Down();
    }
  }, [rotate]);

  const rotationValue = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View
      style={{
        overflow: 'hidden',
        backgroundColor: colors.white,
        borderRadius: mvs(10),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.doted,
      }}>
      <Animated.View style={{ maxHeight: animationHeight }}>
        <View
          style={{
            ...styles.normal,
            //height : mvs(mHeight)
          }}>
          <View style={styles.titleContainer}>
            <Regular label="More Details" style={styles.title} />
            <TouchableOpacity activeOpacity={1} onPress={toggleCollapsed}>
              <Animated.View style={{ transform: [{ rotate: rotationValue }] }}>
                <RightIcon />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <InputWithTitle
            title="Product Details"
            value={product_details}
            textStyle={{ color: colors.primary }}
            style={{ marginTop: mvs(23) }}
            editable={false}
            singleInput={false}
            moreOrLess={true}
          />

          <View style={{ ...styles.infoContainer, marginTop: mvs(17) }}>
            <Regular label="Deliver Before" style={styles.label} />
            <Regular label={deliveryBefore} style={styles.value} />
          </View>

          {/* <View style = {styles.line}></View> */}

          <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
            <Regular label="Quantity" style={styles.label} />
            <Regular label={quantity} style={styles.value} />
          </View>

          <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
            <Regular label="Packaging" style={styles.label} />
            <Regular label={packaging} style={styles.value} />
          </View>

          <View style={{ ...styles.infoContainer, marginTop: mvs(14) }}>
            <Regular label="Where to buy" style={styles.label} />

            <Regular
              onPress={() => {
                order_data?.order_site &&
                  Linking.openURL(order_data?.order_store_url);
              }}
              label={
                order_data?.order_site ||
                (order_data?.order_shop_name?.length > 8
                  ? `${order_data?.order_shop_name?.substring(0, 8)} ...`
                  : order_data?.order_shop_name)
              }
              style={{
                ...styles.value,
                color: colors.primary,
                fontSize: mvs(12),
              }}
            />

            {Object?.keys(location).length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  console.log('order_data:', order_data?.shop_location);
                  const region = {
                    latitude: order_data?.shop_location?.latitude,
                    longitude: order_data?.shop_location?.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  };
                  props.navigation.navigate('storelocation', {
                    shopRegion: region,
                    order_data: order_data,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: mvs(6),
                }}>
                <Location />
                <Regular
                  label="Store location"
                  style={{
                    ...styles.value,
                    marginLeft: mvs(7.3),
                    color: colors.primary,
                    fontSize: mvs(12),
                  }}
                />
              </TouchableOpacity>
            )}
          </View>

          <InputWithTitle
            title="Buying Instructions"
            value={instruction}
            textStyle={{ color: colors.primary }}
            style={{ marginTop: mvs(17) }}
            editable={false}
            singleInput={false}
            moreOrLess={true}
          />
        </View>
      </Animated.View>
      {/* <Button title="Toggle Collapsed"  /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 14,
    fontWeight: 'bold',
  },
  normal: {
    //height  : mvs(58),
    width: '100%',
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(20),
    //justifyContent : 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(20.3),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: mvs(13),
    color: colors.headerTitle,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    //borderWidth : 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: mvs(13),
    color: colors.lightgrey2,
  },
  value: {
    fontSize: mvs(13),
    color: colors.typeHeader,
  },
  line: {
    width: '100%',
    borderBottomWidth: 0.3,
    borderColor: colors.horizontalLine,
    marginTop: mvs(11),
  },
});

export default OrderDetailsAnimated;

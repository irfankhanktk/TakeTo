import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const OrderDestination = ({
  SVGFirst,
  SVGSecond,
  label = ' - - - - - - - - - - - - - - - - - - - - - - ',
  value = 1,
  liveActive = false,
  isReverse = false,
  isDeliver = false,
  width = mvs(55),
  containerStyle,
  dotColor = colors.primary
}) => {
  return (
    <View style={{ ...styles.CONTAINER, flexDirection: isReverse ? 'row-reverse' : 'row', ...containerStyle }}>
      <SVGFirst style={{
        transform: [{ rotate: isReverse ? '180deg' : '0deg' }],
        position: 'absolute',
        left: 0
      }} />
      {value == 0 ? (
        // <Regular
        //   label={label}
        //   style={{
        //     textAlign: 'center',
        //     fontSize: mvs(8),
        //     color:liveActive&&!isDeliver?colors.white: colors.pathline,
        //   }}
        // />
        <View style={{ borderWidth: StyleSheet.hairlineWidth, borderRadius: 1, borderStyle: 'dashed', width: '100%', height: 0, borderColor: colors.doted }}></View>
      ) : value === 1 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            //borderWidth : 1,
            width: '100%',
          }}>
          <View
            style={{
              width: '50%',
              backgroundColor: colors.primary,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.primary,
              //borderWidth : 1
            }}
          />
          <View
            style={{
              height: mvs(15),
              width: mvs(15),
              borderRadius: mvs(7.5),
              backgroundColor: dotColor,
            }}
          />
          <View
            style={{
              width: '40%',
              borderStyle: 'dashed',
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.pathline,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            //borderWidth : 1
          }}>
          <View
            style={{
              width: '90%',//width?width:mvs(110),

              backgroundColor: colors.primary,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.primary,
            }}
          />
          <View
            style={{
              height: mvs(15),
              width: mvs(15),
              borderRadius: mvs(7.5),
              borderColor: colors.primary,
              backgroundColor: dotColor,
            }}
          />
        </View>
      )}
      <SVGSecond style={{
        position: 'absolute',
        right: mvs(1)
      }} />
    </View>
  );
};

export default OrderDestination;

const styles = StyleSheet.create({
  CONTAINER: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    //borderWidth : 1,
    paddingHorizontal: mvs(30),
    overflow: 'hidden',
    height: mvs(22)
  },
});

// import React from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import colors from '../../config/colors';
// import {mvs} from '../../config/metrices';
// import Regular from '../../presentation/typography/regular-text';

// const OrderDestination = ({
//   SVGFirst,
//   SVGSecond,
//   label = ' - - - - - - - - - - - - - - - - - - - - - - ',
//   value = 1,
//   liveActive=false,
//   isReverse=false,
//   isDeliver=false,
//   width= mvs(55),
//   containerStyle
// }) => {
//   return (
//     <View style={{...styles.CONTAINER,flexDirection:isReverse?'row-reverse': 'row',...containerStyle,}}>
//       <SVGFirst style={{transform:[{rotate:isReverse?'180deg':'0deg'}]}}/>
//       {value == 0 ? (
//         <Regular
//           label={label}
//           style={{
//             textAlign: 'center',
//             fontSize: mvs(8),
//             color:liveActive&&!isDeliver?colors.white: colors.pathline,
//           }}
//         />
//       ) : value === 1 ? (
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: width,
//              
//               derWidth: StyleSheet.hairbackgroundColor:lineWidth,
//               borderColor: colors.primary,
//             }}
//           />
//           <View
//             style={{
//               height: mvs(15),
//               width: mvs(15),
//               borderRadius: mvs(7.5),
//              
//             }}   backgroundColor:        />
//           <View
//             style={{
//               width: width,
//               borderStyle: 'dashed',
//               borderWidth: StyleSheet.hairlineWidth,
//               borderColor: colors.pathline,
//             }}
//           />
//         </View>
//       ) : (
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: width?width:mvs(110),
//              
//               derWidth: StyleSheet.hairbackgroundColor:lineWidth,
//               borderColor: colors.primary,
//             }}
//           />
//           <View
//             style={{
//               height: mvs(15),
//               width: mvs(15),
//               borderRadius: mvs(7.5),
//              
//             }}   backgroundColor:        />
//         </View>
//       )}
//       <SVGSecond />
//     </View>
//   );
// };

// export default OrderDestination;

// const styles = StyleSheet.create({
//   CONTAINER: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '97%',
//   },
// });


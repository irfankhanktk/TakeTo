//core
import React from 'react';
import {
  StyleSheet, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
// import { getScaleValueFromWidthPer, HP, palette } from "../config";
//exnternal
//internal imports
const BottomMenu = props => {
  // const { colors } = useTheme()
  const { isGuest } = props
  const {
    state: { index, routes },
    navigation,
    descriptors,
    style,
    showGuestAlert
  } = props;
  return (
    <View
      // elevation={1}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: mvs(83),
        paddingHorizontal: mvs(22),
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
        backgroundColor: colors.white,
        overflow: 'hidden',
        width: '100%',
        ...style,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
      }}>
      {routes.map((route, idx) => {
        const { options } = descriptors[route.key];

        const isFocused = index === idx;

        const icon =
          options.tabBarIcon !== undefined
            ? options.tabBarIcon(isFocused, 'white', 10)
            : null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            isGuest ?
              showGuestAlert()
              // navigation.navigate("login")
              :
              navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={1}
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              // flex: 1,
              backgroundColor: `transparent`,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.customIcon}>
              {icon}
              <Regular
                label={route.name}
                style={{
                  fontSize: mvs(10),
                  color: colors.headerTitle,
                  color: isFocused ? colors.primary : colors.headerTitle,
                  textAlign: 'center',
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  customIcon: {
    height: mvs(83),
    // width: mvs(83),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// export default BottomMenu;
const mapStateToProps = (state) => {
  return {
    isGuest: state.auth.isGuest,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postSigninData: (data) => dispatch(TAKE_TO_ACTIONS.postSigninData(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(BottomMenu)

import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ReactNativeModal from 'react-native-modal';
import { connect } from 'react-redux';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Buttons from '../../atoms/Button';
import CustomRadio from '../../atoms/RadioButton';

const SortModal = ({ visible, onClose, onOkResult, sort_by_list, onApply }) => {
  const alertRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [forgotPayload, setForgotPayload] = React.useState({
    email: '',
    otp: '',
  });
  const [selected, setSelected] = React.useState('newest_posts')
  const [radioLabels, setRadioLabels] = React.useState({})

  React.useEffect(() => {
    setRadioLabels(sort_by_list)
  }, [])

  const onClosing = () => {
    if (!loading) {
      onClose();
    }
  };

  // const ifRadio = key => {
  //   switch (key) {
  //     case radioLabels.highest_reward:
  //       return setRadioLabels({ ...radioLabels, highest_reward: selected });
  //     case radioLabels.lowest_reward:
  //       return setRadioLabels({ ...radioLabels, lowest_reward: selected });
  //     case radioLabels.newest_posts:
  //       return setRadioLabels({ ...radioLabels, newest_posts: selected });
  //     case radioLabels.oldest_posts:
  //       return setRadioLabels({ ...radioLabels, oldest_posts: selected });
  //     case radioLabels.lowest_product_price:
  //       return setRadioLabels({ ...radioLabels, lowest_product_price: selected });
  //     case radioLabels.highest_product_price:
  //       return setRadioLabels({ ...radioLabels, highest_product_price: selected });
  //     default:
  //       return false;
  //   }
  // };


  const _returnActiveSortType = () => {
    // console.log(Object)
    onApply(selected)
  }

  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackButtonPress={() => onClosing()}
      onBackdropPress={() => onClosing()}
      onSwipeComplete={() => onClosing()}
      swipeDirection="down"
      style={{ margin: 0 }}>
      <View style={{ ...styles.CONTAINER }}>
        <Medium label={'Sort Results'} style={styles.FORGOT_TXT} />
        <View
          style={{
            ...styles.SUB_CONTAINER,
            paddingBottom: Platform.OS == 'ios' ? mvs(30) : mvs(17),
          }}>
          <View style={styles.RADIO_CONTAINER}>
            {
              Object.keys(radioLabels).map((element, index) => {
                const label = radioLabels[element]
                // console.log(element)
                return (
                  <CustomRadio
                    key={index}
                    labelStyle={{
                      color: selected===element
                        ? colors.primary
                        : colors.headerTitle,
                    }}
                    style={styles.BUTTON}
                    status={selected===element}
                    label={label}
                    onChange={() => {
                      setSelected(element)
                    }}
                  />
                )
              })
            }
          </View>
          <View style={styles.BUTTON_CONTAINER}>
            <Buttons.ButtonPrimary
              loading={loading}
              loaderColor={colors.white}
              disabled={loading}
              onClick={() => _returnActiveSortType()}
              style={styles.RESET}
              title={'Apply'}
            />
            <Buttons.ButtonSecondaryOutline
              onClick={onClose}
              style={styles.RESET}
              title={'Cancel'}
            />
          </View>
        </View>
      </View>

      <DropdownAlert zIndex={5}  elevation={15}
        translucent
        activeStatusBarStyle={'light-content'}
        inactiveStatusBarBackgroundColor={colors.primary}
        ref={alertRef}
      />
    </ReactNativeModal>
  );
};
const mapStateToProps = state => {
  return {
    sort_by_list: state.common?.langauge?.translations?.sort_by || {},
  };
};


export default connect(mapStateToProps, {})(SortModal);

const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.primary,
  },
  FORGOT_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: mvs(22),
    paddingVertical: mvs(17),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    paddingTop: mvs(30)
  },
  RESET: {
    width: '49%',
  },
  BUTTON_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  RADIO_CONTAINER: {
    marginBottom: mvs(18),
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between'
  },
  RADIO_LABEL: {
    color: colors.headerTitle,
    fontSize: mvs(15),
  },
  RADIO_ROW: {
    //borderWidth:1,  

  },
  BUTTON_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BUTTON: {
    width: '45%',
    marginBottom: mvs(23),
    //borderWidth:1
  },
});

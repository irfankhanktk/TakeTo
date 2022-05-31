import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import CustomSwitch from '../../atoms/Switch';
import DualText from '../dual-text/dual-text';
import SettingCard from './setting-card';

const ApprovedSettingCard = ({heading, type, ...props}) => {
  const [payload, setPayload] = React.useState({
    isPromotionEmail: true,
    isOrderEmail: true,
    isSms: false,
  });
  return (
    <View style={{width:'100%',}}>
      <Regular label="Logo" style={styles.logo} />

      <View style={styles.statusContainer}>
        <Regular label={heading} style={styles.status} />
      </View>
      {props.children}

      <SettingCard heading={'Make sure your notifications are on'} style={{}}>
        <DualText
          // onPress={()=>alert('sdsd')}
          content={'You will be notified when you start receiving Offers'}
          //   highlightText={'Taketo.'}
        />
        <CustomSwitch
          value={payload.isOrderEmail}
          label={'Email'}
          onChange={v => setPayload({...payload, isOrderEmail: v})}
        />
        <CustomSwitch
          style={{marginTop: mvs(28)}}
          value={payload.isSms}
          label={'SMS'}
          onChange={v => setPayload({...payload, isSms: v})}
        />
      </SettingCard>
    </View>
  );
};

export default ApprovedSettingCard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    borderWidth: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: mvs(34),
    alignSelf:'center',
    color: colors.headerTitle,
    marginTop: mvs(20),
  },
  statusContainer: {
    height: mvs(39),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mvs(10),
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    width: '100%',
    borderColor: colors.label,
  },
  status: {
    fontSize: mvs(15),
    color: colors.green,
  },
});

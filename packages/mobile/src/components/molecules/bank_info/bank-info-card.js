import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';
import CountryPicker from '../country-picker';
import * as Images from './../../../../resource/assets/bank-info-icons';

const BankInfoCard = ({
  name,
  primary,
  country,
  bankname,
  accountno,
  iban,
  ...props
}) => {
  const Flag = Images['flag'];
  const Check = Images['check_blue'];
  const Dots = Images['dots'];
  return (
    <View style={styles.mainContainer}>
      <Regular label="Ralph Wakim" style={styles.name} />
      {/* <View style={styles.type}>
        <Regular label="Primary" style={{fontSize: mvs(12), color : colors.primary}}/>
        <Check height={mvs(14.93)} width={mvs(18.62)} style={styles.check}/>
      </View> */}

      <View style={styles.dots}>
        <Dots />
      </View>


      <View style={styles.rowContainer}>
        <View style={styles.title}>
          <Regular label="Country" style={{ color: colors.typeHeader, fontSize: mvs(15) }} />
        </View>
        {/* <CountryPicker
            style = {{
              backgroundColor : colors.white,
              height : mvs(30)
            }}
            textStyle = {{fontSize : mvs(12)}}
            flag = {true}
            /> */}
        <Buttons.ButtonRTL onClick={()=>{}} textStyle={{ color: colors.primary }} title={'Kuwait'} style={{ width: '49%', flexDirection: 'row-reverse', backgroundColor: colors.secondary, height: mvs(38) }} iconName='flag' />
      </View>

      <View style={{ ...styles.rowContainer, marginTop: mvs(10), }}>
        <Regular label="Bank Name" style={{ color: colors.typeHeader, fontSize: mvs(15) }} />
        {/* <TAKE_TO_INPUT_FIELD.InputSecondary value='Gulf Bank' labelStyle={{marginBottom:0}} containerStyle={{width:'49%',marginTop:0,marginBottom:0,}} style={{width:'100%',backgroundColor:colors.secondary,}}/> */}
        {/* <View style = {styles.title}>
              <Regular label = "Bank Name" style = {{color : colors.typeHeader, fontSize: mvs(15)}}/>  
            </View>*/}
        <TextInput
          style={styles.input}
          value="Gulf Bank"
          editable={false}
        />
      </View>

      <View style={{ ...styles.rowContainer, marginTop: mvs(10) }}>
        <View style={styles.title}>
          <Regular label="Account Number" style={{ color: colors.typeHeader, fontSize: mvs(15) }} />
        </View>
        <TextInput
          style={styles.input}
          value="1932 345* ****"
          editable={false}
        />
      </View>

      {/* <View style={{ ...styles.rowContainer, marginTop: mvs(10) }}>
        <View style={styles.title}>
        </View>
      </View> */}

      <View style={{ ...styles.rowContainer, marginTop: mvs(10) }}>
          <Regular label="IBAN" style={{ color: colors.typeHeader, fontSize: mvs(15) }} />
        <TextInput
          style={{ ...styles.input, width: "84%", fontSize: mvs(12) }}
          value="KWLB0000001932345*******"
          editable={false}
        />
      </View>
    </View>
  );
};

export default BankInfoCard;

const styles = StyleSheet.create({
  mainContainer: {
    //height: mvs(230),
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(45),
    paddingBottom: mvs(20)
  },
  countryInputMainContainer: {
    height: mvs(30),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(3),
    borderRadius: mvs(10),
    backgroundColor: colors.white,
    paddingHorizontal: mvs(10),
    justifyContent: 'center',
  },
  label: {
    fontSize: mvs(12),
    color: colors.pathline,
    //marginTop : mvs(8)
  },
  value: {
    fontSize: mvs(12),
    color: colors.headerTitle,
    position: 'absolute',
    left: mvs(150),
    //marginTop : mvs(8)
  },
  flag: {
    position: 'absolute',
    right: mvs(10),
  },
  name: {
    fontSize: mvs(15),
    color: colors.primary,
    position: 'absolute',
    left: mvs(10),
    top: mvs(22),
  },
  type: {
    flexDirection: 'row',
    position: 'absolute',
    left: "56%",
    top: mvs(25),
    //borderWidth :1
  },
  check: {
    marginLeft: mvs(10)
  },
  dots: {
    position: 'absolute',
    right: mvs(20),
    top: mvs(20),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: mvs(11),
  },
  title: {
    height: mvs(38),
    width: "49%",
    borderRadius: mvs(10),
    justifyContent: 'center',
  },
  input: {
    //borderWidth:1,
    width: '49%',
    height: mvs(38),
    backgroundColor: colors.secondary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    color: colors.primary,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    justifyContent: 'center',
    padding: 0
  },
});

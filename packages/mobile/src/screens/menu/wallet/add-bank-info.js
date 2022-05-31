import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { StyleSheet, TextInput, View, ScrollView } from 'react-native';
import * as Images from '../../../../resource/assets/bank-info-icons';
import Buttons from '../../../components/atoms/Button';
import CountryPicker from '../../../components/molecules/country-picker';
import Header from '../../../components/molecules/header/header-1x';
import InputWithTitle from '../../../components/molecules/input-with-title';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';


const AddBankInfo = props => {
  const Flag = Images['flag'];

  return (
    <View style={styles.mainContainer}>
      <Header
        {...props}
        title={'Wallet'}
        allowBackBtn
        avatar
      />
      <View style={styles.container}>
        <ScrollView 
        contentContainerStyle={styles.scroll}
        >
          <Regular
            label={'Add bank account'}
            style={styles.mainTitle}
          />

          <Regular label="Ralph Wakim" style={styles.name} />
          
          <View style = {styles.rowContainer}>
            <View style = {styles.title}>
              <Regular label = "Country" style = {{color : colors.typeHeader}}/>  
            </View>
            <CountryPicker
            flag = {true}
            />
          </View>

          <View style = {{...styles.rowContainer, marginTop : mvs(10)}}>
            <View style = {styles.title}>
              <Regular label = "Bank Name" style = {{color : colors.typeHeader}}/>  
            </View>
            <TextInput
            style = {styles.input} 
            value = "Gulf Bank"
            />
          </View>

          <View style = {{...styles.rowContainer, marginTop : mvs(10)}}>
            <View style = {styles.title}>
              <Regular label = "Account Number" style = {{color : colors.typeHeader}}/>  
            </View>
            <TextInput
            style = {styles.input} 
            value = "1932 345* ****"
            />
          </View>

          <View style = {{...styles.rowContainer, marginTop : mvs(10)}}>
            <View style = {styles.title}>
              <Regular label = "IBAN" style = {{color : colors.typeHeader}}/>  
            </View>
          </View>

          <View style = {{...styles.rowContainer, marginTop : mvs(10)}}>
            <TextInput
            style = {{...styles.input, width : "100%", color : colors.primary}} 
            value = "KWLB0000001932345*******"
            />
          </View>


          <View style={styles.button}>
            <Buttons.ButtonPrimary
              onClick={() => props.navigation.navigate('wallet', {state: true})}
              title="Save Payout"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddBankInfo;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow : 1,
    paddingBottom: mvs(200),
    paddingHorizontal: mvs(22),
  },
  container: {
    flex: 1,
    paddingTop:mvs(27)
  },
  mainTitle: {
    fontSize: mvs(15),
    color: colors.headerTitle,
    //marginTop: mvs(32),
  },
  name: {
    fontSize: mvs(15),
    color: colors.primary,
    marginTop: mvs(33),
    marginBottom: mvs(1),
  },
  inputContainer: {
    height: mvs(36),
    width: '100%',
    marginTop: mvs(10),
    borderRadius: mvs(10),
    backgroundColor: colors.lightgrey,
    justifyContent: 'center',
  },
  label: {
    fontSize: mvs(15),
    color: colors.pathline,
    marginLeft: mvs(10),
  },
  input: {
    //borderWidth:1,
    width: '49%',
    height: mvs(38),
    backgroundColor : colors.secondary,
    borderRadius : mvs(10),
    paddingHorizontal: mvs(10),
    color : colors.primary,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    justifyContent : 'center',
    padding : 0
  },
  flag: {
    position: 'absolute',
    right: mvs(10),
  },
  button: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: mvs(40),
    // marginTop:mvs(200)
    // alignSelf:'stretch'
  },
  rowContainer: {
    flexDirection : 'row', 
    alignItems : 'center', 
    width : '100%', 
    justifyContent : 'space-between', 
    marginTop : mvs(16),
  },
  title: {
    height : mvs(38), 
    width : "49%", 
    //backgroundColor : colors.secondary, 
    borderRadius : mvs(10), 
    //paddingHorizontal : mvs(10), 
    justifyContent:'center',
  }
});

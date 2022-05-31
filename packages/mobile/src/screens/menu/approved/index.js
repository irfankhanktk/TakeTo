import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { mvs } from '../../../config/metrices';
import Buttons from '../../../components/atoms/Button';
import CustomSwitch from '../../../components/atoms/Switch';
import DualText from '../../../components/molecules/dual-text/dual-text';
import Header from '../../../components/molecules/header/header-1.5x';
import ApprovedSettingCard from '../../../components/molecules/setting_card/approved-setting-card';
import SettingCard from '../../../components/molecules/setting_card/setting-card';
import colors from '../../../config/colors';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';

const Approved = (props) => {

  const [state, setState] = useState(0)

  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="Zenab Thaqi" allowBackBtn/>
      <View style={styles.container}>
        <ApprovedSettingCard heading="Product Accepted">
          <View style={{marginVertical: mvs(20)}}>
            {state == 0 &&<>
              <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              content={'Congratulations'}
              highlightText={'Ralph Wakim'}>
              <DualText
                highlightTextStyle={{color: colors.green}}
                style={{
                  textAlign: 'center',
                  color: colors.headerTitle,
                  fontSize: mvs(13),
                }}
                content={`,\nyou just closed a deal for a`}
                highlightText="US$ 90 reward"
              />
            </DualText>
            <Regular
              style={{textAlign: 'center', fontSize: mvs(13)}}
              label={
                '\nPlease proceed to sending the buyer pictures of their product as soon as possible.'
              }
            />
            </>}
            
            {state == 1 && <DualText
              style={{
                textAlign: 'center',
                color: colors.primary,
                fontSize: mvs(13),
              }}
              highlightText={'Thank you for contacting us.'}
              highlightTextStyle = {{fontSize : mvs(13)}}
              >
              <DualText
                highlightTextStyle={{color: colors.green}}
                style={{
                  textAlign: 'center',
                  color: colors.headerTitle,
                  fontSize: mvs(13),
                }}
                content={`\nWe will investigate your dispute and get back to you as soon as possible.`}
              />
            </DualText>}


            {state == 2 && <>
              <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              content={'Thank you for Trusting'}
              highlightText={'Taketo.'}
              highlightTextStyle={{fontSize : mvs(13)}}
              >
            </DualText>
            <Regular
              style={{textAlign: 'center', fontSize: mvs(13)}}
              label={
                '\nPlease proceed to sending the buyer pictures of their product as soon as possible.'
              }
            />
            </>
            }



            {state == 3 && <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              highlightText={'Zenab Thaqi'}
              highlightTextStyle = {{fontSize : mvs(13)}}
              >
              <DualText
                highlightTextStyle={{color: colors.green}}
                style={{
                  textAlign: 'center',
                  color: colors.headerTitle,
                  fontSize: mvs(13),
                }}
                content={`is notified to proceed to delivering your product.`}
              />
            </DualText>}


            {state == 4 && <>
            <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              content={'Congratulations'}
              highlightText={'Ralph Wakim'}
              highlightTextStyle = {{fontSize : mvs(13)}}
              >
              <DualText
                highlightTextStyle={{color: colors.green}}
                style={{
                  textAlign: 'center',
                  color: colors.headerTitle,
                  fontSize: mvs(13),
                }}
                content={`,\nThe product was accepted by the buyer.`}
              />
            </DualText>
            <Regular
              style={{textAlign: 'center', fontSize: mvs(13)}}
              label={
                '\nPlease proceed to sending the buyer pictures of their product as soon as possible.'
              }
            />
            </>
            }


            {state == 5 && <>
            <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              content={'Thank you for using'}
              highlightText={'Taketo.'}
              highlightTextStyle = {{fontSize : mvs(13)}}
              >
              <DualText
                highlightTextStyle={{color: colors.green}}
                style={{
                  textAlign: 'center',
                  color: colors.headerTitle,
                  fontSize: mvs(13),
                }}
                content={`\nThe Buyer is excited to receive their product soon, make sure you deliver it on time`}
              />
            </DualText>
            <Regular
              style={{textAlign: 'center', fontSize: mvs(13)}}
              label={
                '\nPlease proceed to sending the buyer pictures of their product as soon as possible.'
              }
            />
            </>
            }


            {state == 6 && <>
            <DualText
              style={{
                textAlign: 'center',
                color: colors.headerTitle,
                fontSize: mvs(13),
              }}
              content={'Thank you for Trusting '}
              highlightText={'Taketo.'}
              highlightTextStyle = {{fontSize : mvs(13)}}
              >
             </DualText>
            <Medium
              style={{textAlign: 'center', fontSize: mvs(30), color : colors.green, marginTop : mvs(28)}}
              label={
                'US$ 90'
              }
            />
            <DualText 
            style={{
              textAlign: 'center',
              color: colors.headerTitle,
              fontSize: mvs(13),
            }}
            content={'was credited to your balance.'}
            ></DualText>
            </>
            }

          </View>
        </ApprovedSettingCard>
        <View style = {{position : 'absolute', alignSelf : 'center', width : '100%', bottom : mvs(40)}}>
        {/* <Buttons.ButtonPrimaryLight 
        onClick = { () => {} }
        title = "Send a Receipt" style = {{}}/> */}
        {<Buttons.ButtonRTL
            onClick={() => {
              if(state < 6){
                setState(state + 1)
              }
              else{
                setState(0)
              }
            }}
            iconName={'reorder'}
            title={'Reorder'}
            style={{
              justifyContent: 'center',
            }}
            textStyle={{color: colors.white, marginLeft: mvs(13)}}
            iconStyle={{height: mvs(20), width: mvs(20)}}
          />}
        <Buttons.ButtonPrimaryLight 
        onClick = { () => props.navigation.navigate('chat') }
        title = "Send a Product picture" style = {{marginTop : mvs(10)}}/>
        </View>
      </View>
    </View>
  );
};

export default Approved;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    alignItems: 'center',
  },
});

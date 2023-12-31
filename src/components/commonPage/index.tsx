import {View, Text, TouchableOpacity, Button} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import CommonInput from '../commonInput';
import styles from './styles';
import fonts from '../../assets/fonts';

// interface Common {
//   headerText: string;
//   inputVal: [];
// }

const CommonPage = ({
  headerText,
  inputVal,
  btnText,
  orText,
  btnNav,
  inputkeybrdValues,
  secureVal,
  validate = () => {},
  onupdatetext,
  onsubmitvalues,
  passRefVal,
  blurOnSubmitVal,
  returnKeyTypeVal,
  // opacity,
}) => {
  const values = [...inputVal];
  const keybrdValues = [...inputkeybrdValues];
  const secureTextValues = [...secureVal];
  const onsubmitEditingvalues = [...onsubmitvalues];
  const passRefValues = [...passRefVal];
  const blurOnSubmitValues = [...blurOnSubmitVal];
  const returnKeyTypeValues = [...returnKeyTypeVal];
  const {navigate} = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      <View style={styles.inputCardView}>
        {/* {secureTextValues === false ? (
          <View style={styles.inputView}>
            <CommonInput
              plcHolder={values}
              keybrdType={keybrdValues}
              secureText={secureTextValues}
              onUpdateText={onupdatetext}
              passRef={passRefValues}
              onSubmitEditting={onsubmitEditingvalues}
              blurOnSubmitOne={blurOnSubmitValues}
              returnKeyTypeFirst={returnKeyTypeValues}
            />
          </View>
        ) : (
          <View style={styles.inputView}>
            <CommonInput
              plcHolder={values}
              keybrdType={keybrdValues}
              secureText={secureTextValues}
              onUpdateText={onupdatetext}
              passRef={passRefValues}
              onSubmitEditting={onsubmitEditingvalues}
              blurOnSubmitOne={blurOnSubmitValues}
              returnKeyTypeFirst={returnKeyTypeValues}
            />
          </View>
        )} */}
        <View style={styles.inputView}>
          <CommonInput
            plcHolder={values}
            keybrdType={keybrdValues}
            secureText={secureTextValues}
            onUpdateText={onupdatetext}
            passRef={passRefValues}
            onSubmitEditting={onsubmitEditingvalues}
            blurOnSubmitOne={blurOnSubmitValues}
            returnKeyTypeFirst={returnKeyTypeValues}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.lgnBtn,
            // {opacity: opacity}
          ]}
          onPress={validate}>
          <Text style={styles.lgnText}>{btnText}</Text>
        </TouchableOpacity>
        <Text style={{color: 'white', fontFamily: fonts.MEDIUMITALIC}}>Or</Text>
        <TouchableOpacity
          onPress={() => {
            navigate(btnNav);
          }}>
          <Text
            style={{
              margin: 10,
              color: 'white',
              fontFamily: fonts.MEDIUMITALIC,
            }}>
            {orText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonPage;

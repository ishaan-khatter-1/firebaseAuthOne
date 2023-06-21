import {View, Text, TextInput} from 'react-native';
import React from 'react';
import styles from './styles';

const CommonInput = ({
  plcHolder,
  keybrdType,
  secureText,
  opacityBtn,
  onSubmitEditting,
  passRef,
  onUpdateText = () => {},
  blurOnSubmitOne,
  returnKeyTypeFirst,
}) => {
  return (
    <View>
      {plcHolder.map((item, index) => (
        <TextInput
          key={index}
          style={styles.inputStyle}
          placeholder={item}
          keyboardType={keybrdType[index]}
          secureTextEntry={secureText[index]}
          onChangeText={val => onUpdateText(index, val)}
          onSubmitEditing={onSubmitEditting[index]}
          ref={passRef[index]}
          blurOnSubmit={blurOnSubmitOne[index]}
          returnKeyType={returnKeyTypeFirst[index]}

          // ref={ref => (passRef[index] = ref)}
          // onEndEditing={opacityPass}
          // ref={pass_ref[index]}
          // blurOnSubmit={blurOnSubmit}
        />
      ))}
    </View>
  );
};

export default CommonInput;

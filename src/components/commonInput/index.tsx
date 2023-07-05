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
      {/* {plcHolder.map((item, index) => ( */}
      <TextInput
        // key={index}
        style={styles.inputStyle}
        placeholder={plcHolder}
        keyboardType={keybrdType}
        secureTextEntry={secureText}
        onChangeText={val => onUpdateText(val)}
        onSubmitEditing={onSubmitEditting}
        ref={passRef}
        blurOnSubmit={blurOnSubmitOne}
        returnKeyType={returnKeyTypeFirst}

        // ref={ref => (passRef[index] = ref)}
        // onEndEditing={opacityPass}
        // ref={pass_ref[index]}
        // blurOnSubmit={blurOnSubmit}
      />
      {/* ))} */}
    </View>
  );
};

export default CommonInput;

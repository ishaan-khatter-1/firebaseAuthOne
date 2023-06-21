import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Lottie from 'lottie-react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import ColorConstants from '../../assets/colorContants';
import styles from './styles';

const SplashScreen = () => {
  const {dispatch} = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      dispatch(StackActions.replace('Login'));
    }, 2000);
  }, []);

  return (
    <View style={styles.splashHeader}>
      <Lottie
        source={require('../../assets/lottieFiles/lottie1.json')}
        style={{height: 400}}
        autoPlay
      />
      {/* <Text>Hello</Text> */}
    </View>
  );
};

export default SplashScreen;

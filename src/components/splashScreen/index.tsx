import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Lottie from 'lottie-react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import ColorConstants from '../../assets/colorContants';
import styles from './styles';
import Auth from '@react-native-firebase/auth';

const SplashScreen = () => {
  const {dispatch} = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      const unsubscribe = Auth().onAuthStateChanged(userData => {
        console.log(userData);
        userData !== null
          ? dispatch(StackActions.replace('Home'))
          : dispatch(StackActions.replace('Login'));
      });
      unsubscribe();
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
